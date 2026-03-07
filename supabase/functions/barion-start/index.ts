import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { customer, shipping, items, notes, total_amount_huf } = body

    if (!customer?.email || !items?.length || !total_amount_huf) {
      return new Response(
        JSON.stringify({ error: 'Hiányzó kötelező mezők.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Rendelés mentése DB-be
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone || null,
        shipping_name: shipping.name,
        shipping_zip: shipping.zip,
        shipping_city: shipping.city,
        shipping_address: shipping.address,
        shipping_country: shipping.country || 'Magyarország',
        notes: notes || null,
        shipping_method: shipping.method,
        shipping_cost_huf: shipping.cost_huf,
        payment_method: 'barion',
        payment_status: 'pending',
        status: 'pending',
        total_amount_huf,
      })
      .select('id')
      .single()

    if (orderError) {
      console.error('Order insert error:', JSON.stringify(orderError))
      return new Response(
        JSON.stringify({ error: 'Hiba a rendelés létrehozásakor.', detail: orderError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const orderId = order.id

    // Tételek mentése
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(items.map((item: Record<string, unknown>) => ({
        order_id: orderId,
        product_id: item.productId,
        product_name: item.name,
        unit_price_huf: item.price_huf,
        quantity: item.quantity,
      })))

    if (itemsError) {
      console.error('Order items error:', JSON.stringify(itemsError))
      return new Response(
        JSON.stringify({ error: 'Hiba a tételek mentésekor.', detail: itemsError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Barion items összeállítása
    const barionItems: Array<Record<string, unknown>> = items.map((item: Record<string, unknown>) => ({
      Name: item.name,
      Description: item.name,
      Quantity: item.quantity,
      Unit: 'db',
      UnitPrice: item.price_huf,
      ItemTotal: (item.price_huf as number) * (item.quantity as number),
    }))

    if ((shipping.cost_huf as number) > 0) {
      barionItems.push({
        Name: 'Szállítási költség',
        Description: shipping.method === 'magyar_posta' ? 'Magyar Posta' : 'Saját szállítás',
        Quantity: 1,
        Unit: 'db',
        UnitPrice: shipping.cost_huf,
        ItemTotal: shipping.cost_huf,
      })
    }

    const barionEnv = Deno.env.get('BARION_ENV')
    const barionBase = barionEnv === 'prod' ? 'https://api.barion.com' : 'https://api.test.barion.com'
    const appUrl = Deno.env.get('APP_URL') ?? 'http://localhost:5173'
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''

    const barionPayload = {
      POSKey: Deno.env.get('BARION_POSKEY'),
      PaymentType: 'Immediate',
      GuestCheckOut: true,
      FundingSources: ['All'],
      PaymentRequestId: orderId,
      Currency: 'HUF',
      Locale: 'hu-HU',
      RedirectUrl: `${appUrl}/penztar/sikeres?orderId=${orderId}`,
      CallbackUrl: `${supabaseUrl}/functions/v1/barion-callback`,
      Transactions: [{
        POSTransactionId: orderId,
        Payee: Deno.env.get('BARION_PAYEE_EMAIL') ?? '',
        Total: total_amount_huf,
        Items: barionItems,
      }],
    }

    const barionRes = await fetch(`${barionBase}/v2/Payment/Start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(barionPayload),
    })

    const barionData = await barionRes.json()

    if (barionData.Errors?.length > 0) {
      console.error('Barion errors:', JSON.stringify(barionData.Errors))
      return new Response(
        JSON.stringify({ error: 'Hiba a Barion fizetés indításakor.', details: barionData.Errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // barion_payment_id visszaírása
    await supabaseAdmin
      .from('orders')
      .update({ barion_payment_id: barionData.PaymentId })
      .eq('id', orderId)

    return new Response(
      JSON.stringify({ gatewayUrl: barionData.GatewayUrl, orderId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Unexpected error:', err instanceof Error ? err.message : String(err))
    return new Response(
      JSON.stringify({ error: 'Váratlan hiba történt.', detail: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
