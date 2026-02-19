# Tesztelési Útmutató – Increment 5: Webshop Termékek Megjelenítése

**Dokumentum dátuma:** 2026. február 19.

---

## Áttekintés

Ez az útmutató lépésenkénti tesztelési forgatókönyveket tartalmaz az Increment 5 (Webshop terméklistázás) validálásához.

## Előfeltételek

- ✅ Vue.js alkalmazás futó állapotban
- ✅ Supabase projekt konfigurálva és elérhető
- ✅ `product_categories` és `products` táblák feltöltve minta adatokkal
- ✅ `src/lib/supabase.js` helyesen inicializálva
- ✅ `.env` fájl tartalmazza szükséges Supabase változókat
- ✅ Increment 2 (Auth) és Increment 4 (Lovak) már implementálva

---

## 1. Forgatókönyv: Normál Terméklistázás

### Lépések

1. Nyisd meg az alkalmazást böngészőben
2. Navigálj a `/webshop` útvonalhoz (vagy kattints a navigációs sávon a "Webshop" linkre)
3. Várd meg az oldal betöltését

### Ellenőrzések

- [ ] **Oldal cím:** "Webshop" és "Termékeink" megjelenik
- [ ] **Betöltési spinner:** Ha az adatok még betöltődnek, látható a spinner
- [ ] **Termékek megjelennek:** Grid sorrendben (1-4 oszlop a képernyőtől függően)
- [ ] **Kategória szűrő:** "Összes" gomb + kategória gombok láthatók
- [ ] **Termék kártyák tartalmazzák:**
  - Termék képe (vagy "Nincs kép" placeholder)
  - Termék neve
  - Termék leírása (max 2 sor, csonkított)
  - Ár HUF-ban formázva (pl. "3 500 Ft")
  - Elérhetőség jelvény (zöld "Elérhető" vagy szürke "Nem elérhető")
- [ ] **Nincsenek konzol hibák** – Nyisd meg a böngésző fejlesztői konzolt (F12), ne legyenek piros hibák

---

## 2. Forgatókönyv: Kategória Szűrés

### Lépések

1. Várj, amíg a termékek teljesen betöltődnek
2. Kattints az egyik kategória gombra (pl. "Takarmányok")
3. Figyelj a termék listára

### Ellenőrzések

- [ ] **Lista frissül azonnal** – Nem újratölti az oldalt, azonnali szűrés
- [ ] **Csak a kiválasztott kategóriához tartozó termékek jelennek meg**
- [ ] **Kategória gomb aktív állapot:** A kiválasztott gomb kiemelt (pl. sötétebb vagy más szín)
- [ ] **Vissza az "Összes"-re:** Kattints az "Összes" gombra → az összes termék megjelenik

### Tesztelési esetek

- [ ] Szűrj több kategóriára egymás után
- [ ] Ha egy kategóriára nincs termék: "Erre a kategóriára nincs termék." üzenet jelenik meg
- [ ] Reset: Kattints "Összes"-re → összes termék visszatér

---

## 3. Forgatókönyv: Termék Kártyák Megjelenítése

### Lépések

1. Nézz meg egy konkrét termék kártyát
2. Ellenőrizd az összes információt

### Ellenőrzések

- [ ] **Kép:** Ha van `image_url`, a kép megjelenik (200px magasság, object-fit: cover)
- [ ] **Nincs kép:** Ha nincs `image_url`, placeholder szöveg jelenik meg
- [ ] **Név:** Termék neve nagyobb betűvel (h6) látható, nem törölve
- [ ] **Leírás:** Leírás szöveg jelenik meg vagy "Nincs leírás"
- [ ] **Ár formázása:** Helyes HUF formátum (pl. "1 500 Ft", "25 000 Ft")
- [ ] **Elérhetőség jelvény:**
  - Zöld "Elérhető" jelvény: ha `is_available = true`
  - Szürke "Nem elérhető" jelvény: ha `is_available = false`

### Tesztelési esetek

- [ ] Nagy ár: 100,000+ Ft → helyes 4-számjegyes formázás
- [ ] Kicsi ár: 100 Ft → helyes formázás
- [ ] Hosszú termék név: ellenőrizd, hogy nem törik meg az elrendezés

---

## 4. Forgatókönyv: Responsive Design

### Lépések

1. Nyisd meg az alkalmazást asztali böngészőben (1920x1080)
2. Nyisd meg az alkalmazást tábla méretű böngészőben (768x1024)
3. Nyisd meg az alkalmazást mobil méretű böngészőben (375x667)

