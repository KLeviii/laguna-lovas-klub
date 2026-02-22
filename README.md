# Laguna Lovasklub

Single-page alkalmazás a Laguna Lovasklub weboldalához, Vue 3 + Supabase alapon.

## Funkciók

- Klubinformációk, szolgáltatások és versenynapló főoldalon
- Lovak nyilvános listázása szűréssel (összes / eladó)
- Ló részletoldal képgalériával és származási adatokkal
- Webshop termékkatalógus kategóriaszűréssel
- Termék részletoldal kapcsolódó termékekkel
- Admin felület lovak és termékek CRUD kezeléséhez (képfeltöltéssel)
- Supabase Auth alapú adminisztrátori bejelentkezés
- Sötét / világos téma localStorage-sel

## Oldalak

| Útvonal | Leírás |
|---------|--------|
| `/` | Főoldal – rólunk, szolgáltatások, versenyek |
| `/lovaink` | Lovak listája szűrési lehetőséggel |
| `/lovaink/:id` | Ló részletei – képgaléria, származás |
| `/webshop` | Termékkatalógus kategóriaszűréssel |
| `/webshop/:id` | Termék részletei – leírás, kapcsolódó termékek |
| `/eredmenyeink` | Versenystatisztikák és eredmények |
| `/admin/login` | Adminisztrátori bejelentkezés |
| `/admin` | Admin dashboard |
| `/admin/horses` | Lovak kezelése (CRUD, képfeltöltés) |
| `/admin/products` | Termékek és kategóriák kezelése (CRUD, képfeltöltés) |

## Stack

- **Vue 3.5** – Composition API, `<script setup>`
- **Vue Router 4.6** – hash-alapú routing, navigációs guard
- **Bootstrap 5.3** – utility-first CSS, Bootstrap Icons (CDN)
- **Supabase** – adatbázis, auth, storage
- **Vite 7** – fejlesztői szerver és build

## Könyvtárstruktúra

```
src/
├── components/
│   ├── pages/          # Útvonalhoz kötött oldalkomponensek
│   ├── admin/          # Admin layout és dashboard
│   ├── horses/         # Ló-specifikus komponensek
│   ├── products/       # Termék admin komponensek
│   └── webshop/        # Webshop megjelenítő komponensek
├── composables/        # Üzleti logika (useAuth, useHorses, useProducts, …)
├── services/           # Supabase adathozzáférési réteg + supabase.js kliens
├── utils/              # Segédfüggvények (formatting.js)
├── views/              # Vékony route-view komponensek
├── router/index.js
└── main.js
```

## Környezeti változók

Másold a `.env.example` fájlt `.env`-re és töltsd ki:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Fejlesztői indítás

```bash
npm install
cp .env.example .env   # töltsd ki a Supabase adatokat
npm run dev
```

## Kapcsolat

- Email: lagunalovasklub@gmail.com
- Telefon: +36 20 981 3383
- Cím: 2832, Héreg, Laguna Lovasklub
- Facebook: https://www.facebook.com/lagunalovasklubkft
- Instagram: https://www.instagram.com/laguna_lovasklub_kft/

© 2025 Laguna Lovasklub Kft.
