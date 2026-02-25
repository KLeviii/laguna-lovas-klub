# Fejlesztési Backlog

## Inkrementum 1: Projekt Setup & Adatbázis
- **Prioritás:** Kritikus
- **Becsült időigény:** 2-3 óra
- **User Story:** Mint fejlesztő, szeretném beállítani a Supabase projektet és adatbázis sémát, hogy az alapok készen álljanak.

### Feladatok:
- [ ] Supabase projekt létrehozása
- [ ] Táblák létrehozása (horses, horse_images, product_categories, products, competitions, competition_results, contact_submissions)
- [ ] Foreign key kapcsolatok beállítása
- [ ] Storage buckets létrehozása (horse-images, competition-images, product-images)
- [ ] Row Level Security (RLS) policies beállítása alapértelmezetten

### Elfogadási kritériumok:
- [ ] Minden tábla létezik a megfelelő mezőkkel
- [ ] RLS engedélyezve minden táblán (még ha üres policy-kkal is)
- [ ] Storage buckets létrehozva és publikusak

### Státusz: Kész

---

## Inkrementum 2: Autentikáció & Admin Szerepkör
- **Prioritás:** Kritikus
- **Becsült időigény:** 1-2 óra
- **User Story:** Mint admin, szeretnék bejelentkezni és kijelentkezni, hogy kezelni tudjam a tartalmat.

### Feladatok:
- [ ] Admin user létrehozása Supabase Dashboard-on
- [ ] RLS policy-k beállítása: public read, authenticated admin write
- [ ] Bejelentkezési form HTML/JS (auth/login.html)
- [ ] Session kezelés localStorage-ban
- [ ] Védett admin oldalak (redirect ha nincs login)

### Elfogadási kritériumok:
- [ ] Admin be tud jelentkezni
- [ ] Session megmarad újratöltés után
- [ ] Publikus látogatók csak olvasni tudnak
- [ ] Admin látja a szerkesztési gombokat

### Státusz: Tervezett

---

## Inkrementum 3: Lovak Megjelenítése (Read)
- **Prioritás:** Magas
- **Becsült időigény:** 2-3 óra
- **User Story:** Mint látogató, szeretném látni a lovasklub lovait, hogy megismerjem őket.

### Feladatok:
- [ ] `HorsesPage` átalakítása - lovak listázása API-ból
- [ ] Származási fa (pedigree table) megjelenítés
- [ ] Eladó lovak szűrése
- [ ] Képek carousel vagy galéria
- [ ] Responsive design megtartása

### Elfogadási kritériumok:
- [ ] Lovak dinamikusan töltődnek be az adatbázisból
- [ ] Apa/anya adatok megjelennek (ha vannak)
- [ ] Eladó lovak jelölve
- [ ] Ha nincs ló az adatbázisban, friendly üzenet jelenik meg

### Státusz: Tervezett

---

## Inkrementum 4: Lovak Admin Kezelése (Create/Update/Delete)
- **Prioritás:** Magas
- **Becsült időigény:** 3-4 óra
- **User Story:** Mint admin, szeretnék lovakat hozzáadni, szerkeszteni és törölni, hogy naprakész legyen az oldal.

### Feladatok:
- [ ] Admin ló lista oldal (admin/horses.html)
- [ ] Új ló form (név, nem, születési év, apa/anya választó, eladó checkbox)
- [ ] Szerkesztés modal/oldal
- [ ] Törlés confirmáció
- [ ] Képfeltöltés integráció (Storage API)

### Elfogadási kritériumok:
- [ ] Új ló létrehozható
- [ ] Meglévő ló szerkeszthető
- [ ] Ló törölhető (confirm után)
- [ ] Apa/anya dropdown feltöltődik meglévő lovakkal
- [ ] Képfeltöltés működik

### Státusz: Tervezett

---

## Inkrementum 5: Webshop Termékek Megjelenítése
- **Prioritás:** Közepes
- **Becsült időigény:** 2–3 óra
- **User Story:** Mint látogató, szeretném böngészni a termékeket, hogy lássam mit kínál a webshop.

### Feladatok:
- [x] `Webshop.vue` átalakítása - termékek API-ból
- [x] Kategóriák megjelenítése
- [x] Kategória szerinti szűrés
- [x] Termék kártyák (kép, név, ár, leírás)
- [x] "Jelenleg nem elérhető" jelzés
- [x] Termék részletoldal (`/webshop/:id`) - teljes leírás megjelenítés
- [x] Kapcsolódó termékek megjelenítése (ugyanaz a kategória)
- [x] Router integrálás - detail view

