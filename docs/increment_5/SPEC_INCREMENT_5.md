# Increment 5: Webshop Termékek Megjelenítése (Product Display) – Specification

**Version:** 1.0  
**Date:** February 2026  
**Priority:** Medium  
**Estimated Effort:** 2–3 hours  
**Status:** Ready for Implementation  
**Preconditions:** Increment 1 (Database) + Increment 2 (Auth) MUST be complete

---

## 1. Overview

Increment 5 implements the public-facing webshop product listing feature. Visitors can browse products organized by categories, filter by category, and see product details including availability status. This is a read-only feature with no editing capabilities (admin product management comes in Increment 6).

**Key Features:**
- Product listing from Supabase database
- Category-based filtering
- Product cards with images, names, descriptions, and prices
- Availability status display (available/out of stock)
- Responsive grid layout using Bootstrap
- Empty state handling

---

## 2. Feature Description

### 2.1 In Scope

- **Product List View** – Display all products from the database in a responsive grid/list layout
- **Category Filtering** – Filter products by category (client-side or server-side)
- **Product Cards** – Display:
  - Product image (from Supabase Storage)
  - Product name
  - Price in HUF (Hungarian Forint) format
  - Brief description (teaser)
  - Category badge
  - Availability status (Elérhető / Nem elérhető)
- **Category Display** – Show all unique categories from database
- **Empty States** – Friendly messages when:
  - No products exist in database
  - No products match selected category
- **Responsive Design** – Mobile-friendly layout using Bootstrap Grid
- **Product Detail (Optional)** – Expandable card or modal showing full description (if requested)

### 2.2 Out of Scope (Future Increments)

- Shopping cart
- Checkout / payment processing
- Product search by name or keyword
- Advanced filtering (price range, tags)
- Product reviews or ratings
- Admin product management (Increment 6)
- Bulk upload of products
- Product variants (size, color, etc.)

---

## 3. User Stories

### 3.1 Visitor Browsing All Products

**As a** visitor  
**I want to** see all available products in the webshop  
**So that** I can discover what the club offers for sale.

**Acceptance Criteria:**

- Products load from Supabase database on page load
- Products are displayed in a responsive grid (e.g., 2-4 columns depending on screen size)
- Each product card shows: image, name, price, category, description snippet
- No products = "Nincs termék az adatbázisban" message displayed
- Page loads within 2 seconds

### 3.2 Visitor Filtering Products by Category

**As a** visitor  
**I want to** filter products by category  
**So that** I can focus on the type of product I'm interested in.

**Acceptance Criteria:**

- Category filter dropdown or buttons (Bootstrap Nav/Dropdown)
- "Összes" (All) option selects all products
- Selecting a category shows only products in that category
- Filter updates the product list instantly (no page reload needed)
- Product count updates to reflect filtered results
- Category persistence optional: can use URL params or component state

### 3.3 Visitor Viewing Product Details

**As a** visitor  
**I want to** see full product details (name, price, description, status)  
**So that** I can make an informed decision about a product.

**Acceptance Criteria:**

- Hovering/clicking product card shows or expands full description
- Price displayed in HUF format (e.g., "3,500 Ft")
- If product is unavailable, clear visual indicator (e.g., red "Nem elérhető" badge)
- If available, "Elérhető" badge shown
- Contact info hint: "Az megrendeléshez keress meg az elérhetőségeinken" (if applicable)

### 3.4 Visitor Seeing Visual Product Status

**As a** visitor  
**I want to** see whether a product is available or not  
**So that** I know if I can order it.

**Acceptance Criteria:**

- "Elérhető" (Available) label/badge for in-stock products (green color)
- "Nem elérhető" (Out of Stock) label/badge for unavailable products (gray/red color)
- Status is reflected in product card UI consistently
- Unavailable products may be visually de-emphasized (opacity, strikethrough, etc.)

---

## 4. Data Model

