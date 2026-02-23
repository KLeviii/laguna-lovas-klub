<template>
  <div class="admin-product-list">
    <!-- Header with New button -->
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
      <h2 class="mb-0">Termékek kezelése</h2>
      <button class="btn btn-primary btn-sm" @click="goToCreate">
        <i class="bi bi-plus-circle me-1"></i>Új termék
      </button>
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Betöltés...</span>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Empty state -->
    <div v-if="!loading && isEmpty" class="alert alert-info" role="alert">
      Nincsenek termékek. Hozz létre egy újat!
    </div>

    <!-- Table -->
    <div v-if="!loading && !isEmpty" class="table-responsive">
      <table class="table table-hover">
        <thead class="table-light">
          <tr class="text-center">
            <th class="d-none d-md-table-cell">ID</th>
            <th class="d-none d-sm-table-cell">Kép</th>
            <th>Név</th>
            <th class="d-none d-md-table-cell">Kategória</th>
            <th>Ár</th>
            <th class="d-none d-lg-table-cell">Elérhető</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td class="fw-monospace text-muted d-none d-md-table-cell" style="font-size: 0.9rem">
              {{ product.id.substring(0, 8) }}
            </td>
            <td class="d-none d-sm-table-cell">
              <img
                v-if="product.image_url"
                :src="product.image_url"
                :alt="product.name"
                style="max-width: 50px; max-height: 50px; object-fit: cover"
              />
              <span v-else class="text-muted">—</span>
            </td>
            <td class="fw-bold">{{ product.name }}</td>
            <td class="d-none d-md-table-cell">
              <span v-if="product.category" class="badge bg-info">
                {{ product.category.name }}
              </span>
              <span v-else class="text-muted">—</span>
            </td>
            <td class="fw-bold text-success">
              {{ formatPrice(product.price_huf) }}
            </td>
            <td class="d-none d-lg-table-cell">
              <span
                :class="
                  product.is_available ? 'badge bg-success' : 'badge bg-danger'
                "
              >
                {{ product.is_available ? "Igen" : "Nem" }}
              </span>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button
                  class="btn btn-outline-primary"
                  @click="goToEdit(product.id)"
                  title="Szerkesztés"
                >
                  <i class="bi bi-pencil"></i>
                  <span class="d-none d-lg-inline ms-1">Szerkesztés</span>
                </button>
                <button
                  class="btn btn-outline-danger"
                  @click="confirmDelete(product.id, product.name)"
                  title="Törlés"
                >
                  <i class="bi bi-trash"></i>
                  <span class="d-none d-lg-inline ms-1">Törlés</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useProducts } from "../../composables/useProducts.js";
import { formatPrice } from "@/utils/formatting";

const router = useRouter();
const { products, loading, error, isEmpty, deleteProduct, loadProducts } =
  useProducts();

onMounted(() => {
  loadProducts();
});

function goToCreate() {
  router.push("/admin/products/new");
}

function goToEdit(productId) {
  router.push(`/admin/products/${productId}/edit`);
}

async function confirmDelete(productId, productName) {
  if (
    !confirm(
      `Biztosan szeretnéd törölni a(z) "${productName}" terméket? Ez a művelet nem visszavonható.`,
    )
  ) {
    return;
  }

  const success = await deleteProduct(productId);
  if (success) {
    alert(`"${productName}" sikeresen törölve.`);
  } else {
    alert(`Hiba a törlés során. Próbáld meg később!`);
  }
}
</script>

<style scoped>
.admin-product-list {
  padding: 1rem;
}

thead th {
  background-color: var(--bg-light) !important;
}

.table-hover tbody tr:hover {
  background-color: var(--bg-light);
}
</style>
