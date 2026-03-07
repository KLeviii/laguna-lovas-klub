# Futárszolgálat Integráció – Specifikáció

## Összefoglalás

Ez a dokumentum leírja, hogy a Laguna Lovasklub webshopjának milyen adatokat kell kommunikálnia a futárszolgálatokkal, és milyen lépések szükségesek a teljes integráció megvalósításához.

---

## 1. Magyar Posta (MPL) – Magyar Posta Logisztika

### 1.1 Üzleti előfeltételek

| Lépés | Részletek |
|-------|-----------|
| Szerződéskötés | Kereskedői szerződés igénylése a Magyar Postától (MPL üzleti csomag) |
| Regisztráció | [devportal.posta.hu](https://devportal.posta.hu) – fejlesztői fiók létrehozása |
| Credential-ek | Két környezet: **Sandbox** (tesztelés) + **Production** (éles) |
| API hozzáférés | `client_id` + `client_secret` párja mindkét környezethez |

### 1.2 Technikai integráció

- **Protokoll:** REST API v2, HTTPS
- **Hitelesítés:** OAuth2 (Bearer token, client_credentials grant)
- **Token URL:** `https://auth.posta.hu/...` (a devportal dokumentációjában)

#### Főbb végpontok

| Végpont | Metódus | Leírás |
|---------|---------|--------|
| `/v2/parcels` | POST | Új szállítmány feladása |
| `/v2/parcels/{id}` | GET | Szállítmány adatainak lekérése |
| `/v2/parcels/{id}/label` | GET | Cimke generálása (PDF) |
| `/v2/parcels/{id}/tracking` | GET | Nyomkövetési státusz |

### 1.3 Kötelező adatok szállítmányonként

| Mező | Forrás az `orders` táblából | Megjegyzés |
|------|-----------------------------|------------|
| Átvevő neve | `shipping_name` | Teljes név |
| Irányítószám | `shipping_zip` | 4 jegyű magyar irányítószám |
| Város | `shipping_city` | |
| Utca, házszám | `shipping_address` | |
| Ország | `shipping_country` | Default: `Magyarország` |
| E-mail | `customer_email` | Értesítő e-mail az átvevőnek |
| Telefon | `customer_phone` | Opcionális, de ajánlott |
| Referencia szám | `orders.id` | Rendelés egyedi azonosítója |
| Csomag tömeg (kg) | — | Termékenként előre meghatározva |
| Csomag méretek (cm) | — | H × Sz × M, termékenként becsülve |
| Szolgáltatás típusa | — | `HOME_DELIVERY` / `PARCEL_LOCKER` |

> **Megjegyzés a tömegről és méretekről:** A `products` táblában jelenleg nincs `weight_kg` és `dimensions_cm` mező. A teljes MPL integráció előtt ezeket fel kell venni a termék adatmodelljébe.

### 1.4 API válasz – visszakapott adatok

| Mező | Leírás | Elmentési hely |
|------|--------|----------------|
| `tracking_number` | MPL csomagkövetési szám | `orders.tracking_number` (új mező) |
| `label_url` / PDF binary | Nyomtatható cimke | Letöltés admin felületen |

### 1.5 Ajánlott megvalósítási architektúra

> **FONTOS:** Az MPL API `client_secret` soha nem kerülhet a frontend kódjába. Az összes MPL API hívást **Supabase Edge Function**-ön keresztül kell végrehajtani.

```
Webshop frontend
    │
    │  POST /functions/v1/create-shipment
    │  { order_id }
    ▼
Supabase Edge Function (server-side)
    │  – MPL OAuth2 token lekérés
    │  – POST /v2/parcels
    │  – tracking_number visszaírása az orders táblába
    ▼
Magyar Posta MPL API
```

### 1.6 Szükséges jövőbeli DB változások

```sql
-- Termékek bővítése (tömeg/méret az MPL-hez)
ALTER TABLE products
  ADD COLUMN weight_kg    NUMERIC(6,3),
  ADD COLUMN length_cm    INTEGER,
  ADD COLUMN width_cm     INTEGER,
  ADD COLUMN height_cm    INTEGER;

-- Rendelések bővítése (tracking)
ALTER TABLE orders
  ADD COLUMN tracking_number TEXT;
```

### 1.7 Megvalósítási lépések (jövőbeli sprint)

1. Szerződéskötés Magyar Postával
2. Sandbox credential-ek megszerzése → `.env`-be mentés (CSAK backend oldalon)
3. `products` tábla bővítése tömeg/méret mezőkkel
4. Admin felületen tömeg/méret szerkeszthetővé tétele
5. Supabase Edge Function írása: `create-shipment`
6. Order leadáskor Edge Function hívása → tracking_number visszaírása
7. Admin felületen tracking szám + cimke megjelenítése
8. Sandbox tesztelés → Production váltás

---

## 2. Saját szállítás (céges kiszállítás)

### Leírás

A cég saját járművel szállítja ki a rendelést. Nincs külső API integráció.

### Folyamat

1. Rendelés beérkezik → admin értesítés
2. Admin manuálisan összeállítja a csomagot
3. Admin a rendelést `shipped` státuszra állítja az admin felületen
4. Opcionális: értesítő e-mail küldése a vevőnek (jövőbeli feature)

### Adminisztrációs igény

Az admin felületen az orders management oldalon legyen látható a `shipping_method` értéke, hogy az adminisztrátor tudja, melyik rendelést kell saját járművel kiszállítani.

---

## 3. Barion – Fizetési átirányítás

### 3.1 Üzleti előfeltételek

| Lépés | Részletek |
|-------|-----------|
| Regisztráció | Barion merchant fiók létrehozása: [barion.com](https://www.barion.com) |
| Szerződéskötés | Barion Payment Zrt. általános szerződési feltételek elfogadása |
| Credentials | `POSKey` – az üzlethez tartozó egyedi titkos kulcs (CSAK backend oldalon tárolható!) |
| Fejlesztői portál | [developers.barion.com](https://developers.barion.com) – API dokumentáció és sandbox |
| Tesztkörnyezet | Külön teszt `POSKey` a sandbox fiókhoz (lásd 6. szekció) |

### 3.2 Technikai integráció

- **Protokoll:** REST API v2, HTTPS
- **Hitelesítés:** `POSKey` minden API hívásban request body-ban
- **Fizetés indítása:** `POST https://api.barion.com/v2/Payment/Start`
- **Teszt API URL:** `https://api.test.barion.com/v2/Payment/Start`

#### Visszakapott azonosítók

| Mező | Leírás |
|------|--------|
| `PaymentId` | Barion belső tranzakcióazonosító – elmentendő az `orders` táblába |
| `PaymentRequestId` | A kereskedő által küldött egyedi azonosító (pl. `orders.id`) |
| `GatewayUrl` | A Barion hosted fizetési oldal URL-je, ahova a vevőt át kell irányítani |

### 3.3 Integrációs folyamat

```
Vevő a "Tovább a fizetéshez" gombra kattint
    │
    │  POST /functions/v1/barion-start
    │  { order_id, amount, customer_email }
    ▼
Supabase Edge Function
    │  – POST https://api.barion.com/v2/Payment/Start
    │    (vagy test.barion.com tesztkörnyezetben)
    │  – GatewayUrl visszakapása
    │  – barion_payment_id elmentése az orders táblába
    ▼
Frontend: átirányítás → Barion hosted fizetési oldal
    │
    │  Vevő megadja bankkártya / Barion fiók adatait
    ▼
Barion visszairányít:
    ├── Sikeres: /penztar/sikeres?paymentId=...
    └── Sikertelen: /penztar/sikertelen?paymentId=...
    │
    │  Callback (webhook) – Barion értesíti a szervert
    ▼
Supabase Edge Function: barion-callback
    │  – PaymentId alapján státusz lekérése Bariontól
    │    (GET /v2/Payment/GetPaymentState)
    │  – orders.status frissítése → 'confirmed'
    └── orders.payment_status → 'paid'
```

> **FONTOS:** A visszairányítási URL-ek (`RedirectUrl`) csak tájékoztató jellegűek a felhasználó számára. A fizetés tényleges visszaigazolása mindig a **callback webhook**-on keresztül történjen, mert a böngészős visszairányítás manipulálható.

### 3.4 Szükséges jövőbeli DB változás

```sql
ALTER TABLE orders
  ADD COLUMN payment_status    TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN barion_payment_id TEXT;
-- payment_status értékek: 'pending' | 'paid' | 'failed' | 'refunded'
```

### 3.5 Szükséges új route-ok

| Route | Komponens | Cél |
|-------|-----------|-----|
| `/penztar/sikeres` | `CheckoutSuccessView.vue` | Sikeres fizetés visszajelzés |
| `/penztar/sikertelen` | `CheckoutFailView.vue` | Sikertelen fizetés visszajelzés |

### 3.6 Barion Pixel (opcionális)

A Barion Pixel egy JavaScript snippet, amelyet a frontend oldalakra lehet beágyazni konverziókövetés céljából. Nem kötelező az alap integrációhoz, de a Barion ajánlja. Implementálása csak explicit ügyfélkérésre szükséges.

### 3.7 Megvalósítási lépések (jövőbeli sprint)

1. Barion teszt fiók és teszt `POSKey` megszerzése (lásd 6. szekció)
2. Sandbox credential-ek → Supabase Edge Function secrets (CSAK ott!)
3. Supabase Edge Function: `barion-start` (fizetés indítása)
4. Supabase Edge Function: `barion-callback` (webhook feldolgozása, státusz ellenőrzés)
5. Success / Fail visszajelző oldalak létrehozása
6. Sandbox tesztelés teszt kártyaadatokkal
7. Élesítés az ügyfél merchant fiókjával (lásd 6. szekció)

---

## 4. Env változók (jövőbeli kiegészítések)

```env
# .env.example – csak placeholderek!

# Magyar Posta MPL (csak Supabase Edge Function secrets-ben tárolni!)
MPL_CLIENT_ID=
MPL_CLIENT_SECRET=
MPL_ENV=sandbox  # sandbox | production

# Barion (csak Supabase Edge Function secrets-ben tárolni!)
BARION_POS_KEY=
BARION_ENV=test  # test | live
BARION_SUCCESS_URL=https://your-domain.hu/penztar/sikeres
BARION_FAIL_URL=https://your-domain.hu/penztar/sikertelen
BARION_CALLBACK_URL=https://your-project.supabase.co/functions/v1/barion-callback
```

> **FONTOS:** Ezek a változók **soha nem kerülhetnek** a `VITE_` prefixű `.env` változók közé, mert akkor a böngészőben is láthatók lennének. Kizárólag Supabase Edge Function titkos környezeti változókként tárolhatók.

---

## 5. Összefoglaló: Mit kell kommunikálni a futárszolgálattal

| Adat | Kötelező | Forrás |
|------|----------|--------|
| Átvevő neve + cím | ✅ | `orders` tábla `shipping_*` mezői |
| Csomag tömege (kg) | ✅ | `products.weight_kg` (felveendő mező) |
| Csomag méretei (cm) | ✅ (MPL-nél) | `products.*_cm` (felveendő mezők) |
| E-mail / telefon | Ajánlott | `orders.customer_email` / `customer_phone` |
| Megrendelés ref. száma | ✅ | `orders.id` |
| Szolgáltatás típusa | ✅ | `HOME_DELIVERY` (házhozszállítás) |
| Visszaigazolás | ✅ | MPL visszaadja: `tracking_number` + PDF cimke |
| Barion fizetési azonosító | ✅ | `orders.barion_payment_id` |

---

## 6. Barion tesztkörnyezet és élesítés

### 6.1 Tesztkörnyezet felállítása (fejlesztés alatt)

A fejlesztés teljes ideje alatt a **fejlesztő saját Barion teszt fiókja** használandó. Az ügyfél nem vesz részt ebben a fázisban.

**Lépések:**

1. Regisztráció a [Barion fejlesztői portálon](https://developers.barion.com)
2. Teszt bolt (POS) létrehozása a Barion admin felületen
3. A teszt bolt `POSKey` értékének kimásolása
4. A `POSKey` beállítása a Supabase projekt Edge Function secrets-ébe:
   - Supabase Dashboard → Project → Edge Functions → Secrets
   - `BARION_POS_KEY` = teszt POSKey értéke
   - `BARION_ENV` = `test`
5. Az API hívások a teszt URL-re mutatnak: `https://api.test.barion.com`

**Barion teszt bankkártya adatok** (a Barion dokumentációjában részletezve):

| Mező | Érték |
|------|-------|
| Kártyaszám | Barion által biztosított teszt számok |
| Lejárat | Bármely jövőbeli dátum |
| CVV | Bármely 3 jegyű szám |
| 3DS kód | `123456` (teszt OTP) |

> A pontos teszt kártyaszámokat a [Barion fejlesztői dokumentáció](https://developers.barion.com) tartalmazza.

### 6.2 Élesítés – átállás az ügyfél fiókjára

Az élesítés előtt az ügyfélnek el kell végeznie a következőket:

**Ügyfél feladatai:**
1. Saját Barion merchant fiók regisztrálása: [barion.com](https://www.barion.com)
2. Barion szerződési feltételek elfogadása, azonosítás elvégzése
3. Éles bolt (POS) létrehozása és az éles `POSKey` megszerzése
4. A `POSKey` biztonságos átadása a fejlesztőnek (pl. titkosított csatornán)

**Fejlesztő feladatai (élesítéskor):**
1. Supabase Dashboard → Edge Functions → Secrets frissítése:
   - `BARION_POS_KEY` = ügyfél éles POSKey értéke
   - `BARION_ENV` = `live`
2. Az API URL automatikusan vált: `https://api.barion.com` (a kódban `BARION_ENV` alapján)
3. `BARION_SUCCESS_URL`, `BARION_FAIL_URL`, `BARION_CALLBACK_URL` frissítése az éles domain-re
4. Egy teszt tranzakció elvégzése éles módban kis összeggel
5. A teszt összeg visszatérítése a Barion admin felületen

### 6.3 Felelősségi határok

| Felelősség | Developer | Ügyfél |
|------------|-----------|--------|
| Barion teszt fiók és integráció | ✅ | — |
| Barion merchant fiók regisztráció | — | ✅ |
| Éles POSKey kezelése | csak Supabase secrets-ben | átadja a developernek |
| Supabase secrets frissítése élesítéskor | ✅ | — |
| Barion szerződés és megfelelés | — | ✅ |
| Visszatérítések kezelése (Barion admin) | — | ✅ |

> **Biztonsági megjegyzés:** Az éles `POSKey` soha nem kerülhet forráskódba, `.env` fájlba vagy git repóba. Kizárólag a Supabase projekt titkos environment variable-jei között tárolható.

### 6.4 Kód módosítás tesztkörnyezet ↔ éles között

Az átálláshoz **semmilyen kódmódosítás nem szükséges** – a váltás kizárólag Supabase secrets frissítésével történik:

```
BARION_POS_KEY  →  ügyfél éles POSKey-je
BARION_ENV      →  live
BARION_*_URL    →  éles domain URL-ek
```

Az Edge Function kódban az API URL feltételes:

```js
const BARION_API = Deno.env.get('BARION_ENV') === 'live'
  ? 'https://api.barion.com'
  : 'https://api.test.barion.com'
```
