# README – Increment 5: Webshop Termékek Megjelenítése

## Overview

Increment 5 implements the **public-facing webshop product listing** feature. Visitors can:

- Browse all products organized by categories
- Filter products by category
- View product details (name, price, description, availability status)
- See product images stored in Supabase Storage

This is a **read-only feature** – product management (CRUD for admins) is covered in Increment 6.

**Status:** Ready for Implementation  
**Estimated Effort:** 2–3 hours  
**Priority:** Medium

---

## Features

✅ **Product Listing**
- Display all products in a responsive grid layout
- Load product data from Supabase database

✅ **Category Filtering**
- Filter products by category using button group
- "Összes" (All) option to view all products
- Instant filtering (client-side)

✅ **Product Cards**
- Product image, name, description, price (HUF format)
- Category badge and availability status (Elérhető / Nem elérhető)

✅ **Responsive Design**
- Mobile: 1–2 columns
- Tablet: 2–3 columns
- Desktop: 4+ columns

✅ **Error & Loading States**
- Loading spinner while fetching data
- User-friendly error messages
- Empty state message when no products exist

---

## What Gets Created

### New Components
- `src/components/webshop/ProductCard.vue` – Individual product card
- `src/components/webshop/ProductFilter.vue` – Category filter controls

### New Composables
- `src/composables/useProducts.js` – Product state and business logic

### New Services
- `src/services/productService.js` – Supabase data access layer

### New Views
- `src/views/WebshopView.vue` – Main webshop page (or update existing `Webshop.vue`)

### Router Updates
- Add `/webshop` route to `src/router/index.js` (if not already present)

---

## Data Model

### `product_categories` Table
```
id UUID PRIMARY KEY
name TEXT UNIQUE (e.g., "Takarmányok", "Vitamin & Kiegészítők")
description TEXT (optional)
created_at TIMESTAMP
updated_at TIMESTAMP
```

### `products` Table
```
id UUID PRIMARY KEY
category_id UUID → product_categories(id)
name TEXT NOT NULL
price DECIMAL (HUF)
description TEXT
is_available BOOLEAN DEFAULT TRUE
image_url TEXT (Supabase Storage URL)
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

## API Endpoints Used

### Fetch All Products
```
GET /rest/v1/products
Headers:
  apikey: VITE_SUPABASE_ANON_KEY
  Content-Type: application/json
```

### Fetch All Categories
```
GET /rest/v1/product_categories
Headers:
  apikey: VITE_SUPABASE_ANON_KEY
  Content-Type: application/json
```

---

## Implementation Checklist

### Phase 1: Setup & Services
- [ ] Create `src/services/productService.js` with `fetchProducts()` and `fetchProductCategories()`
- [ ] Create `src/composables/useProducts.js` with reactive state

### Phase 2: Components
- [ ] Create `src/components/webshop/ProductCard.vue`
- [ ] Create `src/components/webshop/ProductFilter.vue`
- [ ] Create or update `src/views/WebshopView.vue`

### Phase 3: Routing & Integration
- [ ] Add `/webshop` route to `src/router/index.js` (if not present)
- [ ] Ensure Header/Navigation links to webshop

### Phase 4: Testing & Polish
- [ ] Test with empty database (shows proper message)
- [ ] Test with multiple products and categories
- [ ] Test filtering functionality
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Verify loading and error states
- [ ] Check image display and fallbacks
- [ ] Verify price formatting (HUF)

---

## Key Decisions

### Category Filtering
- **Client-side filtering** – Category filter updates the product list instantly without API calls
- Alternative: Server-side filtering with query parameter (e.g., `?category_id=uuid`)
- Current implementation uses component state for simplicity

### Product Images
- Images stored in Supabase Storage bucket: `product-images`
- `image_url` field in products table contains full public URL
- Fallback placeholder shown if image missing

### Price Format
- Use `Intl.NumberFormat` API for localized HUF formatting
- Example: `1500` → `"1 500 Ft"` (Hungarian locale)

### Responsiveness
- Bootstrap Grid: `row-cols-1 row-cols-md-2 row-cols-lg-4`
- Mobile: 1 column
- Tablet (768px+): 2 columns
- Desktop (992px+): 4 columns

---

## Files Modified

1. **`src/router/index.js`** – Add webshop route
2. **`src/components/Header.vue`** – Ensure navigation link exists

---

## Preconditions

✅ **Increment 1** – Database and tables created (`products`, `product_categories`)  
✅ **Increment 2** – Supabase client initialized (`src/lib/supabase.js`)

---

## Next Steps

After Increment 5 is complete:
- **Increment 6:** Webshop Admin Product Management (CRUD for products/categories)
- **Increment 7:** Competition Results Display
- **Increment 8:** Competition Results Admin Management

---

## Questions?

Refer to `SPEC_INCREMENT_5.md` for detailed technical specifications, acceptance criteria, and API contracts.