### Ellenőrzések

**Asztali (1920x1080):**
- [ ] 4 oszlop termék grid
- [ ] Kategória gombók egymás mellett vagy flexben

**Tábla (768x1024):**
- [ ] 2 oszlop termék grid
- [ ] Kategória gombók flex-ben, szükség szerint több sorban

**Mobil (375x667):**
- [ ] 1 oszlop termék grid
- [ ] Kategória gombók stack (egy sorban vagy több sorban flex)
- [ ] Gördítés működik függőlegesen és vízszintesen

### Bootstrap Grid Ellenőrzés

A kód usar `row-cols-1 row-cols-md-2 row-cols-lg-4 g-4`:
- [ ] < 768px: 1 oszlop
- [ ] 768px – 992px: 2 oszlop
- [ ] ≥ 992px: 4 oszlop

---

## 5. Forgatókönyv: Üres Adatbázis

### Setup

1. Töröld egy ideig az összes terméket a Supabase adatbázisból (vagy viselkedj úgy, mintha nem lennének)

### Lépések

1. Frissítsd az oldalt
2. Várd meg a betöltést

### Ellenőrzések

- [ ] **"Nincs termék az adatbázisban." üzenet jelenik meg**
- [ ] **Kategória szűrő nem látható (opcionális) vagy inaktív**
- [ ] **Grid is üresen marad**

### Helyreállítás

1. Add hozzá vissza a termékeket az adatbázishoz

---

## 6. Forgatókönyv: Hálózati Hiba

### Setup

1. Supabase projektet télileg offline módba (viselkedj úgy, mintha nem lenne internet)
   - Vagy böngésző fejleszt eszközöiben (Network tab) állíts "Offline" módot

### Lépések

1. Kattints a `/webshop` útvonalra

### Ellenőrzések

- [ ] **Hibaüzenet megjelenik:** "Hiba történt az adatbetöltés közben. Kérlek, próbálj újra később."
- [ ] **Loading spinner eltűnik**
- [ ] **Termékek nem jelennek meg**

### Helyreállítás

1. Váltsd vissza az online módba
2. Frissítsd az oldalt (F5)

---

## 7. Forgatókönyv: Betöltési Teljesítmény

### Lépések

1. Nyisd meg a böngésző fejlesztői konzol **Network** fülét
2. Frissítsd az oldalt (Ctrl+R vagy Cmd+R)
3. Figyelj a hálózati kérésekre

### Ellenőrzések

- [ ] **API hívások:** 2 GET kérés (termékek + kategóriák)
- [ ] **Spinner megjelenik:** Amíg a lekérdezés folyam (< 2 másodperc normálisan)
- [ ] **Renderelés:** Termékek megjelennek ~ 1-3 másodperc alatt (internetcsatorna minőségtől függően)
- [ ] **Duplikált hívások: Nincsenek** – egyetlen request kategóriánként

### Performance Check

- [ ] Nyisd meg a Chrome DevTools **Lighthouse** lapot
- [ ] Fuss le egy Performance audit
- [ ] Ellenőrizd, hogy performance score > 80-90 legyen

---

## 8. Forgatókönyv: Szűrés depois de Kategória Változás

### Lépések

1. Kattints egy kategóriára (pl. "Takarmányok")
2. Várd meg, amíg a lista frissül
3. Kattints egy másik kategóriára (pl. "Vitamin")
4. Figyelj a listára

### Ellenőrzések

- [ ] **Seamless transition:** Nincs flicker, nincs "Betöltés..." spinner (kliens oldali szűrés)
- [ ] **Lista frissül azonnal**
- [ ] **Előző kategória termékei eltűnnek**
- [ ] **Új kategória termékei megjelennek**

---

## 9. Forgatókönyv: Képhiba Kezelés

### Setup

1. Gyújts egy termékre a Supabase-ben rosszmanem `image_url` (pl. "https://example.com/nonexistent.jpg")

### Lépések

1. Navigálj a `/webshop`-ra
2. Keress meg azt a termékkártyát

### Ellenőrzések

- [ ] **Placeholder jelenik meg:** "Nincs kép" szöveg
- [ ] **Konzol nem mutat image load hibát** (vagy ha igen, azt kezelni kell)
- [ ] **Kártya nem törik meg** – elrendezés intakt marad

---

