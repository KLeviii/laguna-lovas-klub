# REST API Végpontok Specifikáció

## Supabase REST API Általános Információk

**Base URL:** `https://[project-id].supabase.co/rest/v1/`

**Autentikáció:** 
- Public read: `apikey` header
- Admin write: `apikey` + `Authorization: Bearer [user_jwt]`

---

## 1. LOVAK (`/horses`)

### GET /horses
- **Mit csinál:** Összes ló lekérése
- **Query paraméterek:**
  - `is_for_sale=eq.true` - Csak eladó lovak
  - `select=*,father:horses!father_id(*),mother:horses!mother_id(*)` - Származás lekérése
  - `order=name.asc` - Rendezés név szerint

### GET /horses?id=eq.[uuid]
- **Mit csinál:** Egy konkrét ló lekérése ID alapján
- **Válasz:** Ló részletes adatai + származás

### POST /horses
- **Mit csinál:** Új ló létrehozása
- **Auth:** ✅ Admin
- **Body:** horse objektum (name, gender, stb.)

### PATCH /horses?id=eq.[uuid]
- **Mit csinál:** Ló adatainak módosítása
- **Auth:** ✅ Admin
- **Body:** módosítandó mezők

### DELETE /horses?id=eq.[uuid]
- **Mit csinál:** Ló törlése
- **Auth:** ✅ Admin

---

## 2. LÓ KÉPEK (`/horse_images`)

### GET /horse_images?horse_id=eq.[uuid]
- **Mit csinál:** Egy ló összes képének lekérése
- **Query:** `order=display_order.asc`

### POST /horse_images
- **Mit csinál:** Új kép hozzáadása lóhoz
- **Auth:** ✅ Admin
- **Body:** horse_id, image_url, caption, display_order

### DELETE /horse_images?id=eq.[uuid]
- **Mit csinál:** Kép törlése
- **Auth:** ✅ Admin

---

## 3. TERMÉK KATEGÓRIÁK (`/product_categories`)

### GET /product_categories
- **Mit csinál:** Összes kategória lekérése
- **Query:** `order=display_order.asc`

### POST /product_categories
- **Mit csinál:** Új kategória létrehozása
- **Auth:** ✅ Admin

---

## 4. TERMÉKEK (`/products`)

### GET /products
- **Mit csinál:** Összes termék lekérése
- **Query paraméterek:**
  - `category_id=eq.[uuid]` - Kategória szerinti szűrés
  - `is_available=eq.true` - Csak elérhető termékek
  - `select=*,category:product_categories(*)` - Kategória adatokkal együtt

### GET /products?id=eq.[uuid]
- **Mit csinál:** Egy termék részletes adatai

### POST /products
- **Mit csinál:** Új termék létrehozása
- **Auth:** ✅ Admin

### PATCH /products?id=eq.[uuid]
- **Mit csinál:** Termék módosítása
- **Auth:** ✅ Admin

### DELETE /products?id=eq.[uuid]
- **Mit csinál:** Termék törlése
- **Auth:** ✅ Admin

---

## 5. VERSENYEK (`/competitions`)

### GET /competitions
- **Mit csinál:** Versenyek lekérése
- **Query:** `order=start_date.desc` - Legfrissebb elől

### GET /competitions?id=eq.[uuid]
- **Mit csinál:** Egy verseny részletes adatai

### POST /competitions
- **Mit csinál:** Új verseny létrehozása
- **Auth:** ✅ Admin

### PATCH /competitions?id=eq.[uuid]
- **Mit csinál:** Verseny módosítása
- **Auth:** ✅ Admin

---

## 6. VERSENYEREDMÉNYEK (`/competition_results`)

### GET /competition_results
- **Mit csinál:** Eredmények lekérése
- **Query paraméterek:**
  - `competition_id=eq.[uuid]` - Egy verseny eredményei
  - `horse_id=eq.[uuid]` - Egy ló eredményei
  - `select=*,competition:competitions(*),horse:horses(*)` - Kapcsolódó adatokkal

### POST /competition_results
- **Mit csinál:** Új eredmény rögzítése
- **Auth:** ✅ Admin
- **Body:** competition_id, horse_id, rider_name, discipline, placement, achievement

### PATCH /competition_results?id=eq.[uuid]
- **Mit csinál:** Eredmény módosítása
- **Auth:** ✅ Admin

### DELETE /competition_results?id=eq.[uuid]
- **Mit csinál:** Eredmény törlése
- **Auth:** ✅ Admin

---

## 7. KAPCSOLATFELVÉTEL (`/contact_submissions`)

### GET /contact_submissions
- **Mit csinál:** Beküldött űrlapok lekérése
- **Auth:** ✅ Admin
- **Query:** `order=created_at.desc`

### POST /contact_submissions
- **Mit csinál:** Új üzenet beküldése
- **Auth:** ❌ Publikus
- **Body:** name, email, phone, message

### PATCH /contact_submissions?id=eq.[uuid]
- **Mit csinál:** Üzenet olvasottá jelölése
- **Auth:** ✅ Admin
- **Body:** `{ "is_read": true }`

---

## 8. AUTENTIKÁCIÓ

Supabase Auth API használata (NEM REST API):

### POST /auth/v1/signup
- **Mit csinál:** Admin regisztráció
- **Body:** email, password, metadata

### POST /auth/v1/token?grant_type=password
- **Mit csinál:** Bejelentkezés
- **Body:** email, password
- **Válasz:** access_token (JWT)

### POST /auth/v1/logout
- **Mit csinál:** Kijelentkezés
- **Headers:** Authorization: Bearer [token]

---

## 9. STORAGE (Képfeltöltés)

### POST /storage/v1/object/[bucket-name]/[file-path]
- **Mit csinál:** Kép feltöltése
- **Auth:** ✅ Admin
- **Body:** File (multipart/form-data)
- **Válasz:** Publikus URL

### DELETE /storage/v1/object/[bucket-name]/[file-path]
- **Mit csinál:** Kép törlése
- **Auth:** ✅ Admin

### GET /storage/v1/object/public/[bucket-name]/[file-path]
- **Mit csinál:** Publikus kép URL
- **Auth:** ❌ Nincs

---

## Általános API Konvenciók

### Szűrés
```
GET /horses?gender=eq.male
GET /products?price=gte.5000&price=lte.10000
```

### Rendezés
```
GET /competitions?order=start_date.desc
GET /horses?order=name.asc
```

### Kapcsolódó adatok (JOIN)
```
GET /competition_results?select=*,horse:horses(name,gender),competition:competitions(name,start_date)
```

### Lapozás
```
GET /horses?limit=10&offset=0
GET /horses?limit=10&offset=10
```

### Keresés (Full-text)
```
GET /horses?name=ilike.*cooper*
```
