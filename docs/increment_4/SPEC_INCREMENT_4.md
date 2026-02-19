# Increment 4: Lovak Admin Kezelése (Horse CRUD Admin Management) – Specification

**Version:** 1.0  
**Date:** February 2026  
**Priority:** High  
**Estimated Effort:** 3–4 hours  
**Status:** Ready for Implementation  
**Preconditions:** Increment 2 (Auth) + Increment 3 (Horse Display) MUST be complete

---

## 1. Overview

Increment 4 implements the admin interface for managing horses. Authenticated admins can create, read, update, and delete horse records. This includes:

- Horse CRUD operations (Create, Read, Update, Delete)
- Image upload integration with Supabase Storage
- Parent horse (sire/dam) selection dropdowns
- Form validation
- Confirmation dialogs for destructive operations

---

## 2. Feature Description

### 2.1 In Scope

- **Admin Horse List** – Table/list view of all horses with edit/delete actions
- **Create Horse** – Form to add new horse (name, gender, birth_year, sire, dam, is_available_for_sale, description)
- **Update Horse** – Form to edit horse details + image management
- **Delete Horse** – Confirmation dialog + cascade delete of related images
- **Image Upload** – Upload horse images to Supabase Storage (horse-images bucket)
- **Image Gallery Management** – Reorder, delete, or set primary image
- **Form Validation** – Native HTML5 + custom validation for parent selection

### 2.2 Out of Scope (Future)

- Bulk operations (batch edit/delete)
- Image cropping/resizing
- Advanced metadata (microchip, registration number)
- Search/filtering by multiple fields (Increment 5+)

---

## 3. User Stories

### 3.1 Admin Creating a New Horse

**As an** admin  
**I want to** create a new horse record  
**So that** I can add newly acquired or bred horses to the system.

**Acceptance Criteria:**

- Form fields: name, gender (M/F), birth_year, sire_id, dam_id, is_available_for_sale, description
- Sire/dam dropdowns populated with existing horses (optional)
- Submit button creates horse in Supabase
- Success message + redirect to horse detail or list
- Validation: name required, birth_year must be valid year
- Form clears after submit

### 3.2 Admin Editing a Horse

**As an** admin  
**I want to** edit horse details  
**So that** I can update information when circumstances change.

**Acceptance Criteria:**

- Load existing horse data into form
- All fields editable (name, gender, birth_year, sire, dam, description, availability)
- Update button saves changes to Supabase
- Success message + stay on page or redirect
- Image management: add/remove images, reorder, set primary

### 3.3 Admin Deleting a Horse

**As an** admin  
**I want to** delete a horse record  
**So that** I can remove outdated or duplicate entries.

**Acceptance Criteria:**

- Delete button triggers confirmation dialog
- Confirmation shows horse name + warns about cascade delete
- Confirm: deletes horse + all related images from Storage + database
- Error handling: show error if delete fails
- After delete: redirect to horse list

### 3.4 Admin Uploading Horse Images

**As an** admin  
**I want to** upload images for a horse  
**So that** visitors can see what the horse looks like.

**Acceptance Criteria:**

- Image upload input in horse form
- Multiple file selection support
- Progress indicator during upload
- Uploaded images appear in gallery
- Delete individual images
- Reorder images (drag-drop or up/down buttons)
- Show error if upload fails (size, format, etc.)

---

## 4. Data Model

### 4.1 Horses Table (Existing)

