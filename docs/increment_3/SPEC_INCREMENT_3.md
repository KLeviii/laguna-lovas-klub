# Increment 3: Lovak Megjelenítése (Horse Display) – Specification

**Version:** 1.0  
**Date:** February 2026  
**Priority:** High  
**Estimated Effort:** 2–3 hours  
**Status:** Ready for Implementation

---

## 1. Overview

Increment 3 implements the public-facing horse listing feature. Visitors can browse all horses in the club's stable, view detailed information including pedigree (parentage), and filter for horses available for sale.

---

## 2. Feature Description

### 2.1 In Scope

- **Horse List View** – Display all horses from the database in a responsive grid/list layout.
- **Horse Detail** – Show individual horse information including:
  - Name, sex, birth year
  - Sire (apa) and dam (anya) relationships
  - Images/gallery
  - Availability status (available for sale or not)
- **Filtering** – Filter horses by sale status ("Eladók" / "Nem eladók")
- **Pedigree Display** – Show parent information (if sire/dam records exist)
- **Responsive Design** – Mobile-friendly layout using Bootstrap.
- **Empty State** – Friendly message when no horses match filters.

### 2.2 Out of Scope (Next Increments)

- Horse image upload (admin feature in Increment 4)
- Detailed medical records or performance stats
- Advanced search (name, breed, age range)
- Wishlist or favorites

---

## 3. User Stories

### 3.1 Visitor Browsing Horses

**As a** visitor  
**I want to** see all horses in the club's stable  
**So that** I can learn about available horses and the club's bloodlines.

**Acceptance Criteria:**

- Horses load from Supabase database
- Horse cards display: name, sex, birth year, image
- Each horse links to a detail page
- No horses = "Nincs ló az adatbázisban" message

### 3.2 Visitor Viewing Horse Details

**As a** visitor  
**I want to** view detailed information about a specific horse  
**So that** I can understand its background and pedigree.

**Acceptance Criteria:**

- Horse detail page shows all attributes
- Parent names displayed if they exist in the database
- Images displayed in a gallery/carousel (if present)
- Navigation back to horse list works

### 3.3 Visitor Filtering by Sale Status

**As a** visitor  
**I want to** filter horses by sale availability  
**So that** I can focus on horses I'm interested in buying.

**Acceptance Criteria:**

- Filter button/dropdown for "Eladó" / "Nem eladó" / "Összes"
- Filter updates the list immediately
- Filter persists during session (optional: in URL or localStorage)

---

## 4. Data Model

### 4.1 Horses Table (Existing)

```sql
CREATE TABLE horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sex CHAR(1) NOT NULL, -- 'M' (male/hérosz) or 'F' (female/kanca)
  birth_year INT,
  sire_id UUID REFERENCES horses(id) ON DELETE SET NULL,
  dam_id UUID REFERENCES horses(id) ON DELETE SET NULL,
  is_available_for_sale BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Horse Images Table (Existing)

```sql
CREATE TABLE horse_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID NOT NULL REFERENCES horses(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, -- URL from Supabase Storage
  alt_text TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. API Contract

### 5.1 Fetch All Horses

**Endpoint:** `GET /horses`  
**Method:** GET  
**Auth:** Public (no auth required)

**Query Parameters:**

- `available_only` (optional, boolean): Filter for sale horses only. Default: false.
- `limit` (optional, int): Number of results. Default: 100.
- `offset` (optional, int): Pagination offset. Default: 0.

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Moonlight Star",
      "sex": "F",
      "birth_year": 2018,
      "is_available_for_sale": true,
      "sire_id": "uuid_or_null",
      "dam_id": "uuid_or_null",
      "description": "Beautiful mare...",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "count": 15
}
```

**Error (500):**

```json
{
  "error": "Failed to fetch horses"
}
```

### 5.2 Fetch Single Horse with Relations

**Endpoint:** `GET /horses/:id`  
**Method:** GET  
**Auth:** Public

**Response (200 OK):**

```json
{
  "id": "uuid",
  "name": "Moonlight Star",
  "sex": "F",
  "birth_year": 2018,
  "is_available_for_sale": true,
  "description": "...",
  "sire": {
    "id": "uuid",
    "name": "Thunder King"
  },
  "dam": {
    "id": "uuid",
    "name": "Rosa Gold"
  },
  "images": [
    {
      "id": "uuid",
      "image_url": "https://...",
      "alt_text": "Standing profile",
      "display_order": 0
    }
  ]
}
```

---

## 6. Component Architecture

### 6.1 Folder Structure

```
src/
├── services/
│   └── horseService.js          # Supabase queries for horses
├── composables/
│   └── useHorses.js              # Business logic (fetch, filter)
├── components/
│   ├── HorsesPage.vue           # Main list view (REFACTOR)
│   └── horses/
│       ├── HorseCard.vue         # Reusable horse card snippet
│       ├── HorseDetail.vue       # Horse detail modal/page
│       ├── HorseFilter.vue       # Filter controls
│       └── HorseGallery.vue      # Image carousel/gallery
└── views/
    └── HorseDetailView.vue       # Router view for single horse
