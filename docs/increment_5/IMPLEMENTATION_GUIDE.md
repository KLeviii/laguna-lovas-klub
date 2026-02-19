# Implementation Guide – Increment 5: Webshop Termékek Megjelenítése

## Step-by-Step Implementation

### Step 1: Create Product Service Layer

**File:** `src/services/productService.js`

The service layer handles all direct Supabase communication for products.

```javascript
import { supabase } from '@/lib/supabase.js'

/**
 * Fetch all products, optionally filtered by category
 * @param {string|null} categoryId - Category UUID to filter by, or null for all
 * @returns {Promise<Array>} Array of product objects
 */
export async function fetchProducts(categoryId = null) {
  let query = supabase.from('products').select('*')

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  return data || []
}

/**
 * Fetch all product categories
 * @returns {Promise<Array>} Array of category objects
 */
export async function fetchProductCategories() {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  return data || []
}
```

---

### Step 2: Create Products Composable

**File:** `src/composables/useProducts.js`

The composable manages reactive state and business logic for the webshop.

```javascript
import { ref, computed, onMounted } from 'vue'
import { fetchProducts, fetchProductCategories } from '@/services/productService.js'

export function useProducts() {
  const products = ref([])
  const categories = ref([])
  const selectedCategoryId = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Computed property for filtered products
  const filteredProducts = computed(() => {
    if (!selectedCategoryId.value) {
      return products.value
    }
    return products.value.filter(p => p.category_id === selectedCategoryId.value)
  })

  // Load products from Supabase
  const loadProducts = async () => {
    try {
      loading.value = true
      error.value = null
      const data = await fetchProducts()
      products.value = data
    } catch (err) {
      error.value = err.message
      console.error('Error loading products:', err)
    } finally {
      loading.value = false
    }
  }

  // Load categories from Supabase
  const loadCategories = async () => {
    try {
      const data = await fetchProductCategories()
      categories.value = data
    } catch (err) {
      error.value = err.message
      console.error('Error loading categories:', err)
    }
  }

  // Update selected category filter
  const setSelectedCategory = (categoryId) => {
    selectedCategoryId.value = categoryId
  }

  // Reset filter to show all products
  const clearFilter = () => {
    selectedCategoryId.value = null
  }

  // Load data on component mount
  onMounted(() => {
    loadProducts()
    loadCategories()
  })

  return {
    products,
    categories,
    filteredProducts,
    selectedCategoryId,
    loading,
    error,
    setSelectedCategory,
    clearFilter,
    loadProducts,
    loadCategories
  }
}
```

---

### Step 3: Create ProductCard Component

**File:** `src/components/webshop/ProductCard.vue`

Reusable component for displaying individual product cards.

```vue
<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        value.id &&
        value.name &&
        typeof value.price === 'number' &&
        typeof value.is_available === 'boolean'
      )
    }
  }
})

// Format price in HUF using Hungarian locale
const formatPrice = (price) => {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Handle image load error
const onImageError = (event) => {
  event.target.style.display = 'none'
}
</script>

<template>
  <div class="card h-100 shadow-sm border-0">
    <!-- Product Image -->
    <div class="position-relative bg-light overflow-hidden" style="height: 200px">
      <img
        v-if="product.image_url"
        :src="product.image_url"
        :alt="product.name"
        class="card-img-top w-100 h-100"
        style="object-fit: cover"
        @error="onImageError"
      />
      <div v-else class="d-flex align-items-center justify-content-center h-100">
        <span class="text-muted small">Nincs kép</span>
      </div>
    </div>

    <!-- Card Body -->
    <div class="card-body d-flex flex-column">
      <h6 class="card-title text-truncate mb-2">{{ product.name }}</h6>
      <p
        class="card-text text-muted small flex-grow-1"
        style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical"
      >
        {{ product.description || 'Nincs leírás' }}
      </p>
    </div>

    <!-- Card Footer: Price & Status -->
    <div class="card-footer bg-white border-top">
      <div class="d-flex justify-content-between align-items-center">
        <span class="fw-bold text-primary">{{ formatPrice(product.price) }}</span>
        <span
          v-if="product.is_available"
          class="badge bg-success badges-sm"
        >
          Elérhető
        </span>
        <span v-else class="badge bg-secondary badges-sm">
          Nem elérhető
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.badges-sm {
  font-size: 0.75rem;
  padding: 0.35rem 0.65rem;
}
</style>
```

---

### Step 4: Create ProductFilter Component

**File:** `src/components/webshop/ProductFilter.vue`

Component for category filtering controls.

```vue
<script setup>
defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedCategoryId: {
    type: [String, null],
    default: null
  }
})

const emit = defineEmits(['update:selectedCategoryId'])

const selectCategory = (categoryId) => {
  emit('update:selectedCategoryId', categoryId)
}
</script>

<template>
  <div class="mb-5">
    <h6 class="mb-3 fw-bold">Kategória:</h6>
    <div class="btn-group btn-group-sm" role="group">
      <!-- "Összes" (All) Button -->
      <button
        type="button"
        class="btn btn-outline-primary"
        :class="{ active: selectedCategoryId === null }"
        @click="selectCategory(null)"
      >
        Összes
      </button>

      <!-- Category Buttons -->
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        class="btn btn-outline-primary"
        :class="{ active: selectedCategoryId === category.id }"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.btn-group {
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-group .btn {
  border-radius: 0.25rem;
}
</style>
```

---

### Step 5: Create or Update Webshop View

