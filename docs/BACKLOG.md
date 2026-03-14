# Fejlesztési Backlog

## Összesített állapot
- **Összes task:** 76
- **Kész task:** 75
- **Hátralévő task:** 1
- **Készültség:** ~99%

---

## Inkrementum 1: Projekt Setup & Adatbázis
- **Prioritás:** Kritikus
- **Becsült időigény:** 2-3 óra
- **User Story:** Mint fejlesztő, szeretném beállítani a Supabase projektet és adatbázis sémát, hogy az alapok készen álljanak.

### Feladatok:
- [x] Supabase projekt létrehozása
- [x] Táblák létrehozása (horses, horse_images, product_categories, products, competitions, competition_results, contact_submissions)
- [x] Foreign key kapcsolatok beállítása
- [x] Storage buckets létrehozása (horse-images, competition-images, product-images)
- [x] Row Level Security (RLS) policies beállítása alapértelmezetten

### Elfogadási kritériumok:
- [x] Minden tábla létezik a megfelelő mezőkkel
- [x] RLS engedélyezve minden táblán (még ha üres policy-kkal is)
- [x] Storage buckets létrehozva és publikusak

### Státusz: Kész ✅

---

## Inkrementum 2: Autentikáció & Admin Szerepkör
- **Prioritás:** Kritikus
- **Becsült időigény:** 1-2 óra
- **User Story:** Mint admin, szeretnék bejelentkezni és kijelentkezni, hogy kezelni tudjam a tartalmat.

### Feladatok:
- [x] Admin user létrehozása Supabase Dashboard-on
- [x] RLS policy-k beállítása: public read, authenticated admin write
- [x] Bejelentkezési form (LoginPage.vue)
- [x] Session kezelés (useAuth composable, module-level singleton refs)
- [x] Védett admin oldalak (router guard watch-alapú, authReady ref)

### Elfogadási kritériumok:
- [x] Admin be tud jelentkezni
- [x] Session megmarad újratöltés után
- [x] Publikus látogatók csak olvasni tudnak
- [x] Admin látja a szerkesztési gombokat

### Státusz: Kész ✅

---

## Inkrementum 3: Lovak Megjelenítése (Read)
- **Prioritás:** Magas
- **Becsült időigény:** 2-3 óra
- **User Story:** Mint látogató, szeretném látni a lovasklub lovait, hogy megismerjem őket.

### Feladatok:
- [x] `HorsesPage.vue` - lovak listázása API-ból
- [x] Származási fa (PedigreeTree.vue) megjelenítés
- [x] Szűrés (HorseFilter.vue – kategória, kor, rendezés)
- [x] Képek galéria (HorseGallery.vue, HorseImageGallery.vue)
- [x] Responsive design megtartása
- [x] HorseDetailView – ló részletoldal (`/lovaink/:id`)
- [x] Lapozás (PaginationBar integráció)

### Elfogadási kritériumok:
- [x] Lovak dinamikusan töltődnek be az adatbázisból
- [x] Apa/anya adatok megjelennek (ha vannak)
- [x] Eladó lovak jelölve
- [x] Ha nincs ló az adatbázisban, friendly üzenet jelenik meg

### Státusz: Kész ✅

---

## Inkrementum 4: Lovak Admin Kezelése (Create/Update/Delete)
- **Prioritás:** Magas
- **Becsült időigény:** 3-4 óra
- **User Story:** Mint admin, szeretnék lovakat hozzáadni, szerkeszteni és törölni, hogy naprakész legyen az oldal.

### Feladatok:
- [x] Admin ló lista oldal (AdminHorseListView.vue + AdminHorseList.vue)
- [x] Új ló form (HorseForm.vue – név, nem, születési év, apa/anya választó, eladó checkbox)
- [x] Szerkesztés modal/oldal
- [x] Törlés confirmáció
- [x] Képfeltöltés integráció (HorseImageUpload.vue, horseImageService.js)
- [x] AdminRacehorseList.vue – versenylovak külön kezelése

### Elfogadási kritériumok:
- [x] Új ló létrehozható
- [x] Meglévő ló szerkeszthető
- [x] Ló törölhető (confirm után)
- [x] Apa/anya dropdown feltöltődik meglévő lovakkal
- [x] Képfeltöltés működik

### Státusz: Kész ✅

---

## Inkrementum 5: Webshop Termékek Megjelenítése
- **Prioritás:** Közepes
- **Becsült időigény:** 2–3 óra
- **User Story:** Mint látogató, szeretném böngészni a termékeket, hogy lássam mit kínál a webshop.

