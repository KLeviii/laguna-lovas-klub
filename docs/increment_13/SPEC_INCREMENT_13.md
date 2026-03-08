# Increment 13: Rendeléskövetés & Admin Rendeléskezelés – Specification

**Version:** 1.0
**Date:** March 2026
**Priority:** Magas
**Estimated Effort:** 3–4 hours
**Status:** Ready for Implementation
**Preconditions:** Increment 12 (Webshop Kosár & Checkout) MUST be complete

---

## 1. Overview

Increment 13 két funkciót valósít meg:

**A) Publikus rendeléskövetés** – A felhasználónak nincs fiókja, ezért a rendelés azonosítójával (UUID) tudja nyomon követni a rendelése aktuális állapotát. Egy dedikált `/rendeles-kovetes` oldalon megadja a rendelésszámot, és látja az állapotot, tételeket, szállítási adatokat.

**B) Admin rendeléskezelés** – A cég az `/admin/orders` oldalon (AdminLayout-ban, az Üzenetek oldal mintájára) látja az összes beérkezett rendelést, és egy váltogatható gombbal (dropdown) tudja változtatni az aktuális rendelés állapotát (pl. „Feldolgozás alatt", „Szállítás alatt", „Kiszállítva"). Az admin mód kapcsoló, az oldal általános megjelenése és működése pontosan az Üzenetek (`AdminContactList.vue`) oldal mintáját követi.

**Key Features:**
- Publikus rendeléskeresés azonosító alapján
- Rendelés részletek megjelenítése (állapot, tételek, szállítás, összeg)
- Admin rendelés lista (desktop: táblázat, mobil: accordion)
- Rendelés állapot módosítása (admin)
- Olvasott/olvasatlan jelölés (admin)
- Olvasatlan rendelések számának megjelenítése badge-ben

---

## 2. Feature Description

### 2.1 In Scope

- **Publikus rendeléskeresés** – Keresőmező a rendelés UUID-jéhez, eredménykártya az állapottal és részletekkel
- **Admin rendelés lista** – Összes rendelés megjelenítése táblázatban (desktop) és accordionban (mobil)
- **Állapotváltás** – Admin dropdown gombbal módosíthatja a rendelés státuszát:
  - `pending` → „Feldolgozás alatt"
  - `confirmed` → „Visszaigazolva"
  - `shipped` → „Szállítás alatt"
  - `delivered` → „Kiszállítva"
  - `cancelled` → „Törölve"
- **Olvasott/olvasatlan kezelés** – Azonos minta mint az Üzeneteknél (`is_read` mező)
- **Olvasatlan számláló** – Badge az admin fejlécben az olvasatlan rendelések számával
- **Rendelés részletek** – Tételek, szállítási adatok, megjegyzések megjelenítése
- **Responsive design** – Bootstrap alapú, mobil-barát elrendezés

### 2.2 Out of Scope (Future)

- E-mail értesítés küldése a vevőnek állapotváltáskor
- Rendelés törlése (soft delete)
- Rendelés szerkesztése (tételek, szállítási adatok módosítása)
- Szűrés állapot vagy dátum alapján az admin listán
- Nyomtatható rendelési összesítő / számla generálás
- Csomagkövetési szám (tracking number) integráció (MPL – lásd COURIER_SPECIFICATION.md)
- Valós idejű frissítés (Supabase Realtime)

---

## 3. User Stories

### 3.1 Vásárló rendelés nyomon követése

**As a** vásárló
**I want to** a rendelés azonosítómmal megnézni a rendelésem aktuális állapotát
**So that** tudjam, hogy hol tart a rendelésem feldolgozása.

**Acceptance Criteria:**

- A `/rendeles-kovetes` oldalon van egy szöveges beviteli mező és egy „Keresés" gomb
- A rendelés azonosítóját (UUID) beírva megjelenik a rendelés állapota
- Megjelenik: állapot badge, fizetési állapot, végösszeg, dátum, tételek listája
- Ha a rendelés nem található: „Nem találtunk rendelést ezzel az azonosítóval." üzenet
- Ha érvénytelen formátum: „Érvénytelen rendelés azonosító formátum." validációs üzenet
- A sikeres fizetés oldalról (`/penztar/sikeres`) link vezet ide az orderId-vel előre kitöltve
- Ha az URL-ben van `?orderId=...` query paraméter, automatikusan keres

### 3.2 Admin rendelések megtekintése

**As an** admin
**I want to** látni az összes beérkezett rendelést egy listában
**So that** áttekintsem a rendeléseket és kezeljem az állapotukat.

**Acceptance Criteria:**

- Az `/admin/orders` oldalon megjelenik az összes rendelés (legújabb felül)
- Desktop: Bootstrap táblázat oszlopokkal (Státusz, Olvasott, Vevő, Email, Összeg, Fizetés, Szállítási mód, Dátum, Műveletek)
- Mobil: Accordion, kinyitható sorokkal (az Üzenetek mintájára)
- Olvasatlan rendelések (`is_read: false`) félkövér betűtípussal jelennek meg
- Olvasatlan számláló badge a fejlécben
- Üres állapot: „Nincsenek beérkezett rendelések."
- Betöltési spinner és hibaüzenet újrapróbálkozás gombbal

### 3.3 Admin rendelés állapotának módosítása

**As an** admin
**I want to** módosítani egy rendelés állapotát
**So that** a vevő láthassa a rendelés aktuális feldolgozási állapotát.

**Acceptance Criteria:**

- Minden rendelés sorában van egy dropdown gomb az elérhető állapotokkal
- A dropdown nem tartalmazza az aktuális állapotot (csak a többi opciót)
- Állapotváltás után a sor azonnal frissül (optimisztikus lokális frissítés)
- Ha az állapotváltás sikertelen: hibaüzenet jelenik meg
- Az állapot badge színe az állapotnak megfelelően változik

### 3.4 Admin rendelés olvasottá/olvasatlanná jelölése

**As an** admin
**I want to** rendeléseket olvasottnak vagy olvasatlannak jelölni
**So that** nyomon követhessem, melyik rendelést dolgoztam már fel.

**Acceptance Criteria:**

- Olvasatlan → olvasott jelölés gomb (`bi-check2`, mint az Üzeneteknél)
- Olvasott → olvasatlan jelölés gomb (`bi-envelope`, mint az Üzeneteknél)
- Mobil accordionon kinyitáskor automatikusan olvasottra jelöl
- Olvasatlan számláló frissül a badge-ben

### 3.5 Admin rendelés részleteinek megtekintése

**As an** admin
**I want to** egy rendelés teljes részleteit megtekinteni
**So that** láthassam a tételeket, szállítási adatokat és megjegyzéseket.

**Acceptance Criteria:**

- Mobil: Accordion kinyitásakor megjelenik a részletes nézet
- Desktop: Accordion-ban (a táblázat alatt) kinyitható a részletes nézet
- Részletek: vevő adatok, szállítási cím, szállítási mód, fizetési mód, megjegyzés, tételek lista
- Tételek: terméknév, mennyiség, egységár, sor összeg
- A tételek lekérése on-demand történik (nem az összes rendelésnél egyszerre)

---

## 4. Data Model

### 4.1 Orders Table (Existing)

```sql
-- Increment 12-ben létrehozva; Increment 13-ban használva (read + update status/is_read)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_name TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_country TEXT NOT NULL DEFAULT 'Magyarország',
  notes TEXT,
  shipping_method TEXT NOT NULL DEFAULT 'magyar_posta',
  shipping_cost_huf INTEGER NOT NULL DEFAULT 1490,
  payment_method TEXT NOT NULL DEFAULT 'simple_pay',
  status TEXT NOT NULL DEFAULT 'pending',          -- pending/confirmed/shipped/delivered/cancelled
  payment_status TEXT NOT NULL DEFAULT 'pending',  -- pending/paid/failed/refunded
  total_amount_huf INTEGER NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  barion_payment_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Order Items Table (Existing)

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,       -- Snapshot: termék neve a rendelés pillanatában
  unit_price_huf INTEGER NOT NULL,  -- Snapshot: egységár a rendelés pillanatában
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.3 Állapotok Értékkészlete

| DB érték | Magyar megjelenítés | Badge szín |
|----------|---------------------|------------|
| `pending` | Feldolgozás alatt | `bg-warning text-dark` |
| `confirmed` | Visszaigazolva | `bg-info text-dark` |
| `shipped` | Szállítás alatt | `bg-primary` |
| `delivered` | Kiszállítva | `bg-success` |
| `cancelled` | Törölve | `bg-danger` |

### 4.4 Fizetési Állapotok

| DB érték | Magyar megjelenítés | Badge szín |
|----------|---------------------|------------|
| `pending` | Függőben | `bg-secondary` |
| `paid` | Fizetve | `bg-success` |
| `failed` | Sikertelen | `bg-danger` |
| `refunded` | Visszatérítve | `bg-warning text-dark` |

### 4.5 Szállítási Módok

| DB érték | Magyar megjelenítés |
|----------|---------------------|
| `magyar_posta` | Magyar Posta (MPL) |
| `sajat_szallitas` | Saját szállítás |

### 4.6 Adatbázis Módosítás

Nincs szükség adatbázis migrációra – az összes szükséges mező (`status`, `is_read`, `order_items`) már létezik.

---

## 5. API Contract

### 5.1 Fetch Order with Items (Public – rendeléskövetés)

**Supabase Query:**

```javascript
supabase
  .from('orders')
  .select('*, order_items(*)')
  .eq('id', orderId)
  .single()
```

**Auth:** Public (anon – az RLS policy engedi a SELECT-et az `orders` és `order_items` táblákon)

**Response:**

```json
{
  "id": "uuid",
  "customer_name": "Példa Péter",
  "status": "shipped",
  "payment_status": "paid",
  "total_amount_huf": 12500,
  "shipping_method": "magyar_posta",
  "shipping_name": "Példa Péter",
  "shipping_zip": "1234",
  "shipping_city": "Budapest",
  "shipping_address": "Példa utca 1.",
  "created_at": "2026-03-01T10:00:00Z",
  "order_items": [
    {
      "id": "uuid",
      "product_name": "Fű takarmány",
      "unit_price_huf": 3500,
      "quantity": 2
    }
  ]
}
```

### 5.2 Fetch All Orders (Admin)

**Supabase Query:**

```javascript
supabase
  .from('orders')
  .select('id, customer_name, customer_email, customer_phone, status, payment_status, total_amount_huf, is_read, shipping_method, created_at, updated_at')
  .order('created_at', { ascending: false })
```

**Auth:** Authenticated (admin RLS policy)

### 5.3 Update Order Status (Admin)

**Approach:** Upsert minta (CORS workaround – azonos minta mint a `contactService.js`-ben)

1. Lekéri a meglévő rendelést: `SELECT * FROM orders WHERE id = ?`
2. Upsert az új státusszal: `UPSERT { ...existing, status: newStatus }`

**Valid status values:** `'pending'`, `'confirmed'`, `'shipped'`, `'delivered'`, `'cancelled'`

### 5.4 Update Order Read Status (Admin)

**Approach:** Azonos upsert minta mint a `contactService.js` `updateContactReadStatus` függvénye.

### 5.5 Error Handling

| Hiba | Kezelés |
|------|---------|
| Hálózati hiba (public lookup) | „Hiba történt a rendelés lekérése közben. Kérjük, próbáld újra később." |
| Rendelés nem található | „Nem találtunk rendelést ezzel az azonosítóval." |
| Érvénytelen UUID formátum | „Érvénytelen rendelés azonosító formátum." (kliens-oldali validáció) |
| Admin lista betöltési hiba | Hiba alert + „Újrapróbálkozás" gomb (Üzenetek mintája) |
| Állapotváltás hiba | Hiba alert, lokális állapot nem frissül |
| Olvasottság módosítás hiba | Hiba alert |

---

## 6. Technical Implementation

### 6.1 Files & Components

#### New Files:

1. **`src/services/orderService.js`** – Bővítés (meglévő fájl, új függvények)

   Meglévő:
   - `startBarionPayment(orderData)`
   - `fetchOrderById(orderId)`

   Új függvények:
   ```javascript
   /**
    * Rendelés lekérése tételekkel együtt (publikus keresés).
    * @param {string} orderId - Rendelés UUID
    * @returns {Promise<Object|null>}
    */
   export async function fetchOrderWithItems(orderId) { ... }

   /**
    * Összes rendelés lekérése (admin lista).
    * @returns {Promise<Array>}
    * @throws {Error}
    */
   export async function fetchAllOrders() { ... }

   /**
    * Rendelés állapotának frissítése (admin).
    * Upsert mintát használ (CORS workaround).
    * @param {string} id - Rendelés UUID
    * @param {string} newStatus - Új állapot
    * @returns {Promise<void>}
    * @throws {Error}
    */
   export async function updateOrderStatus(id, newStatus) { ... }

   /**
    * Rendelés olvasottsági állapotának frissítése (admin).
    * @param {string} id - Rendelés UUID
    * @param {boolean} isRead - Új olvasottsági állapot
    * @returns {Promise<void>}
    * @throws {Error}
    */
   export async function markOrderAsRead(id) { ... }
   export async function markOrderAsUnread(id) { ... }
   ```

2. **`src/composables/useOrderLookup.js`** – Publikus rendeléskeresés composable

   ```javascript
   export function useOrderLookup() {
     const order = ref(null)
     const loading = ref(false)
     const error = ref(null)
     const searched = ref(false)

     const notFound = computed(() => searched.value && !order.value && !error.value)

     async function lookupOrder(orderId) { ... }

     return { order, loading, error, searched, notFound, lookupOrder }
   }
   ```

3. **`src/composables/useOrders.js`** – Admin rendeléskezelés composable (useContacts mintája)

   ```javascript
   export function useOrders() {
     const orders = ref([])
     const loading = ref(false)
     const error = ref(null)

     const unreadCount = computed(() => orders.value.filter(o => !o.is_read).length)
     const isEmpty = computed(() => orders.value.length === 0)

     async function loadOrders() { ... }
     async function markAsRead(id) { ... }
     async function markAsUnread(id) { ... }
     async function changeStatus(id, newStatus) { ... }

     return { orders, loading, error, unreadCount, isEmpty, loadOrders, markAsRead, markAsUnread, changeStatus }
   }
   ```

4. **`src/components/orders/OrderStatusBadge.vue`** – Újrafelhasználható állapot badge

   ```vue
   <script setup>
   import { formatOrderStatus } from '@/utils/formatting'

   const props = defineProps({
     status: { type: String, required: true }
   })

   const badgeClass = computed(() => {
     const map = {
       pending: 'bg-warning text-dark',
       confirmed: 'bg-info text-dark',
       shipped: 'bg-primary',
       delivered: 'bg-success',
       cancelled: 'bg-danger',
     }
     return map[props.status] || 'bg-secondary'
   })
   </script>

   <template>
     <span class="badge" :class="badgeClass">{{ formatOrderStatus(status) }}</span>
   </template>
   ```

5. **`src/components/orders/OrderLookup.vue`** – Publikus keresőform + eredmény kártya

   - Card fejléc: „Rendelés nyomon követése" (`bi-search` ikon)
   - Beviteli mező: `form-control` placeholder-rel
   - „Keresés" gomb: `btn btn-primary`
   - Betöltés: `spinner-border`
   - Nem található: `alert alert-warning`
   - Érvénytelen formátum: inline validációs hiba
   - Eredmény kártya:
     - Rendelés azonosító (rövidítve + teljes tooltip-ben)
     - `OrderStatusBadge` az állapotnak
     - Fizetési állapot badge
     - Végösszeg (`formatPrice`)
     - Dátum (`formatDateTime`)
     - Szállítási adatok (név, cím, mód)
     - Tételek lista (terméknév, mennyiség, egységár, soronkénti összeg)

6. **`src/components/orders/AdminOrderList.vue`** – Admin rendelés lista (AdminContactList.vue mintája)

   **Fejléc:**
   ```html
   <h3>
     <i class="bi bi-box-seam me-2"></i>Rendelések
     <span v-if="unreadCount > 0" class="badge bg-danger ms-2">
       {{ unreadCount }} új
     </span>
   </h3>
   ```

   **Állapotok:** Loading spinner, error + retry, empty state – azonos minta.

   **Desktop táblázat** (`d-none d-md-block`):

   | Oszlop | Tartalom |
   |--------|----------|
   | Státusz | `OrderStatusBadge` |
   | Olvasott | Zöld „Új" / szürke „Olvasott" badge |
   | Vevő | `customer_name` |
   | Email | `mailto:` link |
   | Összeg | `formatPrice(total_amount_huf)` |
   | Fizetés | Fizetési állapot badge |
   | Szállítás | Szállítási mód badge |
   | Dátum | `formatDateTime(created_at)` |
   | Műveletek | Gomb-csoport |

   **Műveletek (btn-group-sm):**
   - Állapotváltó dropdown gomb (Bootstrap dropdown, aktuális állapot nélkül)
   - Olvasottá/olvasatlanná jelölés gomb (`bi-check2` / `bi-envelope`)

   **Mobil accordion:**
   - Accordion fejléc: olvasottsági badge + vevő neve + összeg + dátum
   - Kinyitáskor: automatikus olvasottra jelölés
   - Accordion body:
     - Vevő adatok (név, email mailto, telefon tel link)
     - Szállítási adatok (cím, mód)
     - Fizetési állapot + mód
     - Megjegyzés (ha van)
     - Tételek lista (on-demand betöltés)
     - Műveletek: állapotváltó dropdown + olvasottság gomb
   - Scoped CSS a mobil accordion-hoz (azonos az Üzenetek `@media` szabályaival)

7. **`src/views/OrderTrackingView.vue`** – Publikus rendeléskövetés oldal

   ```vue
   <script setup>
   import OrderLookup from '@/components/orders/OrderLookup.vue'
   import { useHead } from '@/composables/useHead'

   useHead('Rendelés követése')
   </script>

   <template>
     <div>
       <main>
         <section class="p-3 p-md-5" style="padding-top: 100px !important;">
           <div class="row justify-content-center">
             <div class="col-12 col-md-8 col-lg-6">
               <OrderLookup />
             </div>
           </div>
         </section>
       </main>
     </div>
   </template>
   ```

8. **`src/views/AdminOrderListView.vue`** – Admin rendeléskezelés oldal (Üzenetek minta)

   ```vue
   <script setup>
   import AdminLayout from '@/components/admin/AdminLayout.vue'
   import AdminOrderList from '@/components/orders/AdminOrderList.vue'
   </script>

   <template>
     <AdminLayout>
       <div class="container">
         <AdminOrderList />
       </div>
     </AdminLayout>
   </template>
   ```

#### Modified Files:

1. **`src/router/index.js`** – Két új route hozzáadása:
   ```javascript
   { path: '/rendeles-kovetes', component: () => import('@/views/OrderTrackingView.vue') },
   { path: '/admin/orders', component: () => import('@/views/AdminOrderListView.vue'), meta: { requiresAuth: true } },
   ```

2. **`src/utils/formatting.js`** – Új formázó függvények:
   ```javascript
   export function formatOrderStatus(status) { ... }
   export function formatPaymentStatus(status) { ... }
   export function formatShippingMethod(method) { ... }
   ```

3. **`src/components/admin/AdminDashboard.vue`** – Új „Rendelések" kártya az admin dashboardon:
   - Ikon: `bi-box-seam-fill` (`text-info`)
   - Cím: „Rendelések"
   - Leírás: „Beérkező megrendelések kezelése"
   - Link: `/admin/orders`

4. **`src/views/CheckoutSuccessView.vue`** – Link hozzáadása a rendeléskövetéshez:
   ```html
   <router-link :to="'/rendeles-kovetes?orderId=' + order.id" class="btn btn-outline-secondary mt-2">
     <i class="bi bi-search me-1"></i>Rendelés nyomon követése
   </router-link>
   ```

### 6.2 Environment Variables

Nincs szükség új environment változókra.

### 6.3 Folder Structure

```
src/
├── components/
│   └── orders/
│       ├── OrderStatusBadge.vue       (NEW)
│       ├── OrderLookup.vue            (NEW)
│       └── AdminOrderList.vue         (NEW)
├── composables/
│   ├── useOrderLookup.js              (NEW)
│   └── useOrders.js                   (NEW)
├── services/
│   └── orderService.js                (EXTEND)
├── utils/
│   └── formatting.js                  (EXTEND)
└── views/
    ├── OrderTrackingView.vue          (NEW)
    └── AdminOrderListView.vue         (NEW)
```

---

## 7. UI/UX Guidelines

### 7.1 Publikus Rendeléskövetés Oldal

- **Layout:** Középre igazított card, max `col-lg-6` szélességben
- **Keresőmező:** Bootstrap `input-group` a gombbal
- **Eredmény kártya:** Bootstrap `card` shadow-sm, szekciókra bontva
- **Állapot megjelenítés:** Kiemelt `OrderStatusBadge` a kártya tetején
- **Tételek lista:** Egyszerű `list-group` vagy kis táblázat
- **Empty state / Error:** Bootstrap `alert` komponensek

### 7.2 Admin Rendelés Lista

Pontosan az `AdminContactList.vue` mintáját követi:

- **Desktop táblázat:** `table table-hover align-middle`, `table-responsive`, `d-none d-md-block`
- **Fejléc:** `text-center` `<th>` elemek
- **Olvasatlan sorok:** `fw-bold` class
- **Állapot badge-ek:** `OrderStatusBadge` komponens
- **Olvasottsági badge:** Zöld `bg-success` „Új" / szürke `bg-secondary` „Olvasott"
- **Műveletek:** `btn-group btn-group-sm` gomb-csoportban
- **Mobil accordion:** Bootstrap `accordion`, `accordion-item`, `accordion-button`, `accordion-collapse`
- **Accordion kinyitáskor:** Automatikus `markAsRead` hívás
- **Scoped CSS:** Azonos `@media (max-width: 767.98px)` szabályok mint az Üzeneteknél

### 7.3 Állapotváltó Dropdown

```html
<div class="dropdown d-inline-block">
  <button class="btn btn-sm btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
    Állapot
  </button>
  <ul class="dropdown-menu">
    <li v-for="s in availableStatuses" :key="s.value">
      <button class="dropdown-item" @click="changeStatus(order.id, s.value)">
        <OrderStatusBadge :status="s.value" /> {{ s.label }}
      </button>
    </li>
  </ul>
</div>
```

Az `availableStatuses` az aktuális állapotot kiszűri a listából.

### 7.4 Bootstrap Komponensek

- **Keresőform:** `input-group`, `form-control`, `btn btn-primary`
- **Eredménykártya:** `card`, `card-body`, `card-header`
- **Táblázat:** `table`, `table-hover`, `table-responsive`
- **Accordion:** `accordion`, `accordion-item`, `accordion-button`, `accordion-collapse`
- **Badge-ek:** `badge` + színváltozatok
- **Dropdown:** `dropdown`, `dropdown-toggle`, `dropdown-menu`, `dropdown-item`
- **Gombok:** `btn-group`, `btn-group-sm`, `btn-outline-*`
- **Spinner:** `spinner-border`
- **Alertek:** `alert alert-info`, `alert alert-danger`, `alert alert-warning`

---

## 8. Részletes Folyamatok

### 8.1 Publikus Rendeléskeresés Folyamata

1. Vásárló navigál a `/rendeles-kovetes` oldalra (vagy a sikeres fizetés oldalról a linkre kattint)
2. Ha van `?orderId=` query paraméter → automatikusan keres
3. Ha nincs → beviteli mező megjelenik
4. Beírja a rendelés azonosítóját → „Keresés" gomb
5. Kliens-oldali UUID validáció (regex: `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`)
6. Ha érvénytelen → inline hiba: „Érvénytelen rendelés azonosító formátum."
7. Ha érvényes → spinner, API hívás
8. Eredmény → részletek kártya megjelenik
9. Nem található → figyelmeztető alert

### 8.2 Admin Állapotváltás Folyamata

1. Admin az `/admin/orders` oldalon látja a rendelés listát
2. Egy rendelés sorában a dropdown gombra kattint
3. Kiválasztja az új állapotot
4. Optimisztikus lokális frissítés: a sor azonnal frissül
5. API hívás (`updateOrderStatus`)
6. Ha sikeres → kész
7. Ha hiba → revert a lokális állapotot, hibaüzenet

### 8.3 Mobil Accordion Részletek Betöltése

1. Admin kinyit egy accordion elemet
2. Automatikus `markAsRead` hívás
3. A rendelés alapadatai (a listában már betöltve) megjelennek
4. A tételek on-demand töltődnek: `fetchOrderWithItems(id)` hívás
5. Spinner a tételek betöltése közben
6. Tételek megjelennek lista formában

---

## 9. Testing Scenarios

### Scenario 1: Publikus – Sikeres keresés

1. Navigálj `/rendeles-kovetes` oldalra
2. Írd be egy létező rendelés UUID-jét
3. Kattints „Keresés"
4. Elvárt: Rendelés kártya megjelenik állapottal, tételekkel, szállítási adatokkal

### Scenario 2: Publikus – Automatikus keresés query paraméterrel

1. Navigálj `/rendeles-kovetes?orderId=valid-uuid`
2. Elvárt: Automatikusan keres és megjeleníti az eredményt

### Scenario 3: Publikus – Nem létező rendelés

1. Írd be egy nem létező UUID-t
2. Elvárt: „Nem találtunk rendelést ezzel az azonosítóval." figyelmeztető alert

### Scenario 4: Publikus – Érvénytelen formátum

1. Írj be véletlenszerű szöveget (nem UUID)
2. Elvárt: „Érvénytelen rendelés azonosító formátum." validációs hiba

### Scenario 5: Admin – Rendelés lista betöltése

1. Jelentkezz be adminként
2. Navigálj `/admin/orders` oldalra
3. Elvárt: Összes rendelés megjelenik, legújabb felül, olvasatlan badge látható

### Scenario 6: Admin – Állapotváltás

1. Kattints egy rendelés állapot dropdown-jára
2. Válaszd ki az „Szállítás alatt" opciót
3. Elvárt: Badge azonnal frissül `bg-primary` színnel és „Szállítás alatt" szöveggel

### Scenario 7: Admin – Olvasottra jelölés

1. Kattints az olvasatlan rendelés melletti pipa (`bi-check2`) gombra
2. Elvárt: Badge „Olvasott"-ra vált, olvasatlan számláló csökken

### Scenario 8: Admin – Mobil accordion

1. Nyisd meg az oldalt mobilon (< 768px)
2. Elvárt: Táblázat rejtett, accordion megjelenik
3. Kattints egy accordion fejlécre
4. Elvárt: Kinyílik a részletes nézet, automatikusan olvasottra jelöl

### Scenario 9: Admin – Üres lista

1. Nincs rendelés az adatbázisban
2. Elvárt: „Nincsenek beérkezett rendelések." info alert

### Scenario 10: Admin – Hálózati hiba

1. Szimulálj hálózati hibát
2. Elvárt: Hiba alert + „Újrapróbálkozás" gomb

---

## 10. Supabase RLS Policy-k

### Meglévő Policy-k (ellenőrizni):

| Tábla | Művelet | Jogosultság | Szükséges? |
|-------|---------|-------------|------------|
| `orders` | SELECT | Publikus (anon) | ✅ Igen – publikus kereséshez |
| `orders` | UPDATE | Authenticated | ✅ Igen – admin állapotváltáshoz |
| `order_items` | SELECT | Publikus (anon) | ✅ Igen – publikus tételek megjelenítéséhez |

> **Megjegyzés:** A publikus SELECT policy miatt bárki lekérhet bármely rendelést az UUID ismeretében. Ez elfogadható, mert az UUID nem kitalálható (128 bit entrópia), és nincs érzékeny adat (bankkártya stb.) a táblában. Ha szükséges, a jövőben korlátozható pl. email + orderId kombinált ellenőrzéssel.

---

## 11. Definition of Done (DoD)

### Functional DoD:

- [ ] Publikus `/rendeles-kovetes` oldal elérhető és működik
- [ ] Rendelés keresés UUID alapján működik
- [ ] Automatikus keresés `?orderId=` query paraméterrel
- [ ] UUID formátum validáció kliens oldalon
- [ ] „Nem található" és „Érvénytelen formátum" hibaüzenetek megjelennek
- [ ] Rendelés kártya: állapot badge, fizetési állapot, összeg, dátum, szállítás, tételek
- [ ] Admin `/admin/orders` oldal elérhető (auth guard)
- [ ] Admin rendelés lista (táblázat desktop, accordion mobil)
- [ ] Állapotváltó dropdown működik minden rendelésnél
- [ ] Olvasottá/olvasatlanná jelölés működik
- [ ] Olvasatlan számláló badge a fejlécben
- [ ] Mobil accordion kinyitáskor automatikus olvasottra jelölés
- [ ] Admin dashboard-on „Rendelések" kártya linkkel
- [ ] Sikeres fizetés oldalon „Rendelés nyomon követése" link

### Technical DoD:

- [ ] `orderService.js` bővítve: `fetchOrderWithItems`, `fetchAllOrders`, `updateOrderStatus`, `markOrderAsRead`, `markOrderAsUnread`
- [ ] `useOrderLookup.js` composable kész
- [ ] `useOrders.js` composable kész (useContacts mintája)
- [ ] `OrderStatusBadge.vue` komponens kész
- [ ] `OrderLookup.vue` komponens kész
- [ ] `AdminOrderList.vue` komponens kész (AdminContactList mintája)
- [ ] `OrderTrackingView.vue` és `AdminOrderListView.vue` nézetek készen
- [ ] Route-ok hozzáadva a routerhez
- [ ] `formatting.js` bővítve: `formatOrderStatus`, `formatPaymentStatus`, `formatShippingMethod`
- [ ] Nincs console error
- [ ] Responsive design (mobil/tablet/desktop)

---

## 12. Acceptance Criteria (Summary)

✅ **MUST Have:**

1. Publikus rendeléskeresés UUID alapján működik
2. Rendelés állapot és tételek megjelennek a keresés eredményeként
3. Admin rendelés lista az Üzenetek oldal mintájára (táblázat + accordion)
4. Állapotváltás dropdown működik (pending/confirmed/shipped/delivered/cancelled)
5. Olvasott/olvasatlan kezelés működik
6. Responsive design (mobil/tablet/desktop)
7. Sikeres fizetés oldalról link a rendeléskövetésre

✅ **SHOULD Have:**

1. Automatikus keresés query paraméterrel
2. UUID formátum validáció
3. Olvasatlan számláló badge
4. Admin dashboard kártya
5. On-demand tétel betöltés az accordion-ban

~ **Nice to Have:**

1. Szűrés állapot alapján az admin listán
2. Keresés vevő neve vagy email alapján
3. Rendelés export (CSV)
4. E-mail értesítés állapotváltáskor

---

## 13. File Summary

### New Files:

- `src/composables/useOrderLookup.js`
- `src/composables/useOrders.js`
- `src/components/orders/OrderStatusBadge.vue`
- `src/components/orders/OrderLookup.vue`
- `src/components/orders/AdminOrderList.vue`
- `src/views/OrderTrackingView.vue`
- `src/views/AdminOrderListView.vue`

### Extended Files:

- `src/services/orderService.js` (új admin függvények)
- `src/utils/formatting.js` (új formázó függvények)

### Modified Files:

- `src/router/index.js` (2 új route)
- `src/components/admin/AdminDashboard.vue` (új „Rendelések" kártya)
- `src/views/CheckoutSuccessView.vue` (rendeléskövetés link)
- `README.md` (feature lista frissítés)

---

## 14. Timeline & Effort

**Estimated Breakdown:**

- Service layer (4 új függvény + formatting): 30 min
- Composables (useOrderLookup + useOrders): 30 min
- OrderStatusBadge + OrderLookup komponensek: 45 min
- AdminOrderList komponens (táblázat + accordion + dropdown): 60 min
- Views + Routing + Dashboard kártya: 20 min
- CheckoutSuccessView link + integráció: 10 min
- Testing + responsive fixes: 30 min
- **Total: ~3.5–4 hours**

---

## 15. Go/No-Go Check

Before starting Increment 13:

- ✅ Increment 12 (Webshop Kosár & Checkout) complete + working
- ✅ `orders` + `order_items` táblák léteznek a megfelelő mezőkkel
- ✅ `is_read` és `status` mezők az `orders` táblában
- ✅ Supabase RLS policy-k: publikus SELECT, admin UPDATE az `orders` táblán
- ✅ `AdminContactList.vue` minta elérhető referenciának
- ✅ `useContacts.js` composable minta elérhető referenciának
- ✅ `contactService.js` upsert minta elérhető referenciának

---

## 16. Sign-Off Criteria

Increment 13 is **complete** when:

✅ Publikus `/rendeles-kovetes` oldal működik UUID keresővel
✅ Admin `/admin/orders` oldal működik rendelés listával
✅ Állapotváltó dropdown az összes állapottal
✅ Olvasott/olvasatlan kezelés azonos az Üzenetekkel
✅ Desktop táblázat + mobil accordion elrendezés
✅ Sikeres fizetés oldalon rendeléskövetés link
✅ Admin dashboard-on „Rendelések" kártya
✅ Responsive design (mobil/tablet/desktop)
✅ No TypeScript / no tests / minimal CSS
✅ README.md updated
✅ Code compiles without errors

**Ready to merge when:** All above ✅ + QA testing passed.