```sql
-- Increment 1 created this; Increment 4 extends functionality
CREATE TABLE horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  gender CHAR(1) NOT NULL, -- 'M' or 'F'
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
-- Increment 1 created this; used in Increment 3 + 4
CREATE TABLE horse_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID NOT NULL REFERENCES horses(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, -- URL from Supabase Storage
  alt_text TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.3 Storage Bucket

**Bucket name:** `horse-images`  
**Files:** `{horse_id}/{filename}`  
**Permissions:** Authenticated users can upload; public read (for Increment 3)

---

## 5. API Contract

### 5.1 Create Horse

**Endpoint:** `POST /rest/v1/horses`  
**Auth:** Authenticated (Bearer token from Supabase Auth)  
**Body:**

```json
{
  "name": "Thunder King",
  "gender": "M",
  "birth_year": 2015,
  "sire_id": null,
  "dam_id": null,
  "is_available_for_sale": false,
  "description": "Stallion for breeding"
}
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "name": "Thunder King",
  "gender": "M",
  "birth_year": 2015,
  ...
}
```

### 5.2 Update Horse

**Endpoint:** `PATCH /rest/v1/horses?id=eq.uuid`  
**Auth:** Authenticated  
**Body:** (same fields as Create, all optional)

**Response (200 OK):**

```json
[{ ...horse data }]
```

### 5.3 Delete Horse

**Endpoint:** `DELETE /rest/v1/horses?id=eq.uuid`  
**Auth:** Authenticated  
**Response:** 204 No Content

### 5.4 Upload Image

**Endpoint:** Uses Supabase Storage REST API  
**Path:** `storage/v1/object/horse-images/{horse_id}/{filename}`  
**Method:** POST (multipart form data)  
**Auth:** Authenticated

### 5.5 Get Horse for Editing

**Endpoint:** `GET /rest/v1/horses?id=eq.uuid&select=*,images:horse_images(*)`  
**Auth:** Authenticated  
**Response:** Single horse with images array

---

## 6. Component Architecture

### 6.1 Folder Structure

```
src/
├── services/
│   ├── horseService.js            (existing - extend for CRUD)
│   └── horseImageService.js        (NEW - image upload/delete)
├── composables/
│   ├── useHorses.js               (existing - extend with mutations)
│   └── useHorseForm.js             (NEW - form state + validation)
├── components/
│   └── horses/
│       ├── HorseCard.vue          (existing - list view)
│       ├── HorseFilter.vue        (existing)
│       ├── HorseGallery.vue       (existing - for detail view)
│       ├── AdminHorseList.vue     (NEW - admin list with actions)
│       ├── HorseForm.vue          (NEW - reusable form)
│       ├── HorseImageUpload.vue   (NEW - image upload)
│       └── HorseImageGallery.vue  (NEW - edit gallery with reorder)
└── views/
    └── AdminHorseListView.vue     (NEW - admin page at /admin/horses)
```

### 6.2 Component Responsibilities

#### `src/services/horseService.js` (Extended)

**New functions:**

- `createHorse(horseData)` → CREATE
- `updateHorse(id, horseData)` → UPDATE
- `deleteHorse(id)` → DELETE
- `fetchHorseForEdit(id)` → GET (with images)
- `fetchParentOptions()` → Returns all horses for sire/dam dropdown

#### `src/services/horseImageService.js` (NEW)

- `uploadImage(horseId, file)` → Upload to Storage + insert row
- `deleteImage(imageId, imageUrl)` → Delete from Storage + database
- `updateImageOrder(imageId, displayOrder)` → Reorder images
- `updateImageAltText(imageId, altText)` → Update metadata

#### `src/composables/useHorseForm.js` (NEW)

- Form state: `name`, `gender`, `birth_year`, `sire_id`, `dam_id`, `is_available_for_sale`, `description`
- Methods: `validateForm()`, `resetForm()`, `loadHorse(id)`, `submitForm()`
- Error state + loading state

#### `src/composables/useHorses.js` (Extended)

- Add methods: `createHorse()`, `updateHorse()`, `deleteHorse()`
- Keep existing: `loadHorses()`, `loadHorseById()`, `setFilterStatus()`

#### `src/components/horses/AdminHorseList.vue` (NEW)

- Table of all horses
- Columns: name, gender, birth_year, availability, actions (edit/delete)
- Edit button → navigate to edit form
- Delete button → confirmation → delete

#### `src/components/horses/HorseForm.vue` (NEW)

- Form inputs: name, gender, birth_year, sire dropdown, dam dropdown, description, availability checkbox
- Image upload section (via child component)
- Submit + Cancel buttons
- Form validation errors

#### `src/components/horses/HorseImageUpload.vue` (NEW)

- File input (accept images)
- Drag-drop zone
- Progress bar
- Add/remove uploaded files before submit
- Error messages for invalid files

#### `src/components/horses/HorseImageGallery.vue` (NEW)

- Display existing images
- Reorder buttons (up/down)
- Delete button per image
- Alt text editor

#### `src/views/AdminHorseListView.vue` (NEW)

- Container for admin horse management
- Routes:
  - `/admin/horses` → list view
  - `/admin/horses/new` → create form
  - `/admin/horses/:id/edit` → edit form

---

## 7. Implementation Details

### 7.1 Routing Updates

**Add to `src/router/index.js`:**

```javascript
import AdminHorseListView from "@/views/AdminHorseListView.vue";

