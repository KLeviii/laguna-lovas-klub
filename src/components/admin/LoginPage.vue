<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { signIn, loading } = useAuth();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";

  const result = await signIn(email.value, password.value);

  if (result.success) {
    // Sikeres bejelentkezés - átirányítás admin dashboardra
    router.push("/admin");
  } else {
    // Hiba - hibaüzenet megjelenítése
    if (result.error.includes("Invalid login credentials")) {
      errorMessage.value = "Hibás email vagy jelszó. Kérlek próbáld újra.";
    } else {
      errorMessage.value = result.error;
    }
  }
};
</script>

<template>
  <div class="container mt-5 d-flex justify-content-center">
    <div class="card shadow mt-5 p-4">
        <h2 class="card-title text-center mb-4">Admin Bejelentkezés</h2>

        <!-- Hibaüzenet -->
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin">
          <!-- Email mező -->
          <div class="mb-3">
            <label for="email" class="form-label">Email cím</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              required
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
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{ loading ? "Bejelentkezés..." : "Bejelentkezés" }}
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
</template>

<style scoped>
.container {
  max-width: 1200px;
}

.card {
  width: 100%;
  max-width: 420px; /* fix maximum szélesség */
  margin: 0 auto; /* középre igazítás */
}

/* Extra nagy kijelzőkön se nőjön túl */
@media (min-width: 1400px) {
  .card {
    max-width: 450px;
  }
}

.card {
  border: none;
}

.card-title {
  color: var(--text);
  font-weight: 600;
}
</style>
