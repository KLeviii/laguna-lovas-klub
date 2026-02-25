# Adatbázis Séma Specifikáció

## 1. Lovak (`horses`)

| Mező | Típus | Kötelező | Leírás |
|------|-------|----------|--------|
| id | UUID | ✅ | Primary key |
| name | TEXT | ✅ | Ló neve |
| gender | TEXT | ✅ | 'male' / 'female' |
| birth_date | DATE | ❌ | Születési idő |
| breed | TEXT | ❌ | Fajta |
| description | TEXT | ❌ | Részletes leírás |
| is_for_sale | BOOLEAN | ✅ | Eladó-e (default: false) |
| price_huf | INTEGER | ❌ | Ár (HUF) |
| main_img_url | TEXT | ❌ | Fő kép URL |
| sire_id | UUID | ❌ | Foreign key -> horses.id |
| dam_id | UUID | ❌ | Foreign key -> horses.id |
| created_at | TIMESTAMP | ✅ | Auto |
| updated_at | TIMESTAMP | ✅ | Auto |

## 2. Ló Képek (`horse_images`)

| Mező | Típus | Kötelező | Leírás |
|------|-------|----------|--------|
| id | UUID | ✅ | Primary key |
| horse_id | UUID | ✅ | Foreign key -> horses.id |
| image_url | TEXT | ✅ | Supabase Storage URL |
| caption | TEXT | ❌ | Kép leírás |
| display_order | INTEGER | ✅ | Megjelenítési sorrend |
| created_at | TIMESTAMP | ✅ | Auto |

## 3. Webshop Kategóriák (`product_categories`)

| Mező | Típus | Kötelező | Leírás |
|------|-------|----------|--------|
| id | UUID | ✅ | Primary key |
| name | TEXT | ✅ | Kategória név |
| slug | TEXT | ✅ | URL-barát azonosító |
| description | TEXT | ❌ | Leírás |
| display_order | INTEGER | ✅ | Sorrend |
| created_at | TIMESTAMP | ✅ | Auto |

## 4. Webshop Termékek (`products`)

| Mező | Típus | Kötelező | Leírás |
|------|-------|----------|--------|
| id | UUID | ✅ | Primary key |
| category_id | UUID | ✅ | Foreign key -> product_categories.id |
| name | TEXT | ✅ | Termék név |
| description | TEXT | ❌ | Részletes leírás |
| price_huf | INTEGER | ✅ | Ár (HUF) |
| image_url | TEXT | ❌ | Termék kép URL |
| stock | INTEGER | ✅ | Készlet mennyiség (default: 0) |
| is_available | BOOLEAN | ✅ | Elérhető-e (automatikus: stock > 0) |
| created_at | TIMESTAMP | ✅ | Auto |
| updated_at | TIMESTAMP | ✅ | Auto |

## 5. Versenyek (`competitions`)

| Mező | Típus | Kötelező | Leírás |
|------|-------|----------|--------|
| id | UUID | ✅ | Primary key |
| name | TEXT | ✅ | Verseny neve |
| location | TEXT | ✅ | Helyszín |
| start_date | DATE | ✅ | Kezdés dátuma |
| end_date | DATE | ❌ | Befejezés dátuma |
| image_url | TEXT | ❌ | Verseny borítókép |
| description | TEXT | ❌ | Leírás |
| created_at | TIMESTAMP | ✅ | Auto |

## 6. Versenyeredmények (`competition_results`)

| Mező | Típus | Kötelező | Leírás |
|------|-------|----------|--------|
| id | UUID | ✅ | Primary key |
| competition_id | UUID | ✅ | Foreign key -> competitions.id |
| horse_id | UUID | ❌ | Foreign key -> horses.id |
| jockey_name | TEXT | ✅ | Lovas neve |
| discipline | TEXT | ✅ | Szakág (pl. 'díjugratás') |
| placement | INTEGER | ❌ | Helyezés |
| achievement | TEXT | ❌ | Eredmény leírása |
| created_at | TIMESTAMP | ✅ | Auto |

