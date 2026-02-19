# Increment 3: Implementation Guide

**Status:** Ready to Code  
**Preconditions:** Increment 1 (DB) and Increment 2 (Auth) MUST be complete

---

## Quick Start Checklist

Before starting implementation:

- [ ] Verify Supabase project is running and accessible
- [ ] Confirm `horses` and `horse_images` tables exist with sample data
- [ ] Verify Supabase client is configured in `src/services/supabase.js`
- [ ] Check that Vue Router is working (test a known route)
- [ ] Verify Bootstrap is installed and styles load correctly

---

## Step-by-Step Implementation

### Phase 1: Setup Service Layer (30 min)

#### 1.1 Create `src/services/horseService.js`

```javascript
import { supabase } from "./supabase.js";

/**
 * Fetch all horses with optional filters
 * @param {Object} filters - { available_only: boolean }
 * @returns {Promise<Array>}
 */
export async function fetchAllHorses(filters = {}) {
  let query = supabase
    .from("horses")
    .select("id, name, sex, birth_year, is_available_for_sale");

  if (filters.available_only) {
    query = query.eq("is_available_for_sale", true);
  }

  const { data, error } = await query.order("name", { ascending: true });

  if (error) {
    console.error("Error fetching horses:", error);
    throw new Error("Failed to fetch horses");
  }

  return data || [];
}

/**
 * Fetch single horse with full details and relations
 * @param {string} id - horse UUID
 * @returns {Promise<Object>}
 */
export async function fetchHorseById(id) {
  const { data, error } = await supabase
    .from("horses")
    .select(
      `
      id,
      name,
      sex,
      birth_year,
      is_available_for_sale,
      description,
      sire:horses!sire_id(id, name),
      dam:horses!dam_id(id, name),
      images:horse_images(id, image_url, alt_text, display_order)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching horse:", error);
    throw new Error(`Failed to fetch horse with ID ${id}`);
  }

  return data;
}

/**
 * Get parent horse info (for pedigree display)
 * @param {string} sireId - sire UUID
 * @param {string} damId - dam UUID
 * @returns {Promise<Object>}
 */
export async function fetchParents(sireId, damId) {
  const queries = [];

  if (sireId) {
    queries.push(
      supabase
        .from("horses")
        .select("id, name, sex, birth_year")
        .eq("id", sireId)
        .single(),
    );
  }

  if (damId) {
    queries.push(
      supabase
        .from("horses")
        .select("id, name, sex, birth_year")
        .eq("id", damId)
        .single(),
    );
  }

  const results = await Promise.all(queries);

  return {
    sire: results[0]?.data || null,
    dam: results[1]?.data || null,
  };
}
```

**Rationale:**

- Composable functions for each query type
- Error handling consistent with Vue practices
- Selective field selection (smaller payload)
- Relation selects for sire/dam + images

---

### Phase 2: Setup Composable Layer (30 min)

#### 2.1 Create `src/composables/useHorses.js`

```javascript
import { ref, computed } from "vue";
import { fetchAllHorses, fetchHorseById } from "../services/horseService.js";