**File:** `src/views/WebshopView.vue` (or update `src/components/Webshop.vue`)

Main page component that ties everything together.

```vue
<script setup>
import ProductCard from '@/components/webshop/ProductCard.vue'
import ProductFilter from '@/components/webshop/ProductFilter.vue'
import { useProducts } from '@/composables/useProducts.js'

const {
  products,
  categories,
  filteredProducts,
  selectedCategoryId,
  loading,
  error,
  setSelectedCategory
} = useProducts()
</script>

<template>
  <div class="container py-5">
    <!-- Page Title -->
    <div class="mb-5">
      <h1 class="display-5 fw-bold mb-2">Webshop</h1>
      <p class="text-muted">Válassz a termékeink közül</p>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Hiba!</strong> {{ error }}
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading && !error" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Betöltés...</span>
      </div>
      <p class="text-muted mt-3">A termékek betöltődnek...</p>
    </div>

    <!-- No Products Message -->
    <div v-else-if="products.length === 0" class="alert alert-info" role="alert">
      <strong>Üres webshop!</strong> Nincs termék az adatbázisban.
    </div>

    <!-- Content: Filter + Products Grid -->
    <div v-else>
      <!-- Category Filter -->
      <ProductFilter
        :categories="categories"
        :selected-category-id="selectedCategoryId"
        @update:selectedCategoryId="setSelectedCategory"
      />

      <!-- Empty State for Category Filter -->
      <div v-if="filteredProducts.length === 0" class="alert alert-info">
        Erre a kategóriára nincs termék.
      </div>

      <!-- Products Grid -->
      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        <div v-for="product in filteredProducts" :key="product.id" class="col">
          <ProductCard :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add subtle animations */
.row {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
```

---

### Step 6: Add Router Configuration

**File:** `src/router/index.js`

Ensure the webshop route is defined. Add if not already present:

```javascript
{
  path: '/webshop',
  name: 'Webshop',
  component: () => import('@/views/WebshopView.vue'),
  meta: {
    title: 'Webshop - Laguna Lovasklub'
  }
}
```

Or if you're updating the existing `Webshop.vue` component and routing through a different mechanism, ensure the route exists.

---

### Step 7: Update Navigation

**File:** `src/components/Header.vue`

Ensure the webshop link exists in the main navigation:

```html
<li class="nav-item">
  <router-link class="nav-link" to="/webshop">Webshop</router-link>
</li>
```

---

## Testing & Verification

### ✅ Test Checklist

**Before Implementing:**
- [ ] Database has `product_categories` and `products` tables
- [ ] Sample product and category data exist in Supabase
- [ ] `src/lib/supabase.js` client is properly configured
- [ ] `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**After Implementation:**
1. **Navigate to `/webshop`**
   - [ ] Page loads without console errors
   - [ ] Loading spinner briefly visible
   - [ ] Products display in a grid

2. **Category Filtering**
   - [ ] Click a category button → products filter instantly
   - [ ] Click "Összes" → all products show
   - [ ] Category buttons have active state styling

3. **Product Cards**
   - [ ] Product name, price, description visible
   - [ ] Images load (or placeholder shown)
   - [ ] Availability badge shows correctly (green for available, gray for unavailable)
   - [ ] Price formatted with HUF (e.g., "1 500 Ft")

4. **Responsive Design**
   - [ ] Mobile (< 768px): 1 column
   - [ ] Tablet (768px–992px): 2 columns
   - [ ] Desktop (≥ 992px): 4 columns

5. **Error Handling**
   - [ ] If Supabase down: error message displayed
   - [ ] If no products: "Nincs termék" message shown
   - [ ] If category has 0 products: "Erre a kategóriára" message shown

---

## Common Issues & Fixes

### Issue: Products not loading
**Solution:** Check browser console for errors. Verify:
- Supabase URL and API key in `.env`
- `products` table exists and has data
- RLS policies allow public read

### Issue: Images not displaying
**Solution:**
- Verify `image_url` field contains valid Supabase Storage URLs
- Check Storage bucket `product-images` is public
- Fallback placeholder shows if images missing

### Issue: Filtering not working
**Solution:**
- Ensure `selectedCategoryId` is updated correctly in component
- Check `category_id` field matches between filter and products
- Verify `filteredProducts` computed property is reactive

### Issue: Prices formatted incorrectly
**Solution:**
- Verify `product.price` is a number (not string)
- Check browser locale settings
- Use `Intl.NumberFormat('hu-HU', ...)` for Hungarian format

---

## Performance Notes

- **Lazy load images:** Consider adding `loading="lazy"` to product images
- **Caching:** Products stay in memory; refresh manually if needed
- **Pagination:** Not implemented; suitable for ~100s of products
- **Search:** Not implemented; use filtering for now

---

## Next Increment (Increment 6)

Increment 6 will add **admin product management (CRUD)**:
- Create new products and categories
- Edit product details
- Delete products
- Upload product images
- Set availability status

Reuse `ProductCard` component in admin list view.

---

## Files Created

```
src/
├── components/
│   └── webshop/
│       ├── ProductCard.vue
│       └── ProductFilter.vue
├── composables/
│   └── useProducts.js
├── services/
│   └── productService.js
└── views/
    └── WebshopView.vue
```

## Files Modified

```
src/
├── router/index.js (add /webshop route)
└── components/Header.vue (add link)
```

---

## Done! 🎉

Increment 5 is ready for development. Follow the steps above and verify against the testing checklist.
