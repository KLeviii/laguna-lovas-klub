# Laguna Lovasklub Vue.js Alkalmazás

Ez a projekt a Laguna Lovasklub weboldalának Vue.js alapú single-page application (SPA) változata.

## Funkciók

- **Single Page Application**: Gyors navigáció oldalak között újratöltés nélkül
- **Vue Router**: Történetalapú URL kezelés
- **Komponens alapú architektúra**: Újrafelhasználható komponensek (Header, Footer)
- **Reaktív adatkezelés**: Vue 3 Composition API
- **Bootstrap 5 integráció**: Modern, reszponzív design
- **Bootstrap Icons**: Gazdag ikonkészlet
- **Lovak megjelenítése**: Dinamikus, adatbázisból betöltött lovak listázása szűrési lehetőséggel
- **Lovak részletei**: Egyedi oldal minden lóhoz származási adatokkal, képgalériával
- **Lovak admin kezelése**: Teljes CRUD (Create/Read/Update/Delete) interface adminisztrátoroknak
- **Képkezelés**: Feltöltés, törlés, átrendezés, alt szöveg szerkesztés
- **Webshop terméklistázás**: Nyilvános termékkatalógus kategóriaszűréssel, ár és elérhetőség megjelenítéssel
- **Webshop termék részletoldal**: Teljes termék leírás, kategoría, elérhetőség status, kapcsolódó termékek
- **Webshop szűrés**: Termékek szűrése kategória alapján
- **Webshop admin kezelés**: Teljes CRUD termékekhez és kategóriákhoz, képfeltöltés, elérhetőség kezelés
- **Supabase integráció**: Adatbázis kapcsolat lovak, képek és termékek kezeléséhez
- **Admin bejelentkezés**: Supabase Auth integráció, session management

## Oldalak

1. **Rólunk** (`/`) - Főoldal klubinformációkkal, szolgáltatásokkal és versenyekkel
2. **Webshop** (`/webshop`) - Dinamikus termékkatalógus Supabase integrációval, kategóriaszűréssel, ár és elérhetőség megjelenítéssel
3. **Webshop termék részletei** (`/webshop/:id`) - Teljes termék leírás, kategória, elérhetőség status, kapcsolódó termékek
4. **Lovaink** (`/lovaink`) - Dinamikus lovak listázása szűrési lehetőséggel, részletoldalak származási adatokkal és képgalériával
5. **Ló részletei** (`/lovaink/:id`) - Teljes ló leírás, származási fa, képgaléria
6. **Eredményeink** (`/eredmenyeink`) - Versenystatisztikák és eredmények
7. **Admin: Lovak kezelése** (`/admin/horses`) - Adminisztrátor felület lovak kezelésére (CRUD, képfeltöltés)
8. **Admin: Termékek kezelése** (`/admin/products`) - Adminisztrátor felület termékek és kategóriák kezelésére (CRUD, képfeltöltés, elérhetőség toggle)

## Technológiai stack

- **Vue.js 3.3.4** - Progressive JavaScript framework
- **Vue Router 4.2.4** - Hivatalos routing library
- **Bootstrap 5.3.0** - CSS framework
- **Bootstrap Icons 1.11.3** - Ikonkészlet

## Használat

### Egyszerű indítás

1. Nyisd meg az `index.html` fájlt egy böngészőben
2. Vagy használj egy egyszerű HTTP szervert:

```bash
# Python 3
python -m http.server 8000

# Node.js http-server
npx http-server
```

### Fájlstruktúra

```
projekt/
│
├── index.html          # Fő HTML fájl
├── app.js              # Vue alkalmazás logika
├── style.css           # Egyesített stílusok
├── README.md           # Dokumentáció
│
└── img/                # Képek mappája (létrehozandó)
    ├── cordocan.jpg
    ├── lagunaLovasKlub.jpg
    ├── kaposvar.jpg
    ├── kecskemet.jpg
    ├── megyei.jpg
    ├── kecskemett.jpg
    ├── babolna.jpg
    ├── vagany.jpg
    ├── cooper.jpg
    └── Equine-America2x.avif
```

## Komponensek

### HeaderComponent

- Reszponzív navigációs menü
- Vue Router linkek aktív állapot jelzéssel

### FooterComponent

- Klub információk
- Partnerek listája
- Közösségi média linkek
- Elérhetőségi adatok

### Oldalkomponensek

