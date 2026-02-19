<template>
  <div class="admin-layout">
    <!-- Navigation tabs/breadcrumb -->
    <nav class="mb-4">
      <div class="nav nav-tabs" role="tablist">
        <button
          type="button"
          class="nav-link"
          :class="{ active: currentView === 'list' }"
          @click="setView('list')"
        >
          <i class="bi bi-list-ul"></i> Termékek listája
        </button>
        <button
          type="button"
          class="nav-link"
          :class="{ active: currentView === 'create' }"
          @click="setView('create')"
        >
          <i class="bi bi-plus-circle"></i> Új termék
        </button>
      </div>
    </nav>

    <!-- List view -->
    <div v-if="currentView === 'list'">
      <AdminProductList />
    </div>

    <!-- Create view -->
    <div v-if="currentView === 'create'">
      <ProductForm />
    </div>

    <!-- Edit view -->
    <div v-if="currentView === 'edit'">
      <ProductForm />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminProductList from '@/components/products/AdminProductList.vue'
import ProductForm from '@/components/products/ProductForm.vue'

const route = useRoute()
const currentView = ref('list')

// Watch route changes to determine which view to show
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/admin/products') {
      currentView.value = 'list'
    } else if (newPath === '/admin/products/new') {
      currentView.value = 'create'
    } else if (newPath.match(/^\/admin\/products\/[^/]+\/edit$/)) {
      currentView.value = 'edit'
    }
  },
  { immediate: true }
)

function setView(view) {
  currentView.value = view
}
</script>

<style scoped>
.admin-layout {
  padding: 2rem 1rem;
}

.nav-tabs {
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 2rem;
}

.nav-link {
  border: none;
  border-bottom: 3px solid transparent;
  color: #495057;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #0d6efd;
  border-color: #0d6efd;
}

.nav-link.active {
  color: #0d6efd;
  border-color: #0d6efd;
  background-color: transparent;
}

i {
  margin-right: 0.5rem;
}
</style>