### 4.1 Product Categories Table

```sql
-- Created in Increment 1; used in Increment 5
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,  -- e.g., "Takarmányok", "Vitamin & Kiegészítők", "Felszerelés"
  description TEXT,           -- Optional category description
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Example Data:**
```
id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, name: "Takarmányok"
id: yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy, name: "Vitamin & Kiegészítők"
id: zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz, name: "Felszerelés"
```

### 4.2 Products Table

```sql
-- Created in Increment 1; used in Increment 5 (read-only)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,       -- Price in HUF
  description TEXT,
  is_available BOOLEAN DEFAULT TRUE,   -- Availability flag
  image_url TEXT,                      -- URL from Supabase Storage (not image_id)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes (for performance):**
```sql
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_available ON products(is_available);
```

### 4.3 Storage Bucket

**Bucket name:** `product-images`  
**File path:** `{product_id}/{filename}` or similar  
**Permissions:** Public read (for Increment 5); authenticated write (for Increment 6)

---

## 5. API Contract

### 5.1 Fetch All Products

**Endpoint:** `GET /rest/v1/products`

**Query Parameters (optional):**
- `category_id=` – Filter by category UUID
- `select=` – Specify columns (e.g., `id,name,price,category_id,is_available,image_url`)
- `order=name.asc` – Sort by name ascending

**Headers:**
```
apikey: VITE_SUPABASE_ANON_KEY
Content-Type: application/json
```

**Response:**
```json
[
  {
    "id": "uuid-1",
    "category_id": "uuid-cat-1",
    "name": "Fű takarmány",
    "price": 1500.00,
    "description": "Magas minőségű fű takarmány...",
    "is_available": true,
    "image_url": "https://[bucket-url]/product-images/uuid-1/hay.jpg",
    "created_at": "2026-02-01T10:00:00Z",
    "updated_at": "2026-02-01T10:00:00Z"
  },
  ...
]
```

### 5.2 Fetch All Product Categories

**Endpoint:** `GET /rest/v1/product_categories`

**Headers:**
```
apikey: VITE_SUPABASE_ANON_KEY
Content-Type: application/json
```

**Response:**
```json
[
  {
    "id": "uuid-cat-1",
    "name": "Takarmányok",
    "description": "Takarmánycikkek...",
    "created_at": "2026-02-01T10:00:00Z",
    "updated_at": "2026-02-01T10:00:00Z"
  },
  ...
]
```

### 5.3 Error Handling

- **Network Error:** Show "Hiba történt az adatbetöltés közben. Kérlek, próbálj újra később." message
- **No Products:** Show "Nincs termék az adatbázisban." message
- **No Products in Category:** Show "Erre a kategóriára nincs termék." message
- **Image Load Failure:** Show placeholder image with alt text

---

## 6. Technical Implementation

### 6.1 Files & Components

#### New Files:

1. **`src/services/productService.js`** – Product data access layer
   ```javascript
   import { supabase } from '@/lib/supabase.js'
   
   export async function fetchProducts(categoryId = null) {
     let query = supabase.from('products').select('*')
     
     if (categoryId) {
       query = query.eq('category_id', categoryId)
     }
     
     return query
   }
   
   export async function fetchProductCategories() {
     return supabase.from('product_categories').select('*')
   }
   ```

2. **`src/composables/useProducts.js`** – Product state & logic composable
   ```javascript
   import { ref, computed, onMounted } from 'vue'
   import { fetchProducts, fetchProductCategories } from '@/services/productService.js'
   
   export function useProducts() {
     const products = ref([])
     const categories = ref([])
     const selectedCategoryId = ref(null)
     const loading = ref(true)
     const error = ref(null)
     
     const filteredProducts = computed(() => {
       if (!selectedCategoryId.value) return products.value
       return products.value.filter(p => p.category_id === selectedCategoryId.value)
     })
     
     const loadProducts = async () => {
       try {
         loading.value = true
         error.value = null
         const data = await fetchProducts()
         products.value = data.data || []
       } catch (err) {
         error.value = err.message
       } finally {
         loading.value = false
       }
     }
     
     const loadCategories = async () => {
       try {
         const data = await fetchProductCategories()
         categories.value = data.data || []
       } catch (err) {
         error.value = err.message
       }
     }
     
     const setSelectedCategory = (categoryId) => {
       selectedCategoryId.value = categoryId
     }
     
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
       setSelectedCategory
     }
   }
   ```

