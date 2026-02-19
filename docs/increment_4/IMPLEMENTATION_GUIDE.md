# Increment 4: Implementation Guide

**Status:** Ready to Code  
**Preconditions:** Increment 2 (Auth) AND Increment 3 (Horse Display) MUST be complete

---

## Quick Start Checklist

Before starting implementation:

- [ ] Verify Increment 2 auth is working (login/logout)
- [ ] Verify Increment 3 horse display is working (list loads from DB)
- [ ] Confirm Supabase RLS policies exist for horses + horse_images
- [ ] Confirm `horse-images` Storage bucket exists + permissions set
- [ ] Have test data: at least 3 horses in DB for sire/dam dropdown

---

## Step-by-Step Implementation

### Phase 1: Service Layer – Image Upload (45 min)

#### 1.1 Create `src/services/horseImageService.js`

```javascript
import { supabase } from "../lib/supabase.js";

/**
 * Upload a single image to Supabase Storage
 * @param {string} horseId - horse UUID
 * @param {File} file - image file object
 * @param {number} displayOrder - position in gallery
 * @returns {Promise<Object>} - { id, horse_id, image_url, ... }
 */
export async function uploadImage(horseId, file, displayOrder = 0) {
  // Validate file
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("File too large (max 5MB)");
  }

  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Use JPG, PNG, or WebP");
  }

  // Generate filename
  const timestamp = Date.now();
  const ext = file.name.split(".").pop();
  const filename = `${timestamp}-${file.name}`;
  const filePath = `${horseId}/${filename}`;

  try {
    // Upload to Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("horse-images")
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("horse-images")
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // Insert into horse_images table
    const { data: imageData, error: insertError } = await supabase
      .from("horse_images")
      .insert({
        horse_id: horseId,
        image_url: imageUrl,
        alt_text: file.name.split(".")[0],
        display_order: displayOrder,
      })
      .select()
      .single();

    if (insertError) {
      // Rollback: delete uploaded file
      await supabase.storage.from("horse-images").remove([filePath]);
      throw insertError;
    }

    return imageData;
  } catch (err) {
    console.error("Error uploading image:", err);
    throw err;
  }
}

/**
 * Delete an image from Storage and database
 * @param {string} imageId - horse_images table UUID
 * @param {string} imageUrl - full public URL of image
 * @returns {Promise<void>}
 */
export async function deleteImage(imageId, imageUrl) {
  try {
    // Extract file path from URL
    const pathMatch = imageUrl.match(/horse-images\/(.+)$/);
    if (!pathMatch) throw new Error("Invalid image URL");
    const filePath = pathMatch[1];

    // Delete from Storage
    const { error: deleteError } = await supabase.storage
      .from("horse-images")
      .remove([filePath]);

    if (deleteError) throw deleteError;

    // Delete from database
    const { error: dbError } = await supabase
      .from("horse_images")
      .delete()
      .eq("id", imageId);

    if (dbError) throw dbError;
  } catch (err) {
    console.error("Error deleting image:", err);
    throw err;
  }
}

/**
 * Update image display order
 * @param {string} imageId - horse_images table UUID
 * @param {number} displayOrder - new order
 * @returns {Promise<Object>}
 */
export async function updateImageOrder(imageId, displayOrder) {
  const { data, error } = await supabase
    .from("horse_images")
    .update({ display_order: displayOrder })
    .eq("id", imageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update image alt text
 * @param {string} imageId - horse_images table UUID
 * @param {string} altText - new alt text
 * @returns {Promise<Object>}
 */
export async function updateImageAltText(imageId, altText) {
  const { data, error } = await supabase
    .from("horse_images")
    .update({ alt_text: altText })
    .eq("id", imageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

**Rationale:**

- File validation before upload
- Automatic rollback if DB insert fails
- Proper error handling + logging
- Reusable functions for image CRUD

#### 1.2 Extend `src/services/horseService.js`

Add to existing file:

```javascript
/**
 * Create new horse
 * @param {Object} horseData - { name, gender, birth_year, ... }
 * @returns {Promise<Object>}
 */