- **RolunkPage**: Főoldal komponens szolgáltatásokkal és versenyekkel
- **WebshopPage**: Termékek megjelenítése
- **HorsesPage**: Dinamikus lovak listázása és szűrése (Increment 3)
- **HorseDetailView**: Egyedi ló részletei, képgaléria és származási adatok (Increment 3)
- **EredmenyeinkPage**: Versenyeredmények és statisztikák

### Ló-kezelő komponensek (Increment 3)

- **HorseCard**: Reszponzív lókártya komponens
- **HorseFilter**: Szűrési gombsor (Összes / Eladó / Nem eladó)
- **HorseGallery**: Képgaléria navigációval

### Admin komponensek (Increment 4)

- **AdminHorseList**: Lovak táblázata szerkesztés/törlés gombokkal
- **HorseForm**: Ló létrehozása/szerkesztése formmal (écsalád, nem, év, eladásra kínálva)
- **HorseImageUpload**: Többképes feltöltés komponens
- **HorseImageGallery**: Képek megjelenítése, törlése, átrendezése, alt szöveg szerkesztésével
- **AdminHorseListView**: Fő admin oldal konténer (lista/létrehozás/szerkesztés nézetek)

## Vue.js specifikus funkciók

### Routing

```javascript
const routes = [
  { path: "/", component: RolunkPage },
  { path: "/webshop", component: WebshopPage },
  { path: "/lovaink", component: HorsesPage },
  { path: "/lovaink/:id", component: HorseDetailView },
  { path: "/eredmenyeink", component: EredmenyeinkPage },
  { path: "/admin/login", component: LoginPage },
  { path: "/admin", component: AdminDashboard },
  { path: "/admin/horses", component: AdminHorseListView },
  { path: "/admin/horses/new", component: AdminHorseListView },
  { path: "/admin/horses/:id/edit", component: AdminHorseListView },
];
```

### Composables (Increment 3 & 4)

- **useHorses()**: Lovak adatainak kezelése, szűrése és betöltése (Increment 3)
- **useAuth()**: Bejelentkezési állapot és autentikáció (Increment 2)
- **useHorseForm()**: Ló formadatok, validáció és submit (Increment 4)

### Services (Increment 3 & 4)

- **horseService.js**: Supabase-ből lovak adatainak lekérése, CRUD műveletek (Increment 3 & 4)
- **horseImageService.js**: Képek feltöltése, törlése, átrendezése, alt szöveg kezelése (Increment 4)

### Reaktív adatok

```javascript
data() {
  return {
    versenyek: [...],
    szolgaltatasok: [...],
    // stb.
  }
}
```

### Template szintaxis

- `v-for`: Listák iterálása
- `v-bind` / `:`: Attribútum binding
- `router-link`: Navigációs linkek
- `{{ }}`: Interpoláció

## Fejlesztési lehetőségek

### További funkciók

- [ ] Axios/Fetch API integrálás backend-hez
- [ ] Vuex/Pinia state management
- [ ] Formulár validáció
- [ ] Animációk és transitions
- [ ] Lazy loading képekhez
- [ ] Progressive Web App (PWA) funkciók

### Dokumentáció

#### Inkrementumok

- [Increment 2 - Autentikáció](docs/increment_2/README_INCREMENT_2.md)
- [Increment 3 - Lovak Megjelenítése](docs/increment_3/README_INCREMENT_3.md)
- [Increment 4 - Lovak Admin Kezelése](docs/increment_4/README_INCREMENT_4.md)

#### Implementációs útmutatók

- [Increment 4 Spec](docs/increment_4/SPEC_INCREMENT_4.md)
- [Increment 4 Implementation Guide](docs/increment_4/IMPLEMENTATION_GUIDE.md)

### Build eszközök

A projekt jelenleg CDN-ről tölt be mindent. Éles környezethez ajánlott:

- Vite vagy Vue CLI használata
- npm/yarn package management
- Single File Components (.vue fájlok)
- TypeScript támogatás

## Böngésző kompatibilitás

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- IE11: ❌ (Vue 3 nem támogatja)

## Licensz

© 2025 Laguna Lovasklub Kft.

## Kapcsolat

- Email: lagunalovasklub@gmail.com
- Telefon: +36 20 981 3383
- Cím: 2832, Héreg, Laguna Lovasklub
- Facebook: https://www.facebook.com/lagunalovasklubkft
- Instagram: https://www.instagram.com/laguna_lovasklub_kft/