3. **`src/components/webshop/ProductCard.vue`** – Individual product card component
   ```vue
   <script setup>
   defineProps({
     product: {
       type: Object,
       required: true
     }
   })
   
   const formatPrice = (price) => {
     return new Intl.NumberFormat('hu-HU', {
       style: 'currency',
       currency: 'HUF',
       minimumFractionDigits: 0
     }).format(price)
   }
   </script>
   
   <template>
     <div class="card h-100 shadow-sm">
       <img
         v-if="product.image_url"
         :src="product.image_url"
         :alt="product.name"
         class="card-img-top"
         style="height: 200px; object-fit: cover"
       />
       <div v-else class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px">
         <span class="text-muted">Nincs kép</span>
       </div>
       <div class="card-body">
         <h5 class="card-title">{{ product.name }}</h5>
         <p class="card-text text-muted small">{{ product.description }}</p>
       </div>
       <div class="card-footer bg-white border-top">
         <div class="d-flex justify-content-between align-items-center">
           <span class="h5 mb-0">{{ formatPrice(product.price) }}</span>
           <span v-if="product.is_available" class="badge bg-success">Elérhető</span>
           <span v-else class="badge bg-secondary">Nem elérhető</span>
         </div>
       </div>
     </div>
   </template>
   ```

4. **`src/components/webshop/ProductFilter.vue`** – Category filter component
   ```vue
   <script setup>
   defineProps({
     categories: {
       type: Array,
       required: true
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
     <div class="mb-4">
       <h6 class="mb-3">Kategória:</h6>
       <div class="btn-group" role="group">
         <button
           type="button"
           class="btn btn-outline-primary"
           :class="{ active: selectedCategoryId === null }"
           @click="selectCategory(null)"
         >
           Összes
         </button>
         <button
           v-for="cat in categories"
           :key="cat.id"
           type="button"
           class="btn btn-outline-primary"
           :class="{ active: selectedCategoryId === cat.id }"
           @click="selectCategory(cat.id)"
         >
           {{ cat.name }}
         </button>
       </div>
     </div>
   </template>
   ```

5. **`src/views/WebshopView.vue`** – Main webshop page (or update existing `src/components/Webshop.vue`)
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
       <h1 class="mb-4">Webshop</h1>
       
       <div v-if="error" class="alert alert-danger">
         {{ error }}
       </div>
       
       <ProductFilter
         :categories="categories"
         :selected-category-id="selectedCategoryId"
         @update:selectedCategoryId="setSelectedCategory"
       />
       
       <div v-if="loading" class="text-center">
         <div class="spinner-border" role="status">
           <span class="visually-hidden">Betöltés...</span>
         </div>
       </div>
       
       <div v-else-if="filteredProducts.length === 0" class="alert alert-info">
         Nincs termék az adatbázisban.
       </div>
       
       <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
         <div v-for="product in filteredProducts" :key="product.id" class="col">
           <ProductCard :product="product" />
         </div>
       </div>
     </div>
   </template>
   ```

#### Modified Files:

1. **`src/router/index.js`** – Add webshop route (if not already present)
   ```javascript
   {
     path: '/webshop',
     name: 'Webshop',
     component: () => import('@/views/WebshopView.vue')
   }
   ```

2. **`src/components/Header.vue`** – Ensure link to `/webshop` route exists

### 6.2 Environment Variables

No new environment variables needed beyond what Increment 2 established.

### 6.3 Folder Structure

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
    └── WebshopView.vue  (or update existing Webshop.vue)
```

