import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BARION_BASE = Deno.env.get('BARION_ENV') === 'prod'
  ? 'https://api.barion.com'
  : 'https://api.test.barion.com'

serve(async (req) => {
  try {
    // Barion POST-tal küldi a PaymentId-t – lehet query param, JSON body vagy form-urlencoded
    const url = new URL(req.url)
    let PaymentId = url.searchParams.get('PaymentId')

    if (!PaymentId) {
      const contentType = req.headers.get('content-type') || ''
      const bodyText = await req.text()

      if (contentType.includes('application/json')) {
        try {
          const json = JSON.parse(bodyText)
          PaymentId = json.PaymentId
        } catch (_) {}
      }

      if (!PaymentId && bodyText) {
        const params = new URLSearchParams(bodyText)
        PaymentId = params.get('PaymentId')
      }
    }

    if (!PaymentId) {
      console.error('Callback: Missing PaymentId')
      return new Response('OK', { status: 200 })
    }

    const posKey = Deno.env.get('BARION_POSKEY') ?? ''
    const stateUrl = `${BARION_BASE}/v2/Payment/GetPaymentState?POSKey=${posKey}&PaymentId=${PaymentId}`

    const stateRes = await fetch(stateUrl)
    const stateData = await stateRes.json()

    if (stateData.Errors?.length > 0) {
      console.error('Barion GetPaymentState errors:', stateData.Errors)
      return new Response('OK', { status: 200 })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const barionStatus = stateData.Status
    let paymentStatus = 'pending'
    let orderStatus = null

    if (barionStatus === 'Succeeded') {
      paymentStatus = 'paid'
      orderStatus = 'confirmed'
    } else if (['Canceled', 'Expired', 'Failed'].includes(barionStatus)) {
      paymentStatus = 'failed'
    }

    const updateData: Record<string, string> = { payment_status: paymentStatus }
    if (orderStatus) {
      updateData.status = orderStatus
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('barion_payment_id', PaymentId)

    if (error) {
      console.error('Order update error:', error)
    }

    // Barion mindig 200-at vár vissza
    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('Callback error:', err)
    return new Response('OK', { status: 200 })
  }
})
