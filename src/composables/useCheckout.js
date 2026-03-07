import { ref, computed } from 'vue'
import { useCart } from '@/composables/useCart'
import { startBarionPayment } from '@/services/orderService'

const SHIPPING_OPTIONS = [
  {
    id: 'magyar_posta',
    name: 'Magyar Posta (MPL)',
    description: 'Házhozszállítás, 2–3 munkanap',
    price_huf: 1490,
    icon: 'bi-envelope-fill',
  },
  {
    id: 'sajat_szallitas',
    name: 'Saját szállítás',
    description: 'Cég általi kiszállítás, 5–7 munkanap',
    price_huf: 2000,
    icon: 'bi-truck',
  },
]

const PAYMENT_OPTIONS = [
  {
    id: 'barion',
    name: 'Barion (bankkártya)',
    description: 'Biztonságos online bankkártyás fizetés a Barion rendszerén keresztül.',
    icon: 'bi-credit-card-2-front-fill',
  },
]

export function useCheckout() {
  const { cartItems, cartTotal, clearCart } = useCart()

  const customerName = ref('')
  const customerEmail = ref('')
  const customerPhone = ref('')

  const shippingName = ref('')
  const shippingZip = ref('')
  const shippingCity = ref('')
  const shippingAddress = ref('')
  const notes = ref('')

  const selectedShipping = ref('magyar_posta')
  const selectedPayment = ref('barion')

  const loading = ref(false)
  const error = ref(null)

  const selectedShippingOption = computed(() =>
    SHIPPING_OPTIONS.find((o) => o.id === selectedShipping.value)
  )

  const shippingCost = computed(() => selectedShippingOption.value?.price_huf ?? 0)

  const grandTotal = computed(() => cartTotal.value + shippingCost.value)

  function validateForm() {
    if (!customerName.value.trim()) throw new Error('A név megadása kötelező.')
    if (!customerEmail.value.trim()) throw new Error('Az email cím megadása kötelező.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.value.trim())) {
      throw new Error('Érvénytelen email cím formátum.')
    }
    if (!shippingName.value.trim()) throw new Error('A szállítási név megadása kötelező.')
    if (!shippingZip.value.trim()) throw new Error('Az irányítószám megadása kötelező.')
    if (!/^\d{4}$/.test(shippingZip.value.trim())) {
      throw new Error('Az irányítószám 4 számjegyű kell legyen.')
    }
    if (!shippingCity.value.trim()) throw new Error('A város megadása kötelező.')
    if (!shippingAddress.value.trim()) throw new Error('A cím megadása kötelező.')
  }

  async function submitOrder() {
    loading.value = true
    error.value = null

    try {
      validateForm()

      const payload = {
        customer: {
          name: customerName.value.trim(),
          email: customerEmail.value.trim(),
          phone: customerPhone.value.trim() || null,
        },
        shipping: {
          name: shippingName.value.trim(),
          zip: shippingZip.value.trim(),
          city: shippingCity.value.trim(),
          address: shippingAddress.value.trim(),
          country: 'Magyarország',
          method: selectedShipping.value,
          cost_huf: shippingCost.value,
        },
        items: cartItems.value.map((item) => ({
          productId: item.productId,
          name: item.name,
          price_huf: item.price_huf,
          quantity: item.quantity,
        })),
        notes: notes.value.trim() || null,
        total_amount_huf: grandTotal.value,
      }

      const { gatewayUrl } = await startBarionPayment(payload)

      clearCart()

      window.location.href = gatewayUrl
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    customerName,
    customerEmail,
    customerPhone,
    shippingName,
    shippingZip,
    shippingCity,
    shippingAddress,
    notes,
    selectedShipping,
    selectedPayment,
    loading,
    error,
    SHIPPING_OPTIONS,
    PAYMENT_OPTIONS,
    selectedShippingOption,
    shippingCost,
    grandTotal,
    submitOrder,
  }
}