const routes = [
  // ... existing routes ...
  {
    path: "/admin/horses",
    component: AdminHorseListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/horses/new",
    component: AdminHorseListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/horses/:id/edit",
    component: AdminHorseListView,
    meta: { requiresAuth: true },
  },
];
```

Alternative: Use single view with mode prop instead of separate routes.

### 7.2 RLS Policies (Supabase)

**Horses Table:**

```sql
-- Public read
CREATE POLICY "Horses are viewable by anyone"
ON horses FOR SELECT USING (true);

-- Authenticated admin write
CREATE POLICY "Authenticated users can insert/update/delete horses"
ON horses FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
```

**Horse Images Table:**

```sql
-- Public read
CREATE POLICY "Horse images are viewable by anyone"
ON horse_images FOR SELECT USING (true);

-- Authenticated user can manage images
CREATE POLICY "Authenticated users can manage horse images"
ON horse_images FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
```

**Storage Bucket (horse-images):**

```sql
-- Public read
CREATE POLICY "Anyone can view horse images"
ON storage.objects FOR SELECT USING (bucket_id = 'horse-images');

-- Authenticated upload
CREATE POLICY "Authenticated users can upload horse images"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'horse-images' AND auth.role() = 'authenticated');

-- Authenticated delete own
CREATE POLICY "Authenticated users can delete horse images"
ON storage.objects FOR DELETE USING (bucket_id = 'horse-images' AND auth.role() = 'authenticated');
```

### 7.3 Form Validation

**Native HTML5:**

- `<input type="text" required>` for name
- `<input type="number" min="1800" max={current_year}>` for birth_year
- `<select required>` for gender

**Custom JS:**

- Sire/dam must be different horses (prevent self-parenting)
- Birth year cannot be in future
- At least one image recommended (not required) for public display

**Error Messages:**

- Display below each field
- Clear on field change
- Submit disabled while validating

### 7.4 Image Upload Flow

1. User selects file(s) in `HorseImageUpload` component
2. Validate: file size < 5MB, format is image (jpg/png/webp)
3. Show pending state in gallery before actual upload
4. On form submit:
   - Create horse first (if new)
   - Upload images to Storage
   - Insert image_url into horse_images table
5. Handle errors gracefully

**File naming:** `{horse_id}/{timestamp}-{filename}`

### 7.5 Delete Flow

1. User clicks delete button on horse
2. Modal confirmation: "Töröl {horse_name}? Ez a megoldás az összes képét is törli."
3. On confirm:
   - Fetch all related images
   - Delete images from Storage
   - Delete horse_images rows
   - Delete horse row (cascade handles remaining)
4. Redirect to horse list
5. Show success toast/message

---

## 8. UI/UX Requirements

### 8.1 Layout

**Admin Horse List Page:**

- Heading: "Lovak kezelése"
- "Új ló" button
- Responsive table/grid of horses
- Edit/delete buttons per row
- Empty state: "Nincsenek lovak" (shouldn't happen in practice)

**Horse Form Page:**

- Heading: "Új ló" or "Ló szerkesztése: {name}"
- Two-column layout:
  - Left: Form fields
  - Right: Image upload + gallery preview
- Submit + Cancel buttons
- Form validation errors

**Image Upload:**

- Drag-drop zone
- File input
- Progress bar during upload
- Gallery preview

### 8.2 Styling (Bootstrap)

- Use `form-control`, `form-check` for inputs
- `btn-primary` for submit, `btn-outline-secondary` for cancel
- `btn-warning` for edit, `btn-danger` for delete
- `alert-danger` for errors
- `spinner-border` for loading states

### 8.3 Responsive Design

- Desktop: Form 2 columns (form + images)
- Tablet: Stack columns, full width
- Mobile: Single column, images below form

---

## 9. Testing Checklist

### 9.1 Create Horse

- [ ] Form loads empty
- [ ] Submit with name only → error (gender required)
- [ ] Submit valid form → horse created in DB
- [ ] Sire/dam dropdown shows all horses
- [ ] Selected sire appears in horse detail
- [ ] Images upload correctly
- [ ] Redirect to list after create

### 9.2 Update Horse

- [ ] Load horse → form populated
- [ ] Edit name → save → verify change
- [ ] Add/remove sire → save → verify
- [ ] Upload new image → appears in gallery
- [ ] Delete image → removed from gallery + Storage
- [ ] Reorder images → order persists

### 9.3 Delete Horse

- [ ] Delete button → confirmation modal
- [ ] Cancel → nothing happens
- [ ] Confirm delete → removed from list
- [ ] Images deleted from Storage
- [ ] Detail page 404 after delete

### 9.4 Form Validation

- [ ] Birth year > current year → error
- [ ] Name empty → error
- [ ] Gender not selected → error
- [ ] Sire = dam → warning or error
- [ ] File > 5MB → upload error
- [ ] Invalid file type → error

### 9.5 Error Handling

- [ ] Network error → "Hiba történt..." message + retry
- [ ] Auth token expired → redirect to login
- [ ] Permission denied → error message
- [ ] Concurrent edits → last one wins (Supabase default)

---

## 10. Acceptance Criteria (Summary)

✅ **MUST Have:**

1. Admin can create new horse with name, gender, birth_year
2. Admin can edit horse details
3. Admin can delete horse with confirmation
4. Sire/dam dropdown populated from existing horses
5. Images can be uploaded to Supabase Storage
6. Form validation prevents invalid submissions
7. RLS policies restrict write access to authenticated admins
8. Responsive design works on mobile/tablet/desktop

✅ **SHOULD Have:**

1. Multiple image upload support
2. Image reordering (display_order)
3. Alt text for images
4. Loading spinners during operations
5. Success/error toast notifications

~ **Nice to Have:**

1. Image optimization (resize, thumbnail)
2. Drag-drop image reordering
3. Undo functionality
4. Batch operations (delete multiple)
5. Soft delete (archive) instead of hard delete

---

## 11. File Summary

### New Files:

- `src/services/horseImageService.js`
- `src/composables/useHorseForm.js`
- `src/components/horses/AdminHorseList.vue`
- `src/components/horses/HorseForm.vue`
- `src/components/horses/HorseImageUpload.vue`
- `src/components/horses/HorseImageGallery.vue`
- `src/views/AdminHorseListView.vue`

### Refactored Files:

- `src/services/horseService.js` (add CRUD functions)
- `src/composables/useHorses.js` (add CRUD hooks)
- `src/router/index.js` (add admin routes)

### Modified Files:

- `README.md` (update feature list)

---

## 12. Timeline & Effort

**Estimated Breakdown:**

- Service layer (CRUD + image upload): 45 min
- Composables (form state + validation): 45 min
- Components (form + upload + gallery): 90 min
- Views + Routing + Integration: 30 min
- Testing + Refinement: 30 min
- **Total: ~3.5–4 hours**

---

## 13. Go/No-Go Check

Before starting Increment 4:

- ✅ Increment 2 (Auth) complete + working
- ✅ Increment 3 (Horse Display) complete + working
- ✅ Supabase RLS policies configured for auth users
- ✅ Storage bucket `horse-images` created + permissions set
- ✅ Sample horses in DB for sire/dam dropdown testing

---

## 14. Sign-Off Criteria

Increment 4 is **complete** when:

✅ Admin horse list displays all horses  
✅ Create horse form works + validates  
✅ Update horse form works + saves changes  
✅ Delete horse works with confirmation  
✅ Image upload + delete + reorder works  
✅ Sire/dam dropdown populated  
✅ Responsive design on mobile/tablet/desktop  
✅ RLS protects write operations  
✅ No TypeScript / no tests / minimal CSS  
✅ README.md updated  
✅ Code compiles without errors

**Ready to merge when:** All above ✅ + QA testing passed.