### Elfogadási kritériumok:
- [x] Termékek kategóriánként rendezve jelennek meg
- [x] Kategória váltás működik (client-side szűrés)
- [x] Árak helyesen formázva (HUF)
- [x] Nem elérhető termékek jelölve
- [x] Responsive design (mobil/tablet/asztali)
- [x] Betöltési spinner és hibakezelés
- [x] Üres státusz üzenetek
- [x] Termék részletoldal működik linkekből
- [x] Kapcsolódó termékek lista működik
- [x] Vissza gomb működik a részletoldalon

### Státusz: Kész ✅

---

## Inkrementum 6: Webshop Admin Kezelés
- **Prioritás:** Közepes
- **Becsült időigény:** 3 óra
- **User Story:** Mint admin, szeretnék termékeket és kategóriákat kezelni, hogy naprakész legyen a kínálat.

### Feladatok:
- [x] Admin termék lista (dupla fülös adminpanel)
- [x] Új kategória létrehozása (CRUD)
- [x] Új termék létrehozása (kategória választó, kép upload)
- [x] Termék szerkesztés
- [x] Termék "törlés" (soft delete: is_available: false)
- [x] Kategória szerkesztés
- [x] Kategória törlés
- [x] Elérhető/nem elérhető toggle

### Elfogadási kritériumok:
- [x] Kategória CRUD működik
- [x] Termék CRUD működik
- [x] Képfeltöltés termékekhez (Supabase Storage)
- [x] Kategória dropdown frissül új kategória után
- [x] Soft delete (is_available toggle) működik
- [x] Forma validáció és hibaüzenetek
- [x] Dupla fülös felület (Kategóriák + Termékek)

### Státusz: Kész ✅

---

## Inkrementum 7: Versenyeredmények Megjelenítése
- **Prioritás:** Magas
- **Becsült időigény:** 2-3 óra
- **User Story:** Mint látogató, szeretném látni a versenyek eredményeit, hogy lássam a klub teljesítményét.

### Feladatok:
- [ ] `eredmenyeink.html` átalakítása - versenyek API-ból
- [ ] Accordion: évek szerinti csoportosítás
- [ ] Verseny kártyák: név, dátum, helyszín, kép
- [ ] Eredmények listázása versenyenként
- [ ] Statisztikák kiszámítása (helyezések száma)

### Elfogadási kritériumok:
- [ ] Versenyek időrendi sorrendben (legfrissebb felül)
- [ ] Accordion évek szerint működik
- [ ] Eredmények helyesen jelennek meg (lovas, ló, helyezés)
- [ ] Statisztika számok helyesek (aktív versenyző, bajnoki cím, helyezések)

### Státusz: Tervezett

---

## Inkrementum 8: Versenyeredmények Admin Kezelés
- **Prioritás:** Magas
- **Becsült időigény:** 3 óra
- **User Story:** Mint admin, szeretnék versenyeket és eredményeket rögzíteni, hogy frissek legyenek az adatok.

### Feladatok:
- [ ] Admin verseny lista (admin/competitions.html)
- [ ] Új verseny létrehozása (név, helyszín, dátumok, kép)
- [ ] Eredmények hozzáadása versenyhez (lovas, ló dropdown, szakág, helyezés)
- [ ] Eredmények szerkesztése/törlése
- [ ] Verseny törlés (cascade: eredmények is törlődnek)

### Elfogadási kritériumok:
- [ ] Verseny CRUD működik
- [ ] Eredmény CRUD működik
- [ ] Ló dropdown feltöltődik saját lovakkal
- [ ] Dátum validáció (end_date >= start_date)

### Státusz: Tervezett

---

## Inkrementum 9: Kapcsolatfelvételi Űrlap
- **Prioritás:** Alacsony
- **Becsült időigény:** 1-2 óra
- **User Story:** Mint látogató, szeretnék üzenetet küldeni a klubnak, hogy kapcsolatba léphessek velük.

### Feladatok:
- [ ] Kapcsolat form HTML (index.html vagy külön contact.html)
- [ ] Form submit -> POST /contact_submissions
- [ ] Success üzenet megjelenítése
- [ ] Admin: beküldött üzenetek listája (admin/messages.html)
- [ ] Olvasottá jelölés funkció

### Elfogadási kritériumok:
- [ ] Látogató el tud küldeni üzenetet
- [ ] Sikeres beküldés után feedback
- [ ] Admin látja az új üzeneteket
- [ ] Olvasott/olvasatlan státusz működik