---

## 7. UI/UX Guidelines

### 7.1 Bootstrap Components

- **Product Grid:** Bootstrap `row` + `col` with `g-4` gutter
- **Product Cards:** Bootstrap `card` component with footer for price + status
- **Filter Buttons:** Bootstrap `btn-group` or inline buttons
- **Loading State:** Bootstrap `spinner-border`
- **Alerts:** Bootstrap `alert` for errors and empty states
- **Badges:** Bootstrap `badge` for category and availability status

### 7.2 Styling Notes

- Use Bootstrap utility classes for layout and spacing
- Minimal custom CSS; leverage Bootstrap defaults
- Product images: `object-fit: cover` for consistent aspect ratio
- Responsive columns: 1 column on mobile, 2-3 on tablet, 4 on desktop

---

## 8. Definition of Done (DoD)

### Functional DoD:

- [ ] Products load from Supabase database and display in a grid
- [ ] Each product card shows name, image, price (HUF format), category, description
- [ ] Category filter works and updates product list instantly
- [ ] "Összes" (All) filter button shows all products
- [ ] Availability badges ("Elérhető" / "Nem elérhető") display correctly
- [ ] Empty state shown when no products exist in database
- [ ] Empty state shown when no products match selected category
- [ ] Responsive design works on mobile (1-2 columns), tablet (2-3 columns), desktop (4+ columns)
- [ ] Images load correctly or show placeholder if missing
- [ ] Loading spinner shown while data fetches
- [ ] Error message displayed if API call fails

### Technical DoD:

- [ ] `productService.js` created with `fetchProducts()` and `fetchProductCategories()` functions
- [ ] `useProducts.js` composable handles state and logic
- [ ] `ProductCard.vue` component handles individual product display
- [ ] `ProductFilter.vue` component handles category filtering
- [ ] `WebshopView.vue` (or updated `Webshop.vue`) composes the above components
- [ ] Route `/webshop` exists in Vue Router
- [ ] No console errors
- [ ] Code is clean, commented, and maintainable
- [ ] Supabase RLS policies allow public read on `products` and `product_categories` tables

### Non-Functional DoD:

- [ ] Page loads within 2 seconds
- [ ] Images are optimized (or use Supabase Image Transform for resizing)
- [ ] No duplicate API calls (e.g., categories fetched only once)
- [ ] Filtering is client-side (instant response) or optimized server-side
- [ ] Price formatting works for all HUF amounts

---

## 9. Testing Scenarios

### Scenario 1: Normal Flow
1. Navigate to `/webshop`
2. Products load from database
3. All categories visible in filter
4. Select a category → list updates
5. Select "Összes" → all products show

### Scenario 2: Empty Database
1. Database has no products
2. Page shows "Nincs termék az adatbázisban."

### Scenario 3: Category with No Products
1. Select a category that has no products
2. Page shows "Erre a kategóriára nincs termék."

### Scenario 4: Network Error
1. Supabase is unreachable
2. Error message displayed: "Hiba történt az adatbetöltés közben..."

### Scenario 5: Slow Network
1. Turn on network throttling
2. Loading spinner visible
3. Products appear after ~2 seconds

---

## 10. Notes for Implementation

- **Price Format:** Use `Intl.NumberFormat` for localized HUF formatting (e.g., "1 500 Ft")
- **Category Naming:** Keep Hungarian names consistent (e.g., "Takarmányok", "Vitamin & Kiegészítők")
- **Product Status:** Use simple boolean `is_available` flag; no "sold out" date logic yet
- **Image Storage:** Assume product images are already in Supabase Storage with public read permissions
- **Reusability:** `ProductCard` can be reused in admin list (Increment 6) and featured products (Increment 10)
