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

## 3. Simple Pay – Fizetési átirányítás

### 3.1 Üzleti előfeltételek

| Lépés | Részletek |
|-------|-----------|
| Szerződéskötés | OTP Mobil Kft.-vel (SimplePay merchant szerződés) |
| Credentials | `merchant` kód + `secret_key` (CSAK backend oldalon tárolható!) |
| Sandbox | Tesztkörnyezet elérhető a [SimplePay fejlesztői portálon](https://simplepay.hu/fejlesztoknek/) |

### 3.2 Integrációs folyamat

```
Vevő a "Tovább a fizetéshez" gombra kattint
    │
    │  POST /functions/v1/simplepay-start
    │  { order_id, amount, customer_email }
    ▼
Supabase Edge Function
    │  – SimplePay START API (POST) hívása
    │  – Fizetési URL visszakapása
    ▼
Frontend: átirányítás → SimplePay hosted oldal
    │
    │  Vevő megadja bankkártya adatait (OTP oldalán)
    ▼
SimplePay visszairányít:
    ├── Sikeres: /penztar/sikeres?r=...
    └── Sikertelen: /penztar/sikertelen?r=...
    │
    │  IPN (Instant Payment Notification) webhook
    ▼
Supabase Edge Function: simplepay-ipn
    │  – Aláírás ellenőrzés
    │  – orders.status frissítése → 'confirmed'
    └── orders.payment_status → 'paid'
```

### 3.3 Szükséges jövőbeli DB változás

```sql
ALTER TABLE orders
  ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN simplepay_transaction_id TEXT;
-- payment_status értékek: 'pending' | 'paid' | 'failed' | 'refunded'
```

### 3.4 Szükséges új route-ok

| Route | Komponens | Cél |
|-------|-----------|-----|
| `/penztar/sikeres` | `CheckoutSuccessView.vue` | Sikeres fizetés visszajelzés |
| `/penztar/sikertelen` | `CheckoutFailView.vue` | Sikertelen fizetés visszajelzés |

### 3.5 Megvalósítási lépések (jövőbeli sprint)

1. SimplePay merchant szerződés megkötése
2. Sandbox credential-ek → `.env` (csak backend)
3. Supabase Edge Function: `simplepay-start` (fizetés indítása)
4. Supabase Edge Function: `simplepay-ipn` (webhook feldolgozása)
5. Success / Fail visszajelző oldalak létrehozása
6. Sandbox tesztelés → Production aktiválás

---

## 4. Env változók (jövőbeli kiegészítések)

```env
# .env.example – csak placeholderek!

# Magyar Posta MPL (csak Supabase Edge Function secrets-ben tárolni!)
MPL_CLIENT_ID=
MPL_CLIENT_SECRET=
MPL_ENV=sandbox  # sandbox | production

# Simple Pay (csak Supabase Edge Function secrets-ben tárolni!)
SIMPLEPAY_MERCHANT=
SIMPLEPAY_SECRET_KEY=
SIMPLEPAY_ENV=sandbox  # sandbox | production
SIMPLEPAY_SUCCESS_URL=https://your-domain.hu/penztar/sikeres
SIMPLEPAY_FAIL_URL=https://your-domain.hu/penztar/sikertelen
SIMPLEPAY_IPN_URL=https://your-project.supabase.co/functions/v1/simplepay-ipn
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