export async function createHorse(horseData) {
  const { data, error } = await supabase
    .from("horses")
    .insert(horseData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update existing horse
 * @param {string} id - horse UUID
 * @param {Object} updates - fields to update
 * @returns {Promise<Object>}
 */
export async function updateHorse(id, updates) {
  const { data, error } = await supabase
    .from("horses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete horse (cascade deletes images)
 * @param {string} id - horse UUID
 * @returns {Promise<void>}
 */
export async function deleteHorse(id) {
  // First, delete images from Storage
  const { data: images, error: imagesError } = await supabase
    .from("horse_images")
    .select("id, image_url")
    .eq("horse_id", id);

  if (imagesError) throw imagesError;

  // Delete each image from Storage
  for (const img of images || []) {
    const pathMatch = img.image_url.match(/horse-images\/(.+)$/);
    if (pathMatch) {
      await supabase.storage.from("horse-images").remove([pathMatch[1]]);
    }
  }

  // Delete horse (DB cascade handles horse_images rows)
  const { error: deleteError } = await supabase
    .from("horses")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;
}

/**
 * Fetch all horses (for sire/dam dropdown)
 * @returns {Promise<Array>}
 */
export async function fetchParentOptions() {
  const { data, error } = await supabase
    .from("horses")
    .select("id, name, gender, birth_year")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch single horse for editing (with images)
 * @param {string} id - horse UUID
 * @returns {Promise<Object>}
 */
export async function fetchHorseForEdit(id) {
  const { data, error } = await supabase
    .from("horses")
    .select(
      `
      id,
      name,
      gender,
      birth_year,
      is_available_for_sale,
      description,
      sire_id,
      dam_id,
      images:horse_images(id, image_url, alt_text, display_order)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
```

---

### Phase 2: Composables – Form State (45 min)

#### 2.1 Create `src/composables/useHorseForm.js`

```javascript
import { ref, computed } from "vue";
import {
  createHorse,
  updateHorse,
  fetchHorseForEdit,
  fetchParentOptions,
} from "../services/horseService.js";

export function useHorseForm() {
  // Form fields
  const name = ref("");
  const gender = ref("");
  const birth_year = ref(new Date().getFullYear());
  const sire_id = ref(null);
  const dam_id = ref(null);
  const is_available_for_sale = ref(false);
  const description = ref("");

  // State
  const loading = ref(false);
  const submitting = ref(false);
  const errors = ref({});
  const parentOptions = ref([]);
  const editingHorseId = ref(null);

  /**
   * Validate form
   */
  function validateForm() {
    const newErrors = {};

    if (!name.value.trim()) {
      newErrors.name = "Név kötelező";
    }

    if (!gender.value) {
      newErrors.gender = "Nem kiválasztása kötelező";
    }

    if (birth_year.value) {
      const year = parseInt(birth_year.value);
      const currentYear = new Date().getFullYear();
      if (year > currentYear) {
        newErrors.birth_year = "Születési év nem lehet a jövőben";
      }
      if (year < 1900) {
        newErrors.birth_year = "Születési év nincs realisztikusan";
      }
    }

    if (sire_id.value && dam_id.value && sire_id.value === dam_id.value) {
      newErrors.sire_id = "Apa és anya nem lehet ugyanaz a ló";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Reset form
   */
  function resetForm() {
    name.value = "";
    gender.value = "";
    birth_year.value = new Date().getFullYear();
    sire_id.value = null;
    dam_id.value = null;
    is_available_for_sale.value = false;
    description.value = "";
    errors.value = {};
    editingHorseId.value = null;
  }

  /**
   * Load horse data into form (for editing)
   */
  async function loadHorse(id) {
    loading.value = true;

    try {
      const horse = await fetchHorseForEdit(id);
      name.value = horse.name;
      gender.value = horse.gender;
      birth_year.value = horse.birth_year;
      sire_id.value = horse.sire_id;
      dam_id.value = horse.dam_id;
      is_available_for_sale.value = horse.is_available_for_sale;
      description.value = horse.description || "";
      editingHorseId.value = id;
    } catch (err) {
      errors.value = { general: err.message };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load parent options for dropdowns
   */
  async function loadParentOptions() {
    try {
      parentOptions.value = await fetchParentOptions();
    } catch (err) {
      console.error("Error loading parent options:", err);
    }
  }

  /**
   * Submit form (create or update)
   */
  async function submitForm() {
    if (!validateForm()) return;

    submitting.value = true;

    try {
      const horseData = {
        name: name.value,
        gender: gender.value,
        birth_year: birth_year.value ? parseInt(birth_year.value) : null,
        sire_id: sire_id.value || null,
        dam_id: dam_id.value || null,
        is_available_for_sale: is_available_for_sale.value,
        description: description.value,
      };

      if (editingHorseId.value) {
        await updateHorse(editingHorseId.value, horseData);
      } else {
        await createHorse(horseData);
      }

      return true; // Success
    } catch (err) {
      errors.value = { general: err.message };
      return false; // Failure
    } finally {
      submitting.value = false;
    }
  }

  const isEditing = computed(() => !!editingHorseId.value);
  const formTitle = computed(() =>
    isEditing.value ? `Ló szerkesztése: ${name.value}` : "Új ló",
  );

  return {
    // Fields
    name,
    gender,
    birth_year,
    sire_id,
    dam_id,
    is_available_for_sale,
    description,
    // State
    loading,
    submitting,
    errors,
    parentOptions,
    editingHorseId,
    // Methods
    validateForm,
    resetForm,
    loadHorse,
    loadParentOptions,
    submitForm,
    // Computed
    isEditing,
    formTitle,
  };
}
```

**Rationale:**

- Form state in composable (Vue 3 standard)
- Validation logic centralized
- Reusable across components
- Clear error messages in Hungarian

#### 2.2 Extend `src/composables/useHorses.js`

Add to existing file:

```javascript
/**
 * Delete a horse
 */
async function deleteHorse(id) {
  loading.value = true;
  error.value = null;

  try {
    await import("../services/horseService.js").then((m) => m.deleteHorse(id));
    // Reload list
    await loadHorses();
    return true;
  } catch (err) {
    error.value = err.message;
    return false;
  } finally {
    loading.value = false;
  }
}

// Add to return statement:
return {
  // ... existing ...
  deleteHorse,
};
```

---

### Phase 3: Components (90 min)

#### 3.1 Create `src/components/horses/HorseForm.vue`

```vue
<script setup>
import { onMounted } from "vue";
import { useHorseForm } from "@/composables/useHorseForm.js";
import HorseImageUpload from "./HorseImageUpload.vue";
import HorseImageGallery from "./HorseImageGallery.vue";

const props = defineProps({
  horseId: String, // null for create, UUID for edit
});

const emit = defineEmits(["submit", "cancel"]);

const {
  name,
  gender,
  birth_year,
  sire_id,
  dam_id,
  is_available_for_sale,
  description,
  loading,
  submitting,
  errors,
  parentOptions,
  loadHorse,
  loadParentOptions,
  submitForm,
  formTitle,
} = useHorseForm();

onMounted(async () => {
  await loadParentOptions();
  if (props.horseId) {
    await loadHorse(props.horseId);
  }
});

async function handleSubmit() {
  const success = await submitForm();
  if (success) {
    emit("submit");
  }
}

function handleCancel() {
  emit("cancel");
}
</script>

<template>
  <div class="row">
    <!-- Form Column -->
    <div class="col-12 col-md-6">
      <h2>{{ formTitle }}</h2>

      <div v-if="loading" class="spinner-border" role="status">
        <span class="visually-hidden">Betöltés...</span>
      </div>

      <form v-else @submit.prevent="handleSubmit">
        <!-- Name -->
        <div class="mb-3">
          <label for="name" class="form-label">Ló neve *</label>
          <input
            id="name"
            v-model="name"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            required
          />
          <div v-if="errors.name" class="invalid-feedback d-block">
            {{ errors.name }}
          </div>
        </div>

        <!-- Gender -->
        <div class="mb-3">
          <label for="gender" class="form-label">Nem *</label>
          <select
            id="gender"
            v-model="gender"
            class="form-select"
            :class="{ 'is-invalid': errors.gender }"
            required
          >
            <option value="">-- Válassz --</option>
            <option value="M">Hérosz (♂)</option>
            <option value="F">Kanca (♀)</option>
          </select>
          <div v-if="errors.gender" class="invalid-feedback d-block">
            {{ errors.gender }}
          </div>
        </div>

        <!-- Birth Year -->
        <div class="mb-3">
          <label for="birth_year" class="form-label">Születési év</label>
          <input
            id="birth_year"
            v-model="birth_year"
            type="number"
            class="form-control"
            :class="{ 'is-invalid': errors.birth_year }"
            min="1900"
            :max="new Date().getFullYear()"
          />
          <div v-if="errors.birth_year" class="invalid-feedback d-block">
            {{ errors.birth_year }}
          </div>
        </div>

        <!-- Sire -->
        <div class="mb-3">
          <label for="sire_id" class="form-label">Apa (Sire)</label>
          <select id="sire_id" v-model="sire_id" class="form-select">
            <option :value="null">-- Nincs --</option>
            <option
              v-for="parent in parentOptions"
              :key="parent.id"
              :value="parent.id"
            >
              {{ parent.name }} ({{ parent.gender === "M" ? "♂" : "♀" }})
            </option>
          </select>
        </div>

        <!-- Dam -->
        <div class="mb-3">
          <label for="dam_id" class="form-label">Anya (Dam)</label>
          <select id="dam_id" v-model="dam_id" class="form-select">
            <option :value="null">-- Nincs --</option>
            <option
              v-for="parent in parentOptions"
              :key="parent.id"
              :value="parent.id"
            >
              {{ parent.name }} ({{ parent.gender === "M" ? "♂" : "♀" }})
            </option>
          </select>
          <div v-if="errors.sire_id" class="invalid-feedback d-block">
            {{ errors.sire_id }}
          </div>
        </div>

        <!-- Description -->
        <div class="mb-3">
          <label for="description" class="form-label">Leírás</label>
          <textarea
            id="description"
            v-model="description"
            class="form-control"
            rows="4"
            placeholder="Pl.: Versenyló, tenyésztésre..."
          ></textarea>
        </div>

        <!-- Available for Sale -->
        <div class="mb-3 form-check">
          <input
            id="available"
            v-model="is_available_for_sale"
            type="checkbox"
            class="form-check-input"
          />
          <label for="available" class="form-check-label"> Eladó ló </label>
        </div>

        <!-- General Error -->
        <div v-if="errors.general" class="alert alert-danger mb-3">
          {{ errors.general }}
        </div>

        <!-- Submit Buttons -->
        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <span
              v-if="submitting"
              class="spinner-border spinner-border-sm me-2"
              role="status"
            ></span>
            {{ horseId ? "Frissítés" : "Létrehozás" }}
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="handleCancel"
          >
            Mégsem
          </button>
        </div>
      </form>
    </div>

    <!-- Images Column -->
    <div class="col-12 col-md-6">
      <h3>Képek</h3>

      <HorseImageUpload :horse-id="horseId" />

      <hr />

      <HorseImageGallery v-if="horseId" :horse-id="horseId" />
    </div>
  </div>
</template>
```

#### 3.2 Create `src/components/horses/HorseImageUpload.vue`

```vue
<script setup>
import { ref } from "vue";
import { uploadImage } from "@/services/horseImageService.js";

defineProps({
  horseId: String,
});

const emit = defineEmits(["image-uploaded"]);

const fileInput = ref(null);
const uploading = ref(false);
const uploadError = ref(null);
const pendingFiles = ref([]);

function handleFileSelect(event) {
  const files = Array.from(event.target.files || []);
  pendingFiles.value = files;
}

async function handleUpload() {
  if (!pendingFiles.value.length) return;
  if (!props.horseId) {
    uploadError.value = "Előbb mentsd el a lót!";
    return;
  }

  uploading.value = true;
  uploadError.value = null;

  try {
    for (let i = 0; i < pendingFiles.value.length; i++) {
      const file = pendingFiles.value[i];
      await uploadImage(props.horseId, file, i);
    }

    emit("image-uploaded");
    pendingFiles.value = [];
    fileInput.value.value = "";
  } catch (err) {
    uploadError.value = err.message;
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <div>
    <div class="mb-3">
      <label for="image-input" class="form-label">Képek feltöltése</label>
      <input
        ref="fileInput"
        id="image-input"
        type="file"
        multiple
        accept="image/*"
        class="form-control"
        @change="handleFileSelect"
      />
      <small class="text-muted">JPG, PNG, WebP (max 5MB per file)</small>
    </div>

    <div v-if="pendingFiles.length" class="mb-3">
      <p class="text-muted">{{ pendingFiles.length }} kép kiválasztva</p>
      <button
        type="button"
        class="btn btn-success btn-sm"
        :disabled="uploading"
        @click="handleUpload"
      >
        <span
          v-if="uploading"
          class="spinner-border spinner-border-sm me-2"
        ></span>
        Feltöltés
      </button>
    </div>

    <div v-if="uploadError" class="alert alert-danger" role="alert">
      {{ uploadError }}
    </div>
  </div>
</template>
```

#### 3.3 Create `src/components/horses/HorseImageGallery.vue`

```vue
<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase.js";
import { deleteImage, updateImageOrder } from "@/services/horseImageService.js";

const props = defineProps({
  horseId: String,
  editable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["image-deleted"]);

const images = ref([]);
const loading = ref(false);
const error = ref(null);

async function loadImages() {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: err } = await supabase
      .from("horse_images")
      .select("*")
      .eq("horse_id", props.horseId)
      .order("display_order", { ascending: true });

    if (err) throw err;
    images.value = data || [];
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function handleDelete(imageId, imageUrl) {
  if (!confirm("Biztosan törölni szeretnéd ezt a képet?")) return;

  try {
    await deleteImage(imageId, imageUrl);
    images.value = images.value.filter((img) => img.id !== imageId);
    emit("image-deleted");
  } catch (err) {
    error.value = err.message;
  }
}

async function moveUp(index) {
  if (index === 0) return;
  const [a, b] = [images.value[index - 1], images.value[index]];
  [a.display_order, b.display_order] = [b.display_order, a.display_order];
  await Promise.all([
    updateImageOrder(a.id, a.display_order),
    updateImageOrder(b.id, b.display_order),
  ]);
  images.value.sort((x, y) => x.display_order - y.display_order);
}

async function moveDown(index) {
  if (index === images.value.length - 1) return;
  const [a, b] = [images.value[index], images.value[index + 1]];
  [a.display_order, b.display_order] = [b.display_order, a.display_order];
  await Promise.all([
    updateImageOrder(a.id, a.display_order),
    updateImageOrder(b.id, b.display_order),
  ]);
  images.value.sort((x, y) => x.display_order - y.display_order);
}

onMounted(() => {
  loadImages();
});
</script>

<template>
  <div>
    <div v-if="loading" class="spinner-border" role="status">
      <span class="visually-hidden">Betöltés...</span>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="!images.length" class="alert alert-info">
      Nincsenek képek
    </div>

    <div v-else class="gallery">
      <div
        v-for="(image, idx) in images"
        :key="image.id"
        class="gallery-item mb-3 p-2 border"
      >
        <img
          :src="image.image_url"
          :alt="image.alt_text"
          class="img-thumbnail mb-2"
          style="max-width: 150px"
        />
        <div class="d-flex gap-2">
          <button
            v-if="editable && idx > 0"
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="moveUp(idx)"
          >
            ↑
          </button>
          <button
            v-if="editable && idx < images.length - 1"
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="moveDown(idx)"
          >
            ↓
          </button>
          <button
            v-if="editable"
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="handleDelete(image.id, image.image_url)"
          >
            Törlés
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  display: grid;
  gap: 1rem;
}
</style>
```

#### 3.4 Create `src/components/horses/AdminHorseList.vue`

```vue
<script setup>
import { onMounted } from "vue";
import { useHorses } from "@/composables/useHorses.js";

const { horses, loading, error, loadHorses, deleteHorse } = useHorses();

onMounted(() => {
  loadHorses();
});

async function handleDelete(horseId, horseName) {
  const confirmed = confirm(
    `Biztosan törlöd a "${horseName}" lót? Ez az összes képét is törli.`,
  );
  if (!confirmed) return;

  const success = await deleteHorse(horseId);
  if (success) {
    alert("Ló sikeresen törölve!");
  } else {
    alert("Hiba történt a törléskor.");
  }
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Lovak kezelése</h2>
      <router-link to="/admin/horses/new" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>
        Új ló
      </router-link>
    </div>

    <div v-if="loading" class="spinner-border" role="status">
      <span class="visually-hidden">Betöltés...</span>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="!horses.length" class="alert alert-info">
      Nincsenek lovak
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Név</th>
            <th>Nem</th>
            <th>Születési év</th>
            <th>Eladó</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in horses" :key="horse.id">
            <td>{{ horse.name }}</td>
            <td>{{ horse.gender === "M" ? "♂ Hérosz" : "♀ Kanca" }}</td>
            <td>{{ horse.birth_year }}</td>
            <td>
              <span v-if="horse.is_available_for_sale" class="badge bg-success"
                >Igen</span
              >
              <span v-else class="badge bg-secondary">Nem</span>
            </td>
            <td>
              <router-link
                :to="`/admin/horses/${horse.id}/edit`"
                class="btn btn-sm btn-outline-warning"
              >
                <i class="bi bi-pencil"></i>
              </router-link>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger ms-2"
                @click="handleDelete(horse.id, horse.name)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
```

---

### Phase 4: Views & Routing (30 min)

#### 4.1 Create `src/views/AdminHorseListView.vue`

```vue
<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import HorseForm from "@/components/horses/HorseForm.vue";
import AdminHorseList from "@/components/horses/AdminHorseList.vue";

const route = useRoute();
const router = useRouter();

const mode = computed(() => {
  if (route.path === "/admin/horses/new") return "create";
  if (route.path.includes("/edit")) return "edit";
  return "list";
});

const horseId = computed(() => route.params.id);

function handleFormSubmit() {
  router.push("/admin/horses");
}

function handleFormCancel() {
  router.push("/admin/horses");
}
</script>

<template>
  <main>
    <div class="image-container">
      <div class="overlay"></div>
      <div class="text">Lovak kezelése</div>
    </div>
    <section class="p-5">
      <button
        v-if="mode !== 'list'"
        class="btn btn-outline-secondary mb-4"
        @click="() => router.push('/admin/horses')"
      >
        ← Vissza a listára
      </button>

      <HorseForm
        v-if="mode === 'create'"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />

      <HorseForm
        v-else-if="mode === 'edit'"
        :horse-id="horseId"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />

      <AdminHorseList v-else />
    </section>
  </main>
</template>
```

#### 4.2 Update `src/router/index.js`

Add imports and routes:

```javascript
import AdminHorseListView from '@/views/AdminHorseListView.vue'

// In routes array, replace placeholder:
{
  path: '/admin/horses',
  component: AdminHorseListView,
  meta: { requiresAuth: true }
},
{
  path: '/admin/horses/new',
  component: AdminHorseListView,
  meta: { requiresAuth: true }
},
{
  path: '/admin/horses/:id/edit',
  component: AdminHorseListView,
  meta: { requiresAuth: true }
},
```

---

### Phase 5: Testing & Refinement (30 min)

#### 5.1 Manual Testing Checklist

- [ ] Create horse → all fields save to DB
- [ ] Edit horse → changes persist
- [ ] Upload images → appear in gallery
- [ ] Delete image → removed from Storage + DB
- [ ] Reorder images → display_order updates
- [ ] Delete horse → confirmation → all images deleted
- [ ] Sire/dam dropdown → only horses appear
- [ ] Form validation → errors show correctly
- [ ] Responsive design → works on mobile

#### 5.2 Build & Deploy

```bash
npm run build  # Should complete without errors
```

---

## After Implementation

### Verification Checklist

- [ ] All files created in correct folders
- [ ] No TypeScript, no tests, minimal CSS
- [ ] Folder structure follows CLAUDE.md
- [ ] RLS policies configured in Supabase
- [ ] Storage bucket permissions set
- [ ] README.md updated with "Lovak kezelése"
- [ ] Build passes without errors
- [ ] Git status clean (no uncommitted test artifacts)

---

## Troubleshooting

### "Storage bucket not found"

- Ensure `horse-images` bucket exists in Supabase Storage
- Check bucket permissions (authenticated upload allowed)

### "File upload fails with 403"

- RLS policies may be missing for authenticated users
- Check Storage policies in Supabase Dashboard

### "Sire/dam dropdown empty"

- Verify horses exist in `horses` table
- Check `fetchParentOptions()` query runs

### "Images don't reorder"

- Check `display_order` updates in DB
- Verify `HorseImageGallery` reloads after reorder

---

## Timeline

- **Phase 1 (Services):** ~45 min
- **Phase 2 (Composables):** ~45 min
- **Phase 3 (Components):** ~90 min
- **Phase 4 (Views + Routing):** ~30 min
- **Phase 5 (Testing):** ~30 min
- **Total:** ~3.5–4 hours

---

## Sign-Off

Increment 4 is complete when:
✅ All CRUD operations work  
✅ Images upload/delete correctly  
✅ Form validation works  
✅ RLS protects write access  
✅ Build succeeds  
✅ No test artifacts
