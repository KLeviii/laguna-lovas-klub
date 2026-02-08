# Laguna Lovasklub Vue.js Alkalmazás

Ez a projekt a Laguna Lovasklub weboldalának Vue.js alapú single-page application (SPA) változata.

## Funkciók

- **Single Page Application**: Gyors navigáció oldalak között újratöltés nélkül
- **Vue Router**: Történetalapú URL kezelés
- **Komponens alapú architektúra**: Újrafelhasználható komponensek (Header, Footer)
- **Reaktív adatkezelés**: Vue 3 Composition API
- **Bootstrap 5 integráció**: Modern, reszponzív design
- **Bootstrap Icons**: Gazdag ikonkészlet

## Oldalak

1. **Rólunk** (`/`) - Főoldal klubinformációkkal, szolgáltatásokkal és versenyekkel
2. **Webshop** (`/webshop`) - Termékkatalógus
3. **Lovaink** (`/lovaink`) - Tenyésztési leszármazási fa
4. **Eredményeink** (`/eredmenyeink`) - Versenystatisztikák és eredmények

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
- **LovainkPage**: Tenyésztési leszármazási fa
- **EredmenyeinkPage**: Versenyeredmények és statisztikák

## Vue.js specifikus funkciók

### Routing
```javascript
const routes = [
  { path: '/', component: RolunkPage },
  { path: '/webshop', component: WebshopPage },
  { path: '/lovaink', component: LovainkPage },
  { path: '/eredmenyeink', component: EredmenyeinkPage }
];
```

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