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
