<template>
  <div class="admin-layout">
    <!-- Admin Header -->
    <nav class="navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link to="/admin" class="navbar-brand">
          <i class="bi bi-shield-lock me-2"></i>
          Admin Panel
        </router-link>

        <div class="d-flex align-items-center">
          <!-- User email -->
          <span class="text-white me-3">
            <i class="bi bi-person-circle me-1"></i>
            {{ user?.email }}
          </span>

          <!-- Kijelentkezés gomb -->
          <button
            @click="handleLogout"
            class="btn btn-outline-light btn-sm"
            :disabled="loading"
          >
            <i class="bi bi-box-arrow-right me-1"></i>
            Kijelentkezés
          </button>
        </div>
      </div>
    </nav>

    <!-- Admin Content -->
    <div class="admin-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { user, signOut, loading } = useAuth();

const handleLogout = async () => {
  const result = await signOut();
  if (result.success) {
    router.push("/");
  }
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-content {
  padding: 2rem;
  margin-top: 20px;
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
