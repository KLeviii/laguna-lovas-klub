# Dokumentáció – Increment 5: Webshop Termékek Megjelenítése

## 📚 Dokumentumok Áttekintése

Ez a mappa az 5. iteráció (Increment 5) teljes dokumentációját tartalmazza.

### Fájlok:

1. **`SPEC_INCREMENT_5.md`** ⭐
   - Teljes specifikáció
   - Funkcionális és nem-funkcionális követelmények
   - User stories elfogadási kritériumokkal
   - Adatbázis séma és API szerződések
   - Definition of Done
   - ~450 sorok

2. **`IMPLEMENTATION_GUIDE.md`** ✨
   - Lépésenkénti implementációs utasítások
   - Kódrészletek az összes szükséges fájlhoz
   - Tesztelési checklist
   - Hibaelhárítási útmutató
   - ~400 sorok

3. **`README_INCREMENT_5.md`** 📖
   - Rövid áttekintés és célkitűzések
   - Funkciók listája
   - Mit fog létrejönni (komponensek, composables, services)
   - Adatmodell összefoglalása
   - Implementációs checklist
   - ~150 sorok

---

## 🎯 Mi ez az iteráció?

**Increment 5** implementálja a **nyilvános webshop terméklistázást**.

### Felhasználók képesek lesznek:
- ✅ Összes termék megtekintése kategóriák szerint
- ✅ Termékek szűrése kategória alapján
- ✅ Termék részletei: név, ár (HUF), leírás, képek
- ✅ Elérhetőség státusz megtekintése (Elérhető / Nem elérhető)

### Technológia:
- Vue 3 Composition API
- Supabase (termék- és kategóriatáblák)
- Bootstrap responsive grid
- Pinia state management (composable)

---

## 🚀 Gyorsstart

### Haladási Sorrend:

1. **Szpecifikáció megismerés** → `SPEC_INCREMENT_5.md` olvasása
2. **Implementáció** → `IMPLEMENTATION_GUIDE.md` követése
3. **Referencia** → `README_INCREMENT_5.md` gyorsreferencia

### Előfeltételek:

✅ **Increment 1** kész (adatbázis): `product_categories`, `products` táblák  
✅ **Increment 2** kész (auth): Supabase client (`src/lib/supabase.js`)

---

## 📋 Főbb Funkciók

### 1. Terméklistázás
- Összes termék megjelenítése grid sorrendben
- Adatok Supabase-ből betöltve
- Responsive: 1–4 oszlop (mobil → asztali)

### 2. Kategória szűrés
- Kategóriagombok: "Összes" + egyedi kategóriák
- Azonnali szűrés (kliens oldali)
- Aktív állapot jelzése

### 3. Termék kártyák
- Kép, név, leírás, ár (HUF formátum)
- Kategória jelvény
- Elérhetőség jelvény (zöld/szürke)

### 4. Állapotkezelés
- Betöltési spinner
- Hibaüzenet Supabase hiba esetén
- Üres státusz: nincs termék az adatbázisban
- Üres státusz: a kategóriára nincs termék

---

## 🏗️ Architektúra

### Létrehozandó Fájlok:

```
src/
├── components/webshop/
│   ├── ProductCard.vue          # Termék kártya komponens
│   └── ProductFilter.vue        # Kategória szűrő komponens
├── composables/
│   └── useProducts.js           # Termékeket állapot composable
├── services/
│   └── productService.js        # Supabase adatbázis réteg
└── views/
    └── WebshopView.vue          # Fő webshop oldal
```

### Módosítandó Fájlok:

```
src/
├── router/index.js              # /webshop útvonal hozzáadása
└── components/Header.vue        # Webshop link biztosítása
```

---

## 📊 Adatbázis

### `product_categories` Tábla
```sql
id UUID PRIMARY KEY
name TEXT UNIQUE  -- "Takarmányok", "Vitamin & Kiegészítők", etc.
description TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### `products` Tábla
```sql
id UUID PRIMARY KEY
category_id UUID REFERENCES product_categories(id)
name TEXT NOT NULL
price DECIMAL(10, 2)           -- HUF
description TEXT
is_available BOOLEAN DEFAULT TRUE
image_url TEXT                 -- Supabase Storage URL
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

