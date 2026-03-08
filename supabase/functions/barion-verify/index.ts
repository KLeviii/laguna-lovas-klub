import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const BARION_BASE = Deno.env.get('BARION_ENV') === 'prod'
  ? 'https://api.barion.com'
  : 'https://api.test.barion.com'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Missing orderId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Rendelés lekérése
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('barion_payment_id, payment_status')
      .eq('id', orderId)
      .single()

    if (fetchError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Ha már végleges státusz, nem kell Barion API hívás
    if (order.payment_status === 'paid' || order.payment_status === 'failed') {
      return new Response(
        JSON.stringify({ payment_status: order.payment_status }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!order.barion_payment_id) {
      return new Response(
        JSON.stringify({ error: 'No Barion payment ID found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Barion GetPaymentState hívás
    const posKey = Deno.env.get('BARION_POSKEY') ?? ''
    const stateUrl = `${BARION_BASE}/v2/Payment/GetPaymentState?POSKey=${posKey}&PaymentId=${order.barion_payment_id}`

    const stateRes = await fetch(stateUrl)
    const stateData = await stateRes.json()

    if (stateData.Errors?.length > 0) {
      console.error('Barion GetPaymentState errors:', stateData.Errors)
      return new Response(
        JSON.stringify({ error: 'Barion API error', details: stateData.Errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Státusz leképezés (ugyanaz mint barion-callback-ban)
    const barionStatus = stateData.Status
    let paymentStatus = 'pending'
    let orderStatus = null

    if (barionStatus === 'Succeeded') {
      paymentStatus = 'paid'
      orderStatus = 'confirmed'
    } else if (['Canceled', 'Expired', 'Failed'].includes(barionStatus)) {
      paymentStatus = 'failed'
    }

    // Rendelés frissítése
    const updateData: Record<string, string> = { payment_status: paymentStatus }
    if (orderStatus) {
      updateData.status = orderStatus
    }

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', orderId)

    if (updateError) {
      console.error('Order update error:', updateError)
    }

    return new Response(
      JSON.stringify({ payment_status: paymentStatus }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Verify error:', err)
    return new Response(
      JSON.stringify({ error: 'Unexpected error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
