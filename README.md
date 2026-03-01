# Laguna Lovasklub

Single-page alkalmazás a Laguna Lovasklub weboldalához, Vue 3 + Supabase alapon.

## Funkciók

- Klubinformációk, szolgáltatások és versenynapló főoldalon
- Lovak nyilvános listázása szűréssel (összes / eladó)
- Ló részletoldal képgalériával és származási adatokkal
- Interaktív családfa (pedigree) popup zoomolható/pannolható flowchart-tal (vue-flow)
- Webshop termékkatalógus kategóriaszűréssel
- Termék részletoldal kapcsolódó termékekkel
- Kosár rendszer készletkezeléssel (localStorage alapú)
- Kosár ikon hover tooltippel a headerben
- Kosár oldal ajánlott termékekkel
- Pénztár oldal (szállítás/fizetés hamarosan)
- Kapcsolat oldal űrlappal (GDPR hozzájárulás checkbox-szal)
- Admin felület lovak, termékek, kategóriák és üzenetek CRUD kezeléséhez (képfeltöltéssel, 4-fülös felület, készletkezelés)
- Supabase Auth alapú adminisztrátori bejelentkezés
- Sötét / világos téma localStorage-sel
- Adatvédelmi nyilatkozat oldal (GDPR megfelelőség)
- SEO: dinamikus oldalcímek és meta leírások (useHead composable)
- SEO: Open Graph meta tagek, robots.txt, history-alapú routing
- SEO: Route-szintű kódsplit (lazy loading) a jobb teljesítményért
- Akadálymentesítés: skip navigáció, aria-live régiók, aria-labelek, scope attribútumok, lazy képek
- 190 unit teszt (Vitest) — composable-ök, service-ek, utils

## Oldalak

| Útvonal | Leírás |
|---------|--------|
| `/` | Főoldal – rólunk, szolgáltatások, versenyek |
| `/lovaink` | Lovak listája szűrési lehetőséggel |
| `/lovaink/:id` | Ló részletei – képgaléria, származás |
| `/webshop` | Termékkatalógus kategóriaszűréssel |
| `/webshop/:id` | Termék részletei – leírás, kapcsolódó termékek |
| `/kosar` | Kosár – tételek kezelése, ajánlott termékek |
| `/penztar` | Pénztár – rendelés összesítő, szállítás/fizetés (hamarosan) |
| `/eredmenyeink` | Versenystatisztikák és eredmények |
| `/kapcsolat` | Kapcsolat űrlap |
| `/adatvedelem` | Adatvédelmi nyilatkozat |
| `/admin/login` | Adminisztrátori bejelentkezés |
| `/admin` | Admin dashboard |
| `/admin/horses` | Lovak kezelése (CRUD, képfeltöltés) |
| `/admin/products` | Termékek kezelése (CRUD, képfeltöltés) |
| `/admin/products/categories` | Kategóriák kezelése (CRUD) |
| `/admin/contacts` | Beérkezett üzenetek kezelése |

## Stack

- **Vue 3.5** – Composition API, `<script setup>`
- **Vue Router 4.6** – history-alapú routing, navigációs guard, route-szintű kódsplit
- **Bootstrap 5.3** – utility-first CSS, Bootstrap Icons (CDN)
- **Supabase** – adatbázis, auth, storage
- **Vite 7** – fejlesztői szerver és build
- **Vitest** – unit tesztelés

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
├── utils/              # Segédfüggvények (formatting, fileUpload, pedigreeTree)
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
npm run test           # unit tesztek futtatása
```

## Kapcsolat

- Email: lagunalovasklub@gmail.com
- Telefon: +36 20 981 3383
- Cím: 2832, Héreg, Laguna Lovasklub
- Facebook: https://www.facebook.com/lagunalovasklubkft
- Instagram: https://www.instagram.com/laguna_lovasklub_kft/

© 2025 Laguna Lovasklub Kft.
