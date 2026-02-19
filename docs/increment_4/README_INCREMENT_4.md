# Increment 4: Lovak Admin Kezelése (Horse CRUD Admin Management) – Overview

**Status:** ✅ Ready for Implementation  
**Effort:** ~3.5–4 hours  
**Priority:** HIGH  
**Preconditions:** Increment 2 (Auth) + Increment 3 (Horse Display) complete

---

## What Gets Built

Admin users can manage horse records with full CRUD (Create, Read, Update, Delete) functionality:

- **Create** new horse records (name, gender, birth year, parentage, description)
- **Read** horse list with edit/delete actions
- **Update** horse details and manage images
- **Delete** horses with cascade deletion of images
- **Image Management** – upload, delete, reorder images in Supabase Storage

---

## Feature Highlights

✅ **Admin Horse List** – Table view with edit/delete buttons  
✅ **Create Horse Form** – Full form with validation  
✅ **Edit Horse Form** – Edit existing horse data  
✅ **Delete with Confirmation** – Safe deletion with warning  
✅ **Image Upload** – Multiple files to Supabase Storage  
✅ **Image Gallery** – View, delete, reorder images  
✅ **Sire/Dam Dropdown** – Select parent horses for pedigree  
✅ **Form Validation** – Name required, year validation, parent checks  
✅ **RLS Protected** – Only authenticated admins can write

---

## Architecture Summary

### New Files Created:

```
src/services/
  └─ horseImageService.js         (Image upload/delete logic)

src/composables/
  └─ useHorseForm.js              (Form state + validation)

src/components/horses/
  ├─ AdminHorseList.vue           (Admin list table)
  ├─ HorseForm.vue                (Create/edit form)
  ├─ HorseImageUpload.vue         (Upload interface)
  └─ HorseImageGallery.vue        (Gallery with reorder)

src/views/
  └─ AdminHorseListView.vue       (Main admin page)
```

### Extended Files:

```
src/services/horseService.js       (Add CRUD: create, update, delete)
src/composables/useHorses.js       (Add deleteHorse method)
src/router/index.js                (Add 3 admin routes)
README.md                          (Update features)
```

---

## Data Model

**No new tables needed.** Uses existing:

- `horses` – name, gender, birth_year, sire_id, dam_id, is_available_for_sale, description
- `horse_images` – image_url, alt_text, display_order, horse_id

**Storage:** `horse-images` bucket (must already exist from Increment 1)

---

## Key Routes

| Route                    | Purpose           | Mode                |
| ------------------------ | ----------------- | ------------------- |
| `/admin/horses`          | List all horses   | Read-only + actions |
| `/admin/horses/new`      | Create horse form | Create              |
| `/admin/horses/:id/edit` | Edit horse form   | Update              |

---

## User Workflows

### Admin Creating a Horse

1. Navigate to `/admin/horses`
2. Click "Új ló"
3. Fill form (name, gender, birth year, optional: sire, dam, description)
4. Upload images (optional)
5. Click "Létrehozás"
6. Redirect to horse list
7. New horse appears in list

### Admin Editing a Horse

1. Visit `/admin/horses`
2. Click edit button next to horse
3. Form loads with horse data
4. Modify fields
5. Upload additional images
6. Reorder or delete existing images
7. Click "Frissítés"
8. Changes persisted to DB

### Admin Deleting a Horse

1. Visit `/admin/horses`
2. Click delete button (trash icon)
3. Confirmation dialog: "Biztosan törlöd?"
4. Confirm
5. Horse + all images deleted
6. List refreshes

---

## Technology Stack

- **Frontend:** Vue 3 (Composition API)
- **Form State:** `useHorseForm` composable
- **File Upload:** Supabase Storage REST API
- **Validation:** Native HTML5 + custom JS
- **Styling:** Bootstrap 5
- **Database:** Supabase PostgreSQL + Row Level Security

**No new dependencies needed.**

---

## Key Implementation Details

### RLS Policies Required

Both `horses` and `horse_images` tables need:

- **Public READ** – visitors can see data
- **Authenticated WRITE** – only logged-in users can create/update/delete

### Storage Bucket

`horse-images` bucket needs:

- **Public READ** – CDN delivery
- **Authenticated UPLOAD** – only admins can upload
- **Authenticated DELETE** – only admins can delete

### Form Validation

- **Name:** Required, min 1 char
- **Gender:** Required (M/F)
- **Birth Year:** Optional, must be ≤ current year
- **Sire/Dam:** Must be different horses
- **Images:** Max 5MB per file, JPG/PNG/WebP only

---

## Preconditions

✅ Increment 2 (Auth/Login) **MUST** be complete  
✅ Increment 3 (Horse Display) **MUST** be complete  
✅ `horses` + `horse_images` tables exist (Increment 1)  
✅ `horse-images` Storage bucket exists  
✅ RLS policies configured for auth users  
✅ At least 3 sample horses in DB (for sire/dam testing)

---

## Files in This Directory

### SPEC_INCREMENT_4.md

- Detailed functional specification
- 3 user stories with acceptance criteria
- Data model + API contracts
- Component architecture + responsibilities
- RLS policies + database queries
- Testing checklist
- 14 detailed sections

### IMPLEMENTATION_GUIDE.md

- Phase-by-phase code implementation
- Complete working code for each file
- Rationale for design decisions
- Manual testing steps
- Troubleshooting section
- Timeline breakdown

### README_INCREMENT_4.md (this file)

- Quick reference
- Architecture overview
- Key workflows
- Preconditions

---

## Success Criteria

✅ Admin can create horse with form validation  
✅ Admin can edit horse details + manage images  
✅ Admin can delete horse with confirmation  
✅ Images upload to Supabase Storage  
✅ Sire/dam dropdown populated  
✅ Responsive on mobile/tablet/desktop  
✅ RLS prevents unauthorized write access  
✅ No TypeScript / no tests / minimal CSS  
✅ Folder structure matches CLAUDE.md  
✅ README.md updated with new features  
✅ Build compiles without errors

---

## Next Steps

1. **Review** SPEC_INCREMENT_4.md for detailed requirements
2. **Check** preconditions (RLS policies, Storage bucket)
3. **Code** using IMPLEMENTATION_GUIDE.md as checklist
4. **Test** create/edit/delete workflows
5. **Deploy** and verify production behavior

---

## Quick Links

- **📋 Full Spec:** [SPEC_INCREMENT_4.md](SPEC_INCREMENT_4.md)
- **💻 Code Guide:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
- **📊 Backlog:** [../BACKLOG.md](../BACKLOG.md)

---

## FAQ

**Q: Do I need new dependencies?**  
A: No. Uses existing `@supabase/supabase-js` for file upload.

**Q: Can non-admins upload images?**  
A: No. RLS policies restrict uploads to authenticated users, and front-end auth check ensures only admins see admin pages.

**Q: What happens if image upload fails midway?**  
A: User sees error message. Partial files rolled back. Horse still created (images are optional).

**Q: Can I limit file size?**  
A: Yes. Browser-side validation (5MB) + Supabase Storage quotas apply.

**Q: How do I deploy this?**  
A: Same as Increments 1–3. `npm run build` then deploy dist/ folder.

---

**Ready to implement? Start with IMPLEMENTATION_GUIDE.md Phase 1.**