### Feladatok:
- [x] `ProductListView.vue` átalakítása - termékek API-ból
- [x] Kategóriák megjelenítése
- [x] Kategória szerinti szűrés (ProductFilter.vue)
- [x] Termék kártyák (ProductCard.vue – kép, név, ár, leírás)
- [x] "Jelenleg nem elérhető" jelzés
- [x] Termék részletoldal (`/webshop/:id`) - teljes leírás megjelenítés
- [x] Kapcsolódó termékek megjelenítése (ugyanaz a kategória)
- [x] Router integrálás - detail view
- [x] Ár szűrő (PriceRangeSlider.vue)
- [x] Lapozás (PaginationBar.vue)

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
- [x] Admin termék lista (AdminProductListView.vue – dupla fülös adminpanel)
- [x] Új kategória létrehozása (AdminCategoryList.vue, CategoryForm.vue)
- [x] Új termék létrehozása (AdminProductList.vue, ProductForm.vue – kategória választó, kép upload)
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
- [x] `ResultsPage.vue` – versenyek API-ból (useCompetitions composable)
- [x] Évek szerinti csoportosítás (competitionsByYear)
- [x] Verseny kártyák: név, dátum, helyszín, kép
- [x] Eredmények listázása versenyenként
- [x] Statisztikák kiszámítása (stats – helyezések száma)

### Elfogadási kritériumok:
- [x] Versenyek időrendi sorrendben (legfrissebb felül)
- [x] Eredmények helyesen jelennek meg (lovas, ló, helyezés)
- [x] Statisztika számok helyesek

### Státusz: Kész ✅

---

## Inkrementum 8: Versenyeredmények Admin Kezelés
- **Prioritás:** Magas
- **Becsült időigény:** 3 óra
- **User Story:** Mint admin, szeretnék versenyeket és eredményeket rögzíteni, hogy frissek legyenek az adatok.

### Feladatok:
- [x] Admin verseny lista (AdminCompetitionListView.vue + AdminCompetitionList.vue)
- [x] Új verseny létrehozása (CompetitionForm.vue – név, helyszín, dátumok, kép)
- [x] Eredmények hozzáadása versenyhez (lovas, ló dropdown, szakág, helyezés)
- [x] Eredmények szerkesztése/törlése
- [x] Verseny törlés

### Elfogadási kritériumok:
- [x] Verseny CRUD működik
- [x] Eredmény CRUD működik
- [x] Ló dropdown feltöltődik saját lovakkal
- [x] Dátum validáció (end_date >= start_date)

### Státusz: Kész ✅

---

## Inkrementum 9: Kapcsolatfelvételi Űrlap
- **Prioritás:** Alacsony
- **Becsült időigény:** 1-2 óra
- **User Story:** Mint látogató, szeretnék üzenetet küldeni a klubnak, hogy kapcsolatba léphessek velük.

### Feladatok:
- [x] ContactView.vue + ContactForm.vue – kapcsolat form
- [x] Form submit -> contactService.js (Supabase insert)
- [x] Success üzenet megjelenítése
- [x] Admin: AdminContactListView.vue + AdminContactList.vue – beküldött üzenetek
- [x] Olvasottá jelölés funkció (useContacts composable)

### Elfogadási kritériumok:
- [x] Látogató el tud küldeni üzenetet
- [x] Sikeres beküldés után feedback
- [x] Admin látja az új üzeneteket
- [x] Olvasott/olvasatlan státusz működik

### Státusz: Kész ✅

---

## Inkrementum 10: Főoldal Dinamizálása
- **Prioritás:** Közepes
- **Becsült időigény:** 2 óra
- **User Story:** Mint látogató, szeretném látni a legfrissebb versenyeket és eladó lovakat a főoldalon.

### Feladatok:
- [x] "Legutóbbi Versenyeink" lista feltöltése API-ból (fetchLatestCompetitions)
- [x] Lovak és termékek betöltése API-ból a főoldalon
- [x] Dynamic év a footerben (yearsOfExperience computed)
- [x] Hero image slider (automatikus képváltás)

### Elfogadási kritériumok:
- [x] Főoldal versenylista automatikusan frissül
- [x] Lovak és termékek API-ból töltődnek

### Státusz: Kész ✅

---

## Inkrementum 11: Kép Optimalizálás & CDN
- **Prioritás:** Alacsony
- **Becsült időigény:** 1 óra
- **User Story:** Mint fejlesztő, szeretném optimalizálni a képeket, hogy gyorsabb legyen az oldal.