### Státusz: Tervezett

---

## Inkrementum 10: Főoldal Dinamizálása
- **Prioritás:** Közepes
- **Becsült időigény:** 2 óra
- **User Story:** Mint látogató, szeretném látni a legfrissebb versenyeket és eladó lovakat a főoldalon.

### Feladatok:
- [ ] "Legutóbbi Versenyeink" lista feltöltése API-ból (top 5)
- [ ] "Eladó lovaink" lista feltöltése API-ból (max 2 featured)
- [ ] Footer "Lorem ipsum" szövegek cseréje valódi tartalomra
- [ ] Dynamic év a footerben (2025 -> current year)

### Elfogadási kritériumok:
- [ ] Főoldal versenylista automatikusan frissül
- [ ] Eladó lovak szépen megjelennek
- [ ] Nincs dummy szöveg

### Státusz: Tervezett

---

## Inkrementum 11: Kép Optimalizálás & CDN
- **Prioritás:** Alacsony
- **Becsült időigény:** 1 óra
- **User Story:** Mint fejlesztő, szeretném optimalizálni a képeket, hogy gyorsabb legyen az oldal.

### Feladatok:
- [ ] Supabase Image Transformation használata (resize, format)
- [ ] Lazy loading képekre
- [ ] Placeholder/skeleton screen betöltés közben

### Elfogadási kritériumok:
- [ ] Képek automatikusan optimalizálva töltődnek be
- [ ] Lazy loading működik
- [ ] Látható a teljesítmény javulás (PageSpeed Insights)

### Státusz: Tervezett

---

## Inkrementum 12: Webshop Kosár Rendszer
- **Prioritás:** Közepes
- **User Story:** Mint látogató, szeretnék termékeket kosárba helyezni, a kosár tartalmát megtekinteni, és eljutni a pénztárhoz.

### Feladatok:
- [x] `stock` (integer) mező hozzáadása a products táblához
- [x] `useCart.js` composable (localStorage perzisztencia, singleton pattern)
- [x] `CartIcon.vue` a headerben – badge darabszámmal, hover tooltip kosár tartalommal
- [x] ProductCard-on "Kosárba" gomb (készletlimit, vizuális feedback)
- [x] ProductDetailView – mennyiségválasztó + "Kosárba" gomb, készlet kijelzés
- [x] `CartView.vue` – kosár tartalma (+/- gombok, törlés, összesítés), ajánlott termékek szekció
- [x] `CheckoutView.vue` – rendelés összesítő, szállítás/fizetés placeholder-ek
- [x] Router: `/kosar` és `/penztar` útvonalak
- [x] Admin ProductForm – stock input mező
- [x] Dokumentáció frissítés (README, BACKLOG)

### Elfogadási kritériumok:
- [x] Termék kosárba helyezhető (max a készlet mennyiségig)
- [x] Kosár ikon badge-dzsel jelzi a darabszámot
- [x] Hover tooltip mutatja a kosár tartalmát (max 3 tétel + "és X további...")
- [x] Kosár oldal: tételek listázása, mennyiség módosítás, törlés, összesítés
- [x] Ajánlott termékek megjelennek a kosár oldalon
- [x] Pénztár oldal: összesítő, szállítás/fizetés placeholder
- [x] Kosár megmarad oldal újratöltés után (localStorage)
- [x] Admin form-ban beállítható a készlet mennyiség

### Státusz: Kész ✅

### Adatbázis migráció (kézzel futtatandó Supabase-ben):
```sql
ALTER TABLE products ADD COLUMN stock integer DEFAULT 0;
```

---

## Prioritási Sorrend (Ajánlott Fejlesztési Ütemezés)

1. **Inkrementum 1** - Setup (kritikus)
2. **Inkrementum 2** - Auth (kritikus)
3. **Inkrementum 3** - Lovak megjelenítés (magas)
4. **Inkrementum 4** - Lovak admin (magas)
5. **Inkrementum 7** - Versenyek megjelenítés (magas)
6. **Inkrementum 8** - Versenyek admin (magas)
7. **Inkrementum 5** - Webshop megjelenítés (közepes)
8. **Inkrementum 6** - Webshop admin (közepes)
9. **Inkrementum 10** - Főoldal dinamizálás (közepes)
10. **Inkrementum 9** - Kapcsolat form (alacsony)
11. **Inkrementum 11** - Optimalizálás (alacsony)
