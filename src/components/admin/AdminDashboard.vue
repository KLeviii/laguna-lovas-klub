<template>
  <AdminLayout>
    <div class="container">
      <h1 class="mb-4">
        <i class="bi bi-speedometer2 me-2"></i>
        Admin Dashboard
      </h1>
      <p class="text-muted mb-5">
        Üdvözlünk az admin felületen! Válaszd ki a kezelni kívánt területet.
      </p>

      <!-- Admin funkciók kártyák -->
      <div class="row g-4">
        <!-- Lovak kezelése -->
        <div class="col-md-6 col-lg-3">
          <div class="card admin-card h-100 shadow-sm">
            <div class="card-body text-center">
              <i class="bi bi-heart-fill admin-icon text-danger"></i>
              <h5 class="card-title mt-3">Lovak</h5>
              <p class="card-text text-muted">
                Lovak hozzáadása, szerkesztése és törlése
              </p>
              <router-link
                to="/admin/horses"
                class="btn btn-primary btn-sm mt-2"
              >
                <i class="bi bi-pencil-square me-1"></i>
                Kezelés
              </router-link>
            </div>
          </div>
        </div>

        <!-- Termékek kezelése -->
        <div class="col-md-6 col-lg-3">
          <div class="card admin-card h-100 shadow-sm">
            <div class="card-body text-center">
              <i class="bi bi-shop admin-icon text-success"></i>
              <h5 class="card-title mt-3">Termékek</h5>
              <p class="card-text text-muted">
                Webshop termékek és kategóriák kezelése
              </p>
              <router-link
                to="/admin/products"
                class="btn btn-primary btn-sm mt-2"
              >
                <i class="bi bi-pencil-square me-1"></i>
                Kezelés
              </router-link>
            </div>
          </div>
        </div>

        <!-- Versenyek kezelése -->
        <div class="col-md-6 col-lg-3">
          <div class="card admin-card h-100 shadow-sm">
            <div class="card-body text-center">
              <i class="bi bi-trophy-fill admin-icon text-warning"></i>
              <h5 class="card-title mt-3">Versenyek</h5>
              <p class="card-text text-muted">
                Versenyek és eredmények rögzítése
              </p>
              <router-link
                to="/admin/competitions"
                class="btn btn-primary btn-sm mt-2"
              >
                <i class="bi bi-pencil-square me-1"></i>
                Kezelés
              </router-link>
            </div>
          </div>
        </div>

        <!-- Kapcsolatfelvételi üzenetek -->
        <div class="col-md-6 col-lg-3">
          <div class="card admin-card h-100 shadow-sm">
            <div class="card-body text-center">
              <i class="bi bi-envelope-fill admin-icon text-primary"></i>
              <h5 class="card-title mt-3">Üzenetek</h5>
              <p class="card-text text-muted">
                Beérkezett kapcsolatfelvételi űrlapok
              </p>
              <router-link
                to="/admin/messages"
                class="btn btn-primary btn-sm mt-2"
              >
                <i class="bi bi-eye me-1"></i>
                Megtekintés
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Gyors linkek -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-link-45deg me-2"></i>
                Gyors linkek
              </h5>
              <div class="d-flex flex-wrap gap-2 mt-3">
                <router-link to="/" class="btn btn-outline-secondary btn-sm">
                  <i class="bi bi-house me-1"></i>
                  Főoldal
                </router-link>
                <router-link
                  to="/lovaink"
                  class="btn btn-outline-secondary btn-sm"
                >
                  <i class="bi bi-eye me-1"></i>
                  Lovaink oldal megtekintése
                </router-link>
                <router-link
                  to="/webshop"
                  class="btn btn-outline-secondary btn-sm"
                >
                  <i class="bi bi-eye me-1"></i>
                  Webshop megtekintése
                </router-link>
                <router-link
                  to="/eredmenyeink"
                  class="btn btn-outline-secondary btn-sm"
                >
                  <i class="bi bi-eye me-1"></i>
                  Eredmények megtekintése
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from "./AdminLayout.vue";
</script>

<style scoped>
.admin-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border: none;
}

.admin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.admin-icon {
  font-size: 3rem;
  opacity: 0.8;
}

h1 {
  color: var(--text);
}

p {
  color: var(--text);
}

p.text-muted {
  color: var(--text-muted) !important;
}

.card-text {
  color: var(--text-muted);
}
</style>
