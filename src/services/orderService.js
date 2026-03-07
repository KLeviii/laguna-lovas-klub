import { supabase } from './supabase'

/**
 * Barion fizetés indítása az Edge Function-ön keresztül.
 * @param {Object} orderData - { customer, shipping, items, notes, total_amount_huf }
 * @returns {Promise<{ gatewayUrl: string, orderId: string }>}
 */
export async function startBarionPayment(orderData) {
  const { data, error } = await supabase.functions.invoke('barion-start', {
    body: orderData,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
  })

  if (error) {
    let detail = error.message
    try {
      const body = await error.context?.json()
      detail = body?.detail || body?.error || error.message
      console.error('barion-start hiba:', body)
    } catch (_) {}
    throw new Error(detail || 'Hiba a fizetés indítása közben.')
  }

  if (!data?.gatewayUrl) {
    console.error('barion-start válasz:', data)
    throw new Error(data?.detail || data?.error || 'Nem sikerült a fizetési oldal elérése.')
  }

  return data
}

/**
 * Rendelés lekérése ID alapján (success/fail oldalakhoz).
 * @param {string} orderId
 * @returns {Promise<Object|null>}
 */
export async function fetchOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, payment_status, total_amount_huf, created_at')
    .eq('id', orderId)
    .single()

  if (error) return null
  return data
}
