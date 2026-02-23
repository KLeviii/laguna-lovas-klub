<template>
  <div class="admin-layout">
    <!-- Navigation tabs -->
    <nav class="mb-4">
      <div class="nav nav-tabs" role="tablist">
        <button
          type="button"
          class="nav-link"
          :class="{ active: currentView === 'list' }"
          @click="navigateTo('list')"
        >
          <i class="bi bi-list-ul"></i> Termékek listája
        </button>
        <button
          type="button"
          class="nav-link"
          :class="{ active: currentView === 'create' || currentView === 'edit' }"
          @click="navigateTo('create')"
        >
          <i class="bi bi-plus-circle"></i> Új termék
        </button>
        <button
          type="button"
          class="nav-link"
          :class="{ active: currentView === 'categories' }"
          @click="navigateTo('categories')"
        >
          <i class="bi bi-tags"></i> Kategóriák
        </button>
        <button
          type="button"
          class="nav-link"
          :class="{ active: currentView === 'create-category' || currentView === 'edit-category' }"
          @click="navigateTo('create-category')"
        >
          <i class="bi bi-plus-circle"></i> Új kategória
        </button>
      </div>
    </nav>

    <!-- Product List -->
    <div v-if="currentView === 'list'">
      <AdminProductList />
    </div>

    <!-- Create Product -->
    <div v-if="currentView === 'create'">
      <ProductForm @saved="onProductSaved" @cancel="onProductCancel" />
    </div>

    <!-- Edit Product -->
    <div v-if="currentView === 'edit'">
      <ProductForm @saved="onProductSaved" @cancel="onProductCancel" />
    </div>

    <!-- Category List -->
    <div v-if="currentView === 'categories'">
      <AdminCategoryList
        ref="categoryListRef"
        @edit-category="onEditCategory"
        @create-category="navigateTo('create-category')"
      />
    </div>

    <!-- Create/Edit Category -->
    <div v-if="currentView === 'create-category' || currentView === 'edit-category'">
      <CategoryForm
        ref="categoryFormRef"
        @saved="onCategorySaved"
        @cancel="onCategoryCancel"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminProductList from '@/components/products/AdminProductList.vue'
import ProductForm from '@/components/products/ProductForm.vue'
import AdminCategoryList from '@/components/products/AdminCategoryList.vue'
import CategoryForm from '@/components/products/CategoryForm.vue'

const route = useRoute()
const router = useRouter()
const currentView = ref('list')
const categoryFormRef = ref(null)
const categoryListRef = ref(null)

// Watch route changes to determine which view to show
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/admin/products') {
      currentView.value = 'list'
    } else if (newPath === '/admin/products/new') {
      currentView.value = 'create'
    } else if (newPath === '/admin/products/categories') {
      currentView.value = 'categories'
    } else if (newPath === '/admin/products/new-category') {
      currentView.value = 'create-category'
    } else if (newPath.match(/^\/admin\/products\/[^/]+\/edit$/)) {
      currentView.value = 'edit'
    }
  },
  { immediate: true }
)

function navigateTo(view) {
  const routeMap = {
    'list': '/admin/products',
    'create': '/admin/products/new',
    'categories': '/admin/products/categories',
    'create-category': '/admin/products/new-category',
  }
  if (routeMap[view]) {
    router.push(routeMap[view])
  }
}

function onProductSaved() {
  router.push('/admin/products')
}

function onProductCancel() {
  router.push('/admin/products')
}

async function onCategorySaved() {
  router.push('/admin/products/categories')
  await nextTick()
  categoryListRef.value?.loadCategories()
}

function onCategoryCancel() {
  router.push('/admin/products/categories')
}

async function onEditCategory(category) {
  currentView.value = 'edit-category'
  await nextTick()
  categoryFormRef.value?.loadCategoryForEdit(category)
}
</script>

<style scoped>
.admin-layout {
  padding: 2rem 1rem;
}

.nav-tabs {
  border-bottom: 1px solid var(--border);
  margin-bottom: 2rem;
}

.nav-link {
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-muted);
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-link:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.nav-link.active {
  color: var(--primary);
  border-color: var(--primary);
  background-color: transparent;
}

i {
  margin-right: 0.5rem;
}

@media (max-width: 576px) {
  .admin-layout {
    padding: 1rem 0.5rem;
  }

  .nav-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    white-space: nowrap;
  }
}
</style>