```

### 6.2 Component Responsibilities

#### `src/services/horseService.js`

- `fetchAllHorses(filters)` → returns list of horses from Supabase
- `fetchHorseById(id)` → returns single horse with relations + images
- `fetchHorsesByAvailability(available)` → filtered query

#### `src/composables/useHorses.js`

- Reactive state: `horses`, `selectedHorse`, `filters`, `loading`, `error`
- Methods: `loadHorses()`, `filterByAvailability(status)`, `selectHorse(id)`, etc.
- URL/localStorage persistence (optional)

#### `src/components/HorsesPage.vue` (REFACTOR from existing)

- Container component
- Compose: HorseFilter + HorseCard list or table
- Handle filter changes
- Show loading/error states

#### `src/components/horses/HorseCard.vue`

- Display: image, name, sex, birth_year, sale status badge
- Link to detail page
- Props: `horse` object

#### `src/components/horses/HorseDetail.vue` (or DetailView)

- Display: name, sex, birth_year, description
- Sire/dam table showing parent genealogy
- Images carousel
- Props: `horseId`

#### `src/components/horses/HorseFilter.vue`

- Dropdown/buttons: "Összes", "Eladó", "Nem eladó"
- Emit: `@filter-change` event
- Props: `modelValue` (current filter)

#### `src/components/horses/HorseGallery.vue`

- Display images in carousel or grid
- Props: `images` array
- Fallback placeholder if no images

---

## 7. Implementation Details

### 7.1 Supabase Queries (horseService.js)

```javascript
// Fetch all horses with optional filtering
async function fetchAllHorses(filters = {}) {
  let query = supabase.from("horses").select("*");

  if (filters.available_only) {
    query = query.eq("is_available_for_sale", true);
  }

  const { data, error } = await query.order("name", { ascending: true });

  if (error) throw error;
  return data;
}

// Fetch single horse with sire/dam and images
async function fetchHorseById(id) {
  const { data: horse, error: horseError } = await supabase
    .from("horses")
    .select(
      `
      *,
      sire:horses!sire_id(id, name),
      dam:horses!dam_id(id, name),
      images:horse_images(id, image_url, alt_text, display_order)
    `,
    )
    .eq("id", id)
    .single();

  if (horseError) throw horseError;
  return horse;
}
```

### 7.2 HorsesPage.vue (REFACTOR)

Current file exists. Refactor to:

1. Import `useHorses()` composable
2. Replace static HTML with dynamic horse list
3. Add HorseFilter + HorseCard components
4. Handle empty state

**Key changes:**

- `<script setup>` with `useHorses()`
- v-for loop over `horses` array
- Conditional rendering for empty state

### 7.3 Routing

Add/update route in `src/router/index.js`:

```javascript
{
  path: '/horses',
  name: 'Horses',
  component: () => import('../views/HorsesView.vue')
},
{
  path: '/horses/:id',
  name: 'HorseDetail',
  component: () => import('../views/HorseDetailView.vue')
}
```

---

## 8. UI/UX Requirements

### 8.1 Layout (Bootstrap/Responsive)

**Horse List:**

- Grid of 3–4 cards per row (desktop)
- 2 cards per row (tablet)
- 1 card per row (mobile)
- Filter dropdown above the grid

**Horse Card:**

- Image: 300×300px (square crop or aspect-ratio 1:1)
- Name (heading)
- Sex + Birth Year (subtitle)
- "Eladó" badge if available_for_sale = true
- Click → navigate to detail page

**Horse Detail Page:**

- Back button + breadcrumb
- Large image + thumbnail carousel
- Info section: name, sex, birth_year, description
- Pedigree / Parent Information (table or tree)
- Related horses link (sire/dam detail)

### 8.2 Styling

- Use Bootstrap utility classes (btn, card, grid-col, badge, etc.)
- Custom CSS minimal (scoped to component)
- "Eladó" badge: green (`badge-success`)
- "Nem eladó" badge: gray (`badge-secondary`)
- Empty state: centered message with icon

### 8.3 Loading & Error States

- Loading spinner while fetching
- Error message if fetch fails (with retry button)
- Empty state: "Nincs ló az adatbázisban"

---

## 9. Database Queries & Indexes

### 9.1 Required Indexes

```sql
-- For horse list queries
CREATE INDEX idx_horses_available ON horses(is_available_for_sale);