## 10. Forgatókönyv: Komponens Kommunikáció

### Lépések

1. Nyisd meg a böngésző fejlesztői konzol **Vue DevTools** kiterjesztést (ha telepítve van)
2. Navigálj a Webshop komponenshez
3. Ellenőrizd az állapotot

### Ellenőrzések (Vue DevTools)

- [ ] `Webshop.vue` létezik
- [ ] `useProducts()` composable inicializálódott
- [ ] `products`, `categories`, `filteredProducts` ref-ek jelenlévő
- [ ] `selectedCategoryId` null vagy UUID típusú
- [ ] `loading` == false a betöltés után
- [ ] `error` == null (vagy hibaüzenet hiba esetén)

---

## Tesztelési Összefoglalás

| Forgatókönyv | Tesztelve | Eredmény | Megjegyzés |
|---|---|---|---|
| 1. Normál Terméklistázás | [ ] | Sikeres / Sikertelen | |
| 2. Kategória Szűrés | [ ] | Sikeres / Sikertelen | |
| 3. Termék Kártyák | [ ] | Sikeres / Sikertelen | |
| 4. Responsive Design | [ ] | Sikeres / Sikertelen | |
| 5. Üres Adatbázis | [ ] | Sikeres / Sikertelen | |
| 6. Hálózati Hiba | [ ] | Sikeres / Sikertelen | |
| 7. Betöltési Teljesítmény | [ ] | Sikeres / Sikertelen | |
| 8. Szűrés Váltás | [ ] | Sikeres / Sikertelen | |
| 9. Képhiba Kezelés | [ ] | Sikeres / Sikertelen | |
| 10. Komponens Kommunikáció | [ ] | Sikeres / Sikertelen | |

---

## Ismert Problémák & Megoldások

### Probléma: Termékek nem töltödnek be

**Lehetséges okok:**
1. Supabase nincs konfigurálva helyesen
2. `.env` fájl hiányzik vagy helytelen
3. `products` vagy `product_categories` tábla nem létezik
4. RLS policy megakadályozza az olvasást

**Megoldás:**
- [ ] Ellenőrizd `.env` fájlt (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] Ellenőrizd Supabase Dashboard-ot: táblák és adatok
- [ ] Ellenőrizd RLS policy-ket: "Public read" engedélyezve kell legyen
- [ ] Nyisd meg a szöveges konzolt és keress API hibákat

### Probléma: Szűrés nem működik

**Lehetséges okok:**
1. `category_id` mező nem létezik az adatbázisban
2. `useProducts.js` composable nem működik helyesen

**Megoldás:**
- [ ] Ellenőrizd `products` tábla: `category_id` mező létezik-e
- [ ] Nyisd meg Vue DevTools: `selectedCategoryId` frissül-e kattintásra
- [ ] Ellenőrizd `filteredProducts` computed property értékét

### Probléma: Képek nem jelennek meg

**Lehetséges okok:**
1. `image_url` URL-ek nem érvényesek
2. Supabase Storage bucket nem publikus

**Megoldás:**
- [ ] Ellenőrizd Supabase Storage: `product-images` bucket publikus-e
- [ ] Ellenőrizd URL-eket: helyes formátum-e
- [ ] Próbálj hozzáadni egy valid Supabase Storage URL-t

### Probléma: Konzol hibák

**Közös hibák:**
1. "Cannot read property 'length' of undefined" – `categories` vagy `products` undefined
2. "Supabase client is not initialized" – `.env` nincs betöltve

**Megoldás:**
- [ ] Ellenőrizd composable inicializációt
- [ ] Ellenőrizd `.env` és Vite konfigurációt
- [ ] Keressd a hibát a konzolban, nézd meg a teljes stack trace-t

---

## Nyom Fájl

**Felhasználott Verziók:**
- Vue.js: 3.3.4
- Bootstrap: 5.3.0
- Supabase JS: aktuális
- Böngésző: Chrome/Firefox/Safari (legfrissebb verzió ajánlott)

---

## Tesztelés Után

Miután az összes forgatókönyvet sikeresen tesztelted:

1. ✅ Jelöld meg az összes elemet a checkboxban
2. ✅ Ha van probléma, dokumentáld azt
3. ✅ Jelents problémát GitHub Issues-on vagy a fejlesztőnek

---

**Tesztelés dátuma:** _____________  
**Tesztelő:** _____________  
**Eredmény:** Sikeres / Sikertelen  
**Megjegyzések:**