export function useHorses() {
  const horses = ref([]);
  const selectedHorse = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const filterStatus = ref("all"); // 'all', 'available', 'unavailable'

  /**
   * Load all horses from database
   */
  async function loadHorses() {
    loading.value = true;
    error.value = null;

    try {
      const filters = {
        available_only: filterStatus.value === "available",
      };
      horses.value = await fetchAllHorses(filters);
    } catch (err) {
      error.value = err.message;
      horses.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Set filter and reload horses
   */
  async function setFilterStatus(status) {
    filterStatus.value = status;
    await loadHorses();
  }

  /**
   * Load a single horse by ID
   */
  async function loadHorseById(id) {
    loading.value = true;
    error.value = null;

    try {
      selectedHorse.value = await fetchHorseById(id);
    } catch (err) {
      error.value = err.message;
      selectedHorse.value = null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Computed: filtered horses based on current filter
   * (Local filtering – optimized if <1000 horses)
   */
  const filteredHorses = computed(() => {
    if (filterStatus.value === "all") return horses.value;
    if (filterStatus.value === "available") {
      return horses.value.filter((h) => h.is_available_for_sale);
    }
    if (filterStatus.value === "unavailable") {
      return horses.value.filter((h) => !h.is_available_for_sale);
    }
    return horses.value;
  });

  /**
   * Computed: is list empty
   */
  const isEmpty = computed(() => filteredHorses.value.length === 0);

  return {
    horses: filteredHorses,
    selectedHorse,
    loading,
    error,
    filterStatus,
    isEmpty,
    loadHorses,
    setFilterStatus,
    loadHorseById,
  };
}
```

**Rationale:**

- Encapsulates business logic (loading, filtering)
- Reactive state (ref/computed)
- Separation of concerns (UI ↔ Data)
- Lightweight: no external dependencies (no Pinia yet per guidelines)

---

### Phase 3: Component Architecture (90 min)

#### 3.1 Create `src/components/horses/HorseCard.vue`

```vue
<script setup>
defineProps({
  horse: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="card h-100">
    <div
      class="card-img-top bg-light d-flex align-items-center justify-content-center"
      style="height: 250px"
    >
      <!-- TODO: Replace with actual image when available -->
      <span class="text-muted">No Image</span>
    </div>

    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ horse.name }}</h5>

      <p class="card-text text-muted">
        <small>
          {{ horse.sex === "F" ? "Kanca" : "Hérosz" }} • {{ horse.birth_year }}
        </small>
      </p>

      <div v-if="horse.is_available_for_sale" class="mb-2">
        <span class="badge bg-success">Eladó</span>
      </div>

      <router-link
        :to="`/horses/${horse.id}`"
        class="btn btn-primary btn-sm mt-auto"
      >
        Részletek
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
```

**Rationale:**

- Reusable card component
- Simple props interface
- RouterLink for navigation
- Bootstrap card structure
- Minimal custom CSS (hover effect only)

#### 3.2 Create `src/components/horses/HorseFilter.vue`

```vue
<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "all", // 'all', 'available', 'unavailable'
  },
});

const emit = defineEmits(["update:modelValue"]);

const filters = [
  { value: "all", label: "Összes" },
  { value: "available", label: "Eladók" },
  { value: "unavailable", label: "Nem eladók" },
];

function handleClick(value) {
  emit("update:modelValue", value);
}
</script>

<template>
  <div class="btn-group mb-4" role="group">
    <button
      v-for="filter in filters"
      :key="filter.value"
      type="button"
      :class="[
        'btn',
        modelValue === filter.value ? 'btn-primary' : 'btn-outline-primary',
      ]"
      @click="handleClick(filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>
```

**Rationale:**

- v-model support for two-way binding
- Bootstrap btn-group styling
- Clean button API
- Reusable in any parent

#### 3.3 Create `src/components/horses/HorseGallery.vue`

```vue
<script setup>
import { ref, computed } from "vue";

defineProps({
  images: {
    type: Array,
    default: () => [],
  },
});

const currentIndex = ref(0);

const sortedImages = computed(() => {
  return [...props.images].sort((a, b) => a.display_order - b.display_order);
});

const currentImage = computed(() => {
  return sortedImages.value[currentIndex.value] || null;
});

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % sortedImages.value.length;
}

function prevImage() {
  currentIndex.value =
    (currentIndex.value - 1 + sortedImages.value.length) %
    sortedImages.value.length;
}
</script>

<template>
  <div>
    <!-- Main carousel -->
    <div
      v-if="images.length > 0"
      class="carousel-main bg-light d-flex align-items-center justify-content-center mb-3"
    >
      <div v-if="currentImage" style="max-width: 100%; max-height: 400px">
        <img
          :src="currentImage.image_url"
          :alt="currentImage.alt_text || 'Horse image'"
          class="img-fluid"
          style="object-fit: cover"
        />
      </div>
    </div>

    <!-- Navigation -->
    <div
      v-if="images.length > 1"
      class="d-flex justify-content-between align-items-center"
    >
      <button class="btn btn-outline-secondary btn-sm" @click="prevImage">
        ← Előző
      </button>
      <small>{{ currentIndex + 1 }} / {{ images.length }}</small>
      <button class="btn btn-outline-secondary btn-sm" @click="nextImage">
        Következő →
      </button>
    </div>

    <!-- Fallback -->
    <div v-else class="alert alert-info">Nincs elérhető kép.</div>
  </div>
</template>

