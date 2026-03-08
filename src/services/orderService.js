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
 * Fizetés állapotának aktív ellenőrzése a Barion API-n keresztül.
 * @param {string} orderId - Rendelés UUID
 * @returns {Promise<Object|null>} - { payment_status } vagy null hiba esetén
 */
export async function verifyPaymentStatus(orderId) {
  const { data, error } = await supabase.functions.invoke('barion-verify', {
    body: { orderId },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
  })

  if (error) {
    console.error('barion-verify hiba:', error)
    return null
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

/**
 * Rendelés lekérése tételekkel együtt (publikus rendeléskövetés).
 * @param {string} orderId - Rendelés UUID
 * @returns {Promise<Object|null>}
 */
export async function fetchOrderWithItems(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single()

  if (error) return null
  return data
}

/**
 * Összes rendelés lekérése az admin panelhez.
 * @returns {Promise<Array>}
 * @throws {Error}
 */
export async function fetchAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, customer_name, customer_email, customer_phone, status, payment_status, total_amount_huf, is_read, shipping_method, shipping_name, shipping_zip, shipping_city, shipping_address, notes, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Hiba a rendelések betöltése közben.')
  }

  return data || []
}

/**
 * Rendelés frissítése upsert mintával (CORS workaround).
 * @param {string} id - Rendelés UUID
 * @param {Object} updates - Frissítendő mezők
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function updateOrder(id, updates) {
  const { data: existing, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) {
    throw new Error('Hiba a rendelés lekérése közben.')
  }

  const { error } = await supabase
    .from('orders')
    .upsert({ ...existing, ...updates })

  if (error) {
    throw new Error('Hiba a rendelés frissítése közben.')
  }
}

/**
 * Rendelés állapotának frissítése (admin).
 * @param {string} id - Rendelés UUID
 * @param {string} newStatus - pending/confirmed/shipped/delivered/cancelled
 * @returns {Promise<void>}
 * @throws {Error}
 */
export async function updateOrderStatus(id, newStatus) {
  return updateOrder(id, { status: newStatus })
}

/**
 * Rendelés megjelölése olvasottként.
 * @param {string} id - Rendelés UUID
 * @returns {Promise<void>}
 */
export async function markOrderAsRead(id) {
  return updateOrder(id, { is_read: true })
}

/**
 * Rendelés megjelölése olvasatlanként.
 * @param {string} id - Rendelés UUID
 * @returns {Promise<void>}
 */
export async function markOrderAsUnread(id) {
  return updateOrder(id, { is_read: false })
}
