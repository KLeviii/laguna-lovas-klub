<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { signIn, loading } = useAuth()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  
  const result = await signIn(email.value, password.value)
  
  if (result.success) {
    // Sikeres bejelentkezés - átirányítás admin dashboardra
    router.push('/admin')
  } else {
    // Hiba - hibaüzenet megjelenítése
    if (result.error.includes('Invalid login credentials')) {
      errorMessage.value = 'Hibás email vagy jelszó. Kérlek próbáld újra.'
    } else {
      errorMessage.value = result.error
    }
  }
}
</script>


<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
          <div class="card-body p-4 card shadow mt-5 col-md-6 col-lg-4">
            <h2 class="card-title text-center mb-4">Admin Bejelentkezés</h2>
            
            <!-- Hibaüzenet -->
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>

            <form @submit.prevent="handleLogin" >
              <!-- Email mező -->
              <div class="mb-3">
                <label for="email" class="form-label">Email cím</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  required
                  placeholder="admin@example.com"
                  :disabled="loading"
                />
              </div>

              <!-- Jelszó mező -->
              <div class="mb-3">
                <label for="password" class="form-label">Jelszó</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                  minlength="6"
                  :disabled="loading"
                />
              </div>

              <!-- Bejelentkezés gomb -->
              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Bejelentkezés...' : 'Bejelentkezés' }}
              </button>
            </form>

            <!-- Vissza a főoldalra link -->
            <div class="text-center mt-3">
              <router-link to="/" class="text-muted">
                <i class="bi bi-arrow-left"></i> Vissza a főoldalra
              </router-link>
            </div>
          </div>
        </div>
      </div>
</template>



<style scoped>
.card {
  border: none;
}

.card-title {
  color: #333;
  font-weight: 600;
}

.btn-primary {
  background-color: #4da6ff;
  border-color: #4da6ff;
}

.btn-primary:hover {
  background-color: #3399ff;
  border-color: #3399ff;
}

.btn-primary:disabled {
  background-color: #99ccff;
  border-color: #99ccff;
}


</style>
