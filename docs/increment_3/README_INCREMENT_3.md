# Increment 3: Lovak Megjelenítése (Horse Display) – Overview

**Status:** ✅ Ready for Implementation  
**Effort:** ~3 hours  
**Priority:** HIGH

---

## What Gets Built

Visitors can browse all horses in the club's stable from a single page, filter them by sale status, and view detailed information about each horse including:

- Name, sex, birth year
- Images/gallery
- Pedigree (sire/dam relationships)
- Availability for sale

---

## Feature Highlights

✅ **Horse List** – Responsive grid of all horses  
✅ **Filtering** – Filter by "Eladó" / "Nem eladó" / "Összes"  
✅ **Horse Detail** – Individual page per horse with full info + images  
✅ **Pedigree** – Show parent relationships (sire/dam)  
✅ **Image Gallery** – Simple carousel for multiple images  
✅ **Empty State** – Friendly message when no horses exist

---

## Architecture Summary

### New Files Created:

```
src/services/
  └─ horseService.js         (Supabase queries)

src/composables/
  └─ useHorses.js             (Business logic + state)

src/components/horses/
  ├─ HorseCard.vue           (Card component)
  ├─ HorseFilter.vue         (Filter buttons)
  └─ HorseGallery.vue        (Image carousel)

src/views/
  └─ HorseDetailView.vue     (Detail page)
```

### Refactored:

```
src/components/
  └─ HorsesPage.vue          (Now uses composable)

src/router/
  └─ index.js                (Add detail route)
```

---

## Data Model

**Required Tables** (must exist from Increment 1):

- `horses` – name, sex, birth_year, sire_id, dam_id, is_available_for_sale, description
- `horse_images` – image_url, alt_text, display_order, horse_id

**No new tables needed.**

---

## User Workflows

### Visitor Browsing Horses

1. Navigate to `/horses`
2. See all horses in responsive grid
3. Optionally filter by status (available / unavailable)
4. Click a horse → detail page `/horses/{id}`
5. View full info + images + parent links
6. Click sire/dam link → view their detail page

### Empty Database

1. Navigate to `/horses`
2. See message: "Nincs ló az adatbázisban"

---

## Technology Stack

- **Frontend:** Vue 3 (Composition API)
- **State Management:** useHorses composable (no Pinia yet)
- **Styling:** Bootstrap 5 utility classes + minimal CSS
- **Backend:** Supabase (queries via horseService.js)
- **Routing:** Vue Router

**No new dependencies needed.**

---

## Key Design Decisions

1. **Composable over Pinia** – For this feature, a simple composable is sufficient and lighter.
2. **Client-side filtering** – Assume <1000 horses; filter in memory (add pagination if needed later).
3. **Simple carousel** – No dependency on 3rd-party carousel library; hand-rolled with prev/next buttons.
4. **Bootstrap grid** – Responsive layout (4 cols desktop → 1 col mobile).
5. **Separate detail route** – `/horses/:id` as a full page, not a modal (better for deep linking + bookmarking).

---

## Preconditions

✅ Increment 1 (DB + tables + sample data) **MUST** be complete  
✅ Increment 2 (Auth layer) **MUST** be complete  
✅ Supabase JS client configured in `src/services/supabase.js`  
✅ Vue Router working + Bootstrap styles loaded

---

## Files in This Directory

### SPEC_INCREMENT_3.md

- Detailed functional specification
- User stories + acceptance criteria
- Data model + API contracts
- Component architecture
- Testing checklist
- Acceptance criteria

### IMPLEMENTATION_GUIDE.md

- Step-by-step code implementation (5 phases)
- Complete code examples for each file
- Testing checklist + troubleshooting
- Timeline breakdown
- Post-implementation verification

### README_INCREMENT_3.md (this file)

- High-level overview
- Quick reference
- Architecture summary
- Key decisions

---

## Quick Links

- **📋 Full Spec:** [SPEC_INCREMENT_3.md](SPEC_INCREMENT_3.md)
- **💻 Code Guide:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)

---

## Next Steps

1. **Review** SPEC_INCREMENT_3.md for detailed requirements
2. **Code** using IMPLEMENTATION_GUIDE.md as checklist
3. **Test** against acceptance criteria
4. **Merge** → Creates foundation for Increment 4 (Horse CRUD admin features)

---

## Timeline

- **Planning/Review:** 30 min
- **Development:** ~2.5 hours
- **Testing/Refinement:** 30 min
- **Total:** ~3 hours

---

## Success Criteria

✅ All horses display dynamically from Supabase  
✅ Filter by availability works  
✅ Detail page shows sire/dam relationships  
✅ Responsive on mobile/tablet/desktop  
✅ "Nincs ló" message when DB empty  
✅ No test files / no TypeScript / no extra CSS  
✅ Folder structure matches CLAUDE.md guidelines  
✅ README.md updated with new features

---

## Questions Before Starting?

Refer to SPEC_INCREMENT_3.md section 2-4 for clarifications on:

- Feature scope
- User stories
- Data model assumptions
- Component API contracts

If any design decision is unclear, reference the IMPLEMENTATION_GUIDE.md rationale sections.

---

**Ready to build? Start with IMPLEMENTATION_GUIDE.md Phase 1.**