## 7. Kapcsolatfelvételi Űrlapok (`contact_submissions`)

| Mező | Típus | Kötelező | Leírás |
|------|-------|----------|--------|
| id | UUID | ✅ | Primary key |
| name | TEXT | ✅ | Név |
| email | TEXT | ✅ | Email cím |
| phone | TEXT | ❌ | Telefonszám |
| message | TEXT | ✅ | Üzenet |
| is_read | BOOLEAN | ✅ | Olvasva (default: false) |
| created_at | TIMESTAMP | ✅ | Auto |

## 8. Rendelések (`orders`)

| Mező | Típus | Kötelező | Leírás |
|------|-------|----------|--------|
| id | UUID | ✅ | Primary key |
| customer_name | TEXT | ✅ | Vevő neve |
| customer_email | TEXT | ✅ | Vevő e-mail |
| customer_phone | TEXT | ❌ | Vevő telefonszáma |
| shipping_name | TEXT | ✅ | Szállítási teljes név |
| shipping_zip | TEXT | ✅ | Irányítószám |
| shipping_city | TEXT | ✅ | Város |
| shipping_address | TEXT | ✅ | Utca, házszám |
| shipping_country | TEXT | ✅ | Ország (default: 'Magyarország') |
| notes | TEXT | ❌ | Megjegyzés a rendeléshez |
| status | TEXT | ✅ | 'pending' / 'confirmed' / 'shipped' / 'delivered' / 'cancelled' (default: 'pending') |
| total_amount_huf | INTEGER | ✅ | Végösszeg (HUF) |
| is_read | BOOLEAN | ✅ | Admin olvasta-e (default: false) |
| created_at | TIMESTAMP | ✅ | Auto |
| updated_at | TIMESTAMP | ✅ | Auto |

## 9. Rendelés Tételek (`order_items`)

| Mező | Típus | Kötelező | Leírás |
|------|-------|----------|--------|
| id | UUID | ✅ | Primary key |
| order_id | UUID | ✅ | Foreign key -> orders.id (CASCADE DELETE) |
| product_id | UUID | ❌ | Foreign key -> products.id (SET NULL on delete) |
| product_name | TEXT | ✅ | Termék neve a rendelés pillanatában (snapshot) |
| unit_price_huf | INTEGER | ✅ | Egységár a rendelés pillanatában (snapshot) |
| quantity | INTEGER | ✅ | Mennyiség |
| created_at | TIMESTAMP | ✅ | Auto |

> **Megjegyzés:** `product_name` és `unit_price_huf` snapshot értékek – ha a terméket később módosítják vagy törlik, a rendelés adatai megmaradnak.

## 10. Admin Felhasználók

**Supabase Auth táblát használjuk**, saját user tábla nem szükséges.

Metaadat tárolás `auth.users` táblában:
```json
{
  "role": "admin",
  "full_name": "Név"
}
```

## Kapcsolatok

```
horses.father_id -> horses.id (self-reference)
horses.mother_id -> horses.id (self-reference)

horse_images.horse_id -> horses.id (1:N)

products.category_id -> product_categories.id (N:1)

competition_results.competition_id -> competitions.id (N:1)
competition_results.horse_id -> horses.id (N:1)

orders.id <- order_items.order_id (1:N, CASCADE DELETE)
order_items.product_id -> products.id (N:1, SET NULL on delete)
```

## Supabase RLS Policy-k (Rendelések)

| Tábla | Művelet | Jogosultság |
|-------|---------|-------------|
| `orders` | INSERT | Publikus (anonim is rendelhet) |
| `orders` | SELECT / UPDATE / DELETE | Csak hitelesített admin |
| `order_items` | INSERT | Publikus (order_id-vel együtt) |
| `order_items` | SELECT / UPDATE / DELETE | Csak hitelesített admin |

## Storage Buckets

1. **horse-images** - Lovak képei (public read)
2. **competition-images** - Verseny fotók (public read)
3. **product-images** - Termék képek (public read)