-- For pedigree lookups
CREATE INDEX idx_horses_sire ON horses(sire_id);
CREATE INDEX idx_horses_dam ON horses(dam_id);

-- For image queries
CREATE INDEX idx_horse_images_horse_id ON horse_images(horse_id);
```

### 9.2 RLS Policies

**Horses Table:**

- ✅ Public read (SELECT)
- ✅ Authenticated admin write (INSERT, UPDATE, DELETE) – for Increment 4

**Horse Images Table:**

- ✅ Public read (SELECT)
- ✅ Authenticated admin write (INSERT, UPDATE, DELETE) – for Increment 4

---

## 10. Testing Checklist

### 10.1 Functional Tests

- [ ] Load horse list – all horses displayed
- [ ] Filter by "Eladó" – only available horses shown
- [ ] Filter by "Nem eladó" – only unavailable horses shown
- [ ] Filter by "Összes" – all horses shown
- [ ] Click horse → navigate to detail page
- [ ] Horse detail shows sire/dam if they exist
- [ ] Horse detail back button works
- [ ] Empty state shows "Nincs ló az adatbázisban" when DB is empty

### 10.2 Responsive Tests

- [ ] Horse list grid: 4 cols (desktop), 2 cols (tablet), 1 col (mobile)
- [ ] Horse detail readable on all screen sizes
- [ ] Images scale correctly

### 10.3 Error Cases

- [ ] Network error → error message + retry button
- [ ] Invalid horse ID → 404 or redirect
- [ ] Missing images → placeholder or empty gallery

---

## 11. Acceptance Criteria (Summary)

✅ **Must Have:**

1. Horse list loads from Supabase `horses` table
2. Each horse displays: name, sex, birth_year, image (if available)
3. Filter by sale status works ("Eladó" / "Nem eladó" / "Összes")
4. Horse detail page shows sire/dam names (if they exist)
5. Responsive design works on mobile/tablet/desktop
6. Empty state message: "Nincs ló az adatbázisban"

✅ **Should Have:**

1. Pedigree table showing sire/dam hierarchy
2. Image gallery/carousel on detail page
3. Links to sire/dam detail pages

~ **Nice to Have:**

1. Filter persistence (URL params or localStorage)
2. Sort by name, birth year
3. Breadcrumb navigation

---

## 12. Implementation Notes

### 12.1 Refactoring Existing Components

The project already has `src/components/HorsesPage.vue`. This increment **refactors** it:

- Remove static HTML
- Add dynamic data fetching via `useHorses()` composable
- Break into smaller components (HorseCard, HorseFilter, etc.)

### 12.2 Folder Structure

Follow CLAUDE.md guidelines:

- Services in `src/services/horseService.js`
- Composables in `src/composables/useHorses.js`
- Components in `src/components/horses/`
- Views in `src/views/`

### 12.3 Supabase Client

- Use existing client singleton from `src/services/supabase.js`
- No `.env` changes needed (anon key already configured)

### 12.4 Future Considerations

- Increment 4 will add image upload → `horse_images` table
- Increment 4 will add Create/Update/Delete horse CRUD
- Performance: No pagination needed yet (assume <100 horses), but consider if list grows

---

## 13. File Summary

### New Files:

- `src/services/horseService.js`
- `src/composables/useHorses.js`
- `src/components/horses/HorseCard.vue`
- `src/components/horses/HorseFilter.vue`
- `src/components/horses/HorseGallery.vue`
- `src/views/HorseDetailView.vue` (or inline in detail page component)

### Refactored Files:

- `src/components/HorsesPage.vue`

### Modified Files:

- `src/router/index.js` (add horse detail route)
- `README.md` (update feature list)

---

## 14. Timeline & Effort

**Estimated Breakdown:**

- Setup composable + service layer: **30 min**
- Refactor HorsesPage component: **30 min**
- Horse detail page + related components: **45 min**
- Testing + responsive fixes: **30 min**
- **Total: ~2–2.5 hours**

**Go/No-Go Check Before Starting:**

- ✅ Supabase project + tables + sample data ready (Increment 1 complete)
- ✅ Auth layer ready (Increment 2 complete)
- ✅ Bootstrap included in project
- ✅ Vue Router configured