### Feladatok:
- [ ] Supabase Image Transformation használata (resize, format) *(Pro plan szükséges – jövőbeli bővítési lehetőség)*
- [x] Lazy loading képekre
- [x] Placeholder/skeleton screen betöltés közben

### Elfogadási kritériumok:
- [ ] Képek automatikusan optimalizálva töltődnek be
- [x] Lazy loading működik
- [ ] Látható a teljesítmény javulás (PageSpeed Insights)

### Státusz: Részben kész

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
- [x] `CheckoutView.vue` – rendelés összesítő, szállítás/fizetés
- [x] Router: `/kosar` és `/penztar` útvonalak
- [x] Admin ProductForm – stock input mező

### Elfogadási kritériumok:
- [x] Termék kosárba helyezhető (max a készlet mennyiségig)
- [x] Kosár ikon badge-dzsel jelzi a darabszámot
- [x] Hover tooltip mutatja a kosár tartalmát (max 3 tétel + "és X további...")
- [x] Kosár oldal: tételek listázása, mennyiség módosítás, törlés, összesítés
- [x] Ajánlott termékek megjelennek a kosár oldalon
- [x] Pénztár oldal: összesítő, szállítás/fizetés
- [x] Kosár megmarad oldal újratöltés után (localStorage)
- [x] Admin form-ban beállítható a készlet mennyiség

### Státusz: Kész ✅

### Adatbázis migráció (kézzel futtatandó Supabase-ben):
```sql
ALTER TABLE products ADD COLUMN stock integer DEFAULT 0;
```

---

## Inkrementum 13: Rendeléskezelés & Barion Fizetés
- **Prioritás:** Magas
- **User Story:** Mint vásárló, szeretnék online fizetni és nyomon követni a rendelésemet.

### Feladatok:
- [x] `orderService.js` – Barion Edge Function hívás (`barion-start`)
- [x] `useCheckout.js` composable – checkout logika
- [x] `useOrders.js` composable – rendelések lekérdezése
- [x] `useOrderLookup.js` composable – rendelés keresés email/azonosító alapján
- [x] `CheckoutSuccessView.vue` – sikeres fizetés visszajelzés
- [x] `CheckoutFailView.vue` – sikertelen fizetés visszajelzés
- [x] `OrderTrackingView.vue` – rendelés nyomon követés (`/rendeles-kovetes`)
- [x] `OrderLookup.vue` + `OrderStatusBadge.vue` komponensek
- [x] `AdminOrderListView.vue` + `AdminOrderList.vue` – admin rendelés lista
- [x] Router: `/rendeles-kovetes`, `/penztar/sikeres`, `/penztar/sikertelen`, `/admin/orders`

### Elfogadási kritériumok:
- [x] Fizetés indítható Barion gateway-en keresztül
- [x] Sikeres/sikertelen visszajelzés oldal működik
- [x] Rendelés nyomon követhető email alapján
- [x] Admin látja az összes rendelést

### Státusz: Kész ✅

---

## Inkrementum 14: Kiegészítő oldalak
- **Prioritás:** Alacsony
- **User Story:** Mint látogató, hozzáférhetők a jogi és kiegészítő oldalak.

### Feladatok:
- [x] `PrivacyPolicyView.vue` – adatvédelmi tájékoztató (`/adatvedelem`)
- [x] `useHead.js` composable – dinamikus oldal cím és meta description
- [x] `useReveal.js` composable – scroll-alapú animáció a főoldalon
- [x] `useTheme.js` composable – témaváltás kezelés

### Elfogadási kritériumok:
- [x] Adatvédelmi oldal elérhető linkről
- [x] Oldalcímek dinamikusan változnak navigációkor

### Státusz: Kész ✅

---

## Prioritási Sorrend (Ajánlott Fejlesztési Ütemezés)

1. **Inkrementum 1** - Setup (kész)
2. **Inkrementum 2** - Auth (kész)
3. **Inkrementum 3** - Lovak megjelenítés (kész)
4. **Inkrementum 4** - Lovak admin (kész)
5. **Inkrementum 7** - Versenyek megjelenítés (kész)
6. **Inkrementum 8** - Versenyek admin (kész)
7. **Inkrementum 5** - Webshop megjelenítés (kész)
8. **Inkrementum 6** - Webshop admin (kész)
9. **Inkrementum 12** - Kosár rendszer (kész)
10. **Inkrementum 13** - Rendeléskezelés & Barion (kész)
11. **Inkrementum 9** - Kapcsolat form (kész)
12. **Inkrementum 10** - Főoldal dinamizálás (kész)
13. **Inkrementum 14** - Kiegészítő oldalak (kész)
14. **Inkrementum 11** - Optimalizálás (tervezett)