## 🔌 API Szerződések

### Összes Termék Lekérése
```
GET /rest/v1/products
Headers:
  apikey: VITE_SUPABASE_ANON_KEY
Response: Array of product objects
```

### Összes Kategória Lekérése
```
GET /rest/v1/product_categories
Headers:
  apikey: VITE_SUPABASE_ANON_KEY
Response: Array of category objects
```

---

## ✅ Tesztelési Forgatókönyvek

### Forgatókönyv 1: Normál Folyamat
1. Navigálj `/webshop`-ra
2. Termékek betöltödnek az adatbázisból
3. Kategóriaszűrő látható
4. Válassz kategóriát → lista frissül
5. Kattints "Összes"-re → összes termék jelenik meg

### Forgatókönyv 2: Üres Adatbázis
1. Adatbázisban nincs termék
2. Oldal megjeleníti: "Nincs termék az adatbázisban."

### Forgatókönyv 3: Üres Kategória
1. Válassz egy kategóriát, amely nem tartalmaz termékeket
2. Oldal megjeleníti: "Erre a kategóriára nincs termék."

### Forgatókönyv 4: Hálózati Hiba
1. Supabase nem elérhető
2. Hibaüzenet: "Hiba történt az adatbetöltés közben..."

---

## 🛠️ Implementációs Lépések

1. **Szerviz létrehozása** – `productService.js`
2. **Composable létrehozása** – `useProducts.js`
3. **Komponensek** – `ProductCard.vue`, `ProductFilter.vue`
4. **Oldal nézet** – `WebshopView.vue`
5. **Routing** – `/webshop` útvonal hozzáadása
6. **Navigáció** – Webshop link a fejlécben
7. **Tesztelés** – Összes forgatókönyv ellenőrzése

---

## 📈 Becsült Erőforrás

- **Becsült Idő:** 2–3 óra
- **Prioritás:** Közepes
- **Komplexitás:** Alacsony–Közepes

---

## 🔗 Kapcsolódó Dokumentumok

- `docs/PROJECT_VISION.md` – Projekt áttekintés
- `docs/DATABASE_SCHEMA.md` – Adatbázis séma
- `docs/API_ENDPOINTS.md` – API végpontok

---

## ⚙️ Előfeltételek Ellenőrzése

Implementáció előtt:

- [ ] `product_categories` tábla létezik Supabase-ben
- [ ] `products` tábla létezik Supabase-ben
- [ ] Minta adatok vannak mindkét táblában
- [ ] `src/lib/supabase.js` megfelelően inicializálva
- [ ] `.env` fájl tartalmazza `VITE_SUPABASE_URL` és `VITE_SUPABASE_ANON_KEY`
- [ ] "Increment 1 kész" jelölés alatt van

---

## 📝 Megjegyzések

- **Szabadon felhasználható:** Termék kártyák újrahasznosíthatók az admin nézetben (Increment 6)
- **Szűrés:** Kliens oldali szűrés = azonnali válaszidő
- **Képek:** Fallback placeholder ha nincs kép
- **Formázás:** HUF árak `Intl.NumberFormat` API-val
- **Felelősség:** Olvasás nyilvános; admin írási műveletek később

---

## 🎓 Következő Lépések

**Increment 6** után így fog kinézni:
- Admin termékek hozzáadása
- Termékek szerkesztése
- Termékek törlése
- Képfeltöltés

Az `Increment 5` `ProductCard` komponens újra felhasználható lesz az admin listában.

---

## 📞 Segítség & Referencia

Kérdések?

- **Specifikáció Details:** → `SPEC_INCREMENT_5.md`
- **Kódpéldák:** → `IMPLEMENTATION_GUIDE.md`
- **Gyors Referencia:** → `README_INCREMENT_5.md`

Boldog kódolást! 🚀