<style scoped>
.carousel-main {
  min-height: 400px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
```

**Rationale:**

- Simple carousel (no 3rd-party lib)
- Sort images by display_order
- Prev/Next navigation
- Image count indicator
- Fallback for no images

#### 3.4 Refactor `src/components/HorsesPage.vue`

Replace existing file:

```vue
<script setup>
import { onMounted } from "vue";
import { useHorses } from "../composables/useHorses.js";
import HorseCard from "./horses/HorseCard.vue";
import HorseFilter from "./horses/HorseFilter.vue";

const {
  horses,
  loading,
  error,
  filterStatus,
  isEmpty,
  loadHorses,
  setFilterStatus,
} = useHorses();

onMounted(() => {
  loadHorses();
});
</script>

<template>
  <div class="container my-5">
    <h1 class="mb-4">Lovaink</h1>

    <!-- Filter -->
    <HorseFilter
      :model-value="filterStatus"
      @update:model-value="setFilterStatus"
    />

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Betöltés...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger">
      <strong>Hiba:</strong> {{ error }}
      <button class="btn btn-sm btn-outline-danger mt-2" @click="loadHorses">
        Újrapróbálkozás
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="isEmpty" class="alert alert-info text-center py-5">
      <h4>Nincs ló az adatbázisban</h4>
      <p class="text-muted">Hamarosan lesz!</p>
    </div>

    <!-- Horse Grid -->
    <div v-else class="row g-4">
      <div
        v-for="horse in horses"
        :key="horse.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <HorseCard :horse="horse" />
      </div>
    </div>
  </div>
</template>
```

**Rationale:**

- Uses composable for state
- Thin component (composition + rendering)
- Bootstrap grid (responsive)
- Error + loading + empty states
- Clear data flow

#### 3.5 Create `src/views/HorseDetailView.vue`

```vue
<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { useHorses } from "../composables/useHorses.js";
import HorseGallery from "../components/horses/HorseGallery.vue";

const route = useRoute();
const router = useRouter();
const { selectedHorse, loading, error, loadHorseById } = useHorses();

onMounted(() => {
  loadHorseById(route.params.id);
});

function goBack() {
  router.back();
}
</script>

<template>
  <div class="container my-5">
    <!-- Back Button -->
    <button class="btn btn-outline-secondary mb-4" @click="goBack">
      ← Vissza a listára
    </button>

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Betöltés...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger">
      <strong>Hiba:</strong> {{ error }}
    </div>

    <!-- Horse Detail -->
    <div v-else-if="selectedHorse" class="row">
      <!-- Images -->
      <div class="col-12 col-md-6 mb-4">
        <HorseGallery :images="selectedHorse.images || []" />
      </div>

      <!-- Info -->
      <div class="col-12 col-md-6">
        <h1>{{ selectedHorse.name }}</h1>

        <div class="mb-3">
          <strong>Nem:</strong>
          {{ selectedHorse.sex === "F" ? "Kanca (🐴♀️)" : "Hérosz (🐴♂️)" }}
        </div>

        <div class="mb-3">
          <strong>Születési év:</strong>
          {{ selectedHorse.birth_year || "Ismeretlen" }}
        </div>

        <div v-if="selectedHorse.is_available_for_sale" class="mb-3">
          <span class="badge bg-success">Eladó</span>
        </div>

        <!-- Description -->
        <div v-if="selectedHorse.description" class="mb-4">
          <strong>Leírás:</strong>
          <p>{{ selectedHorse.description }}</p>
        </div>

        <!-- Pedigree -->
        <div v-if="selectedHorse.sire || selectedHorse.dam" class="mb-4">
          <h4>Származása</h4>
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Szerep</th>
                <th>Név</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="selectedHorse.sire">
                <td><strong>Apa (Sire)</strong></td>
                <td>
                  <router-link :to="`/horses/${selectedHorse.sire.id}`">
                    {{ selectedHorse.sire.name }}
                  </router-link>
                </td>
              </tr>
              <tr v-if="selectedHorse.dam">
                <td><strong>Anya (Dam)</strong></td>
                <td>
                  <router-link :to="`/horses/${selectedHorse.dam.id}`">
                    {{ selectedHorse.dam.name }}
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="alert alert-warning">
      <strong>Ló nem található.</strong>
    </div>
  </div>
</template>
```

**Rationale:**

- Router integration for dynamic params
- Loads single horse on mount
- Back navigation
- Pedigree table (linking to parent horses)
- Error + loading states

---

### Phase 4: Router Setup (15 min)

#### 4.1 Update `src/router/index.js`

Add these routes (find existing HorsesPage route and add the detail route):

```javascript
// ... existing imports ...
import HorsesView from "../components/HorsesPage.vue";
import HorseDetailView from "../views/HorseDetailView.vue";

const routes = [
  // ... existing routes ...
  {
    path: "/horses",
    name: "Horses",
    component: HorsesView,
  },
  {
    path: "/horses/:id",
    name: "HorseDetail",
    component: HorseDetailView,
  },
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
```

**Note:** Adjust paths if existing router structure differs. Check current `src/router/index.js` first.

---

### Phase 5: Testing & Refinement (30 min)

#### 5.1 Manual Testing Checklist

- [ ] **Load List:** Visit `/horses` → see all horses
- [ ] **Filter "Eladó":** Click "Eladók" → only available horses
- [ ] **Filter "Nem eladó":** Click "Nem eladók" → only unavailable horses
- [ ] **Filter "Összes":** See all again
- [ ] **Click Horse Card:** Navigate to `/horses/{id}`
- [ ] **Detail Page:** Shows name, sex, birth_year, description
- [ ] **Pedigree Links:** Click sire/dam → navigate to their detail
- [ ] **Images:** Carousel prev/next works (if multiple images)
- [ ] **Empty State:** Clear DB horses → "Nincs ló" message appears
- [ ] **Error:** Temporarily break connection → error message + retry
- [ ] **Mobile:** Test responsive layout (grid → 2 cols → 1 col)

#### 5.2 Common Issues & Fixes

**Issue:** Images not displaying

- **Cause:** Invalid image_url from Storage
- **Fix:** Verify Supabase Storage bucket + permissions + image upload

**Issue:** Sire/dam not loading

- **Cause:** Relation select malformed in Supabase query
- **Fix:** Test query in Supabase Studio; ensure `sire_id` / `dam_id` are valid

**Issue:** Filter not persisting

- **Current:** Filter resets on page reload
- **Future:** Add URL params (`?filter=available`) or localStorage (Increment 5+)

---

## After Implementation

### Post-Implementation Checklist

- [ ] Run `npm run build` – no errors?
- [ ] Delete any test files (Vitest/Jest/etc.) if auto-generated
- [ ] Verify folder structure:
  ```
  src/
  ├── services/horseService.js ✅
  ├── composables/useHorses.js ✅
  ├── components/
  │   ├── HorsesPage.vue ✅ (refactored)
  │   └── horses/
  │       ├── HorseCard.vue ✅
  │       ├── HorseFilter.vue ✅
  │       └── HorseGallery.vue ✅
  └── views/
      └── HorseDetailView.vue ✅
  ```
- [ ] Update `README.md` feature list:
  ```
  - View all horses in the stable
  - Filter horses by availability (for sale / not for sale)
  - View horse details including pedigree
  - Browse horse images
  ```
- [ ] Verify `.env.example` – no new variables needed
- [ ] Check git status – no uncommitted test artifacts
- [ ] Test in dev mode: `npm run dev`

---

## Troubleshooting

### "Cannot read property 'images' of null"

- **Cause:** `selectedHorse` not loaded yet
- **Fix:** Add `v-if="selectedHorse"` guard in template

### Router not finding `/horses/:id` route

- **Cause:** Route not registered in `src/router/index.js`
- **Fix:** Import HorseDetailView and add route object

### Supabase query returns empty array

- **Cause:** No horses in DB or wrong table name
- **Fix:** Verify in Supabase Studio Dashboard → horses table has rows

### Images carousel not scrolling

- **Cause:** Only 1 image (carousel disabled by design)
- **Fix:** Test with multiple images; check `display_order` field

---

## Environment & Dependencies

No new dependencies required.

**Uses:**

- Vue 3 (Composition API)
- Vue Router
- Bootstrap 5 (existing)
- Supabase JS Client (existing)

---

## Timeline

- **Phase 1 (Service):** ~30 min
- **Phase 2 (Composable):** ~30 min
- **Phase 3 (Components):** ~90 min
- **Phase 4 (Router):** ~15 min
- **Phase 5 (Testing):** ~30 min
- **Total:** ~195 min (3.25 hours)

**Realistic:** 2–3 hours (includes debugging, tweaks, testing)

---

## Sign-Off Criteria

Increment 3 is **complete** when:

✅ All horses from DB display on `/horses`  
✅ Filter by availability works  
✅ Detail page shows pedigree + images  
✅ Responsive design ✓  
✅ No TypeScript, no tests, no random CSS  
✅ Folder structure follows CLAUDE.md  
✅ README updated  
✅ Code compiles without errors

**Ready to merge when:** All above ✓ + QA testing passed.
