<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { fetchOrderById } from '@/services/orderService'
import { formatPrice } from '@/utils/formatting'
import { useHead } from '@/composables/useHead'

useHead('Sikeres fizetés')

const route = useRoute()
const { clearCart } = useCart()

const order = ref(null)
const loading = ref(true)

onMounted(async () => {
  clearCart()

  const orderId = route.query.orderId
  if (orderId) {
    order.value = await fetchOrderById(orderId)

    // Ha a payment_status még pending, várunk pár másodpercet és újra próbáljuk
    if (order.value?.payment_status === 'pending') {
      for (let i = 0; i < 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        order.value = await fetchOrderById(orderId)
        if (order.value?.payment_status !== 'pending') break
      }
    }
  }

  loading.value = false
})
</script>

<template>
  <div>
    <main>
      <section class="p-3 p-md-5" style="padding-top: 100px !important;">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">

            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Betöltés...</span>
              </div>
              <p class="mt-3 text-muted">Fizetés ellenőrzése...</p>
            </div>

            <div v-else class="card shadow-sm pt-0">
              <!-- Sikeres fizetés -->
              <div v-if="order?.payment_status === 'paid'" class="card-body text-center py-5">
                <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                <h3 class="mt-3">Sikeres fizetés!</h3>
                <p class="text-muted">Köszönjük a rendelésed! A megrendelés visszaigazolását hamarosan megkapod emailben.</p>

                <div class="bg-light rounded p-3 mt-4">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Rendelés azonosító:</span>
                    <strong>{{ order.id?.slice(0, 8) }}...</strong>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Végösszeg:</span>
                    <strong class="text-primary">{{ formatPrice(order.total_amount_huf) }}</strong>
                  </div>
                </div>

                <router-link to="/webshop" class="btn btn-primary mt-4">
                  <i class="bi bi-shop me-1"></i>
                  Vissza a webshopba
                </router-link>
              </div>

              <!-- Feldolgozás alatt -->
              <div v-else-if="order?.payment_status === 'pending'" class="card-body text-center py-5">
                <i class="bi bi-hourglass-split text-warning" style="font-size: 4rem;"></i>
                <h3 class="mt-3">Fizetés feldolgozás alatt</h3>
                <p class="text-muted">A fizetésed még feldolgozás alatt áll. Kérjük, várj néhány percet, majd ellenőrizd az emailjeidet.</p>

                <router-link to="/webshop" class="btn btn-outline-primary mt-4">
                  <i class="bi bi-shop me-1"></i>
                  Vissza a webshopba
                </router-link>
              </div>

              <!-- Nem találtunk rendelést -->
              <div v-else class="card-body text-center py-5">
                <i class="bi bi-question-circle text-muted" style="font-size: 4rem;"></i>
                <h3 class="mt-3">Rendelés nem található</h3>
                <p class="text-muted">Nem találtuk a rendelést. Ha fizetést kezdeményeztél, kérjük, ellenőrizd az emailjeidet.</p>

                <router-link to="/webshop" class="btn btn-outline-primary mt-4">
                  <i class="bi bi-shop me-1"></i>
                  Vissza a webshopba
                </router-link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  </div>
</template>
