export function formatPrice(price) {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format a date string (YYYY-MM-DD) to Hungarian format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date (pl. "2015. május 3.")
 */
export function formatDateTime(dateString) {
  if (!dateString) return "—";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

const ORDER_STATUS_MAP = {
  pending: 'Feldolgozás alatt',
  confirmed: 'Visszaigazolva',
  shipped: 'Szállítás alatt',
  delivered: 'Kiszállítva',
  cancelled: 'Törölve',
}

const PAYMENT_STATUS_MAP = {
  pending: 'Függőben',
  paid: 'Fizetve',
  failed: 'Sikertelen',
  refunded: 'Visszatérítve',
}

const SHIPPING_METHOD_MAP = {
  magyar_posta: 'Magyar Posta (MPL)',
  sajat_szallitas: 'Saját szállítás',
}

export function formatOrderStatus(status) {
  return ORDER_STATUS_MAP[status] || status
}

export function formatPaymentStatus(status) {
  return PAYMENT_STATUS_MAP[status] || status
}

export function formatShippingMethod(method) {
  return SHIPPING_METHOD_MAP[method] || method
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  
  try {
    const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
    return new Intl.DateTimeFormat('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString; // Return original if parsing fails
  }
}
