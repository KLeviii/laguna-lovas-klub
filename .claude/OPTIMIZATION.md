# Optimalizálási Szabályrendszer

### Kötelező érvényű előírások — Aktiválás: ha a felhasználó "optimalizálást" kér

---

> **KRITIKUS ELŐÍRÁS**
> Ha a felhasználó "optimalizálást" kér, az alábbi **összes pontot** végre kell hajtani a megadott sorrendben. Egyetlen pont kihagyása sem megengedett. Ha bármely lépés során probléma merül fel, jelezni kell a felhasználónak és a javítás után folytatni.
>
> **CLAUDE.md felülírás:** Ez a szabályrendszer az optimalizálási kontextusban felülírja a CLAUDE.md "NO automated tests" szabályát. Optimalizálás során unit tesztek írása **kötelező**.

---

## 1. Kód Optimalizálás

Az optimalizálás első lépése a teljes kódbázis átvizsgálása és tisztítása.

### 1.1 Dead code és felesleges kód eltávolítása

- Minden nem használt változó, függvény, import és komponens eltávolítása
- Kikommentezett kódblokkok törlése
- Felesleges `console.log`, `console.warn`, `console.error` és `debugger` utasítások eltávolítása
- Nem használt CSS osztályok és stílusok törlése

### 1.2 DRY elv — Kódismétlés kiszűrése

- Ismétlődő kódrészletek azonosítása és közös függvénybe/composable-be kiemelése
- Ha ugyanaz a logika 2+ helyen szerepel, kötelező refaktorálni
- Közös utility függvények a `src/utils/` mappába kerüljenek
- Közös üzleti logika a `src/composables/` mappába kerüljön

### 1.3 Függvények egyszerűsítése

- Hosszú függvények (15+ sor) felbontása kisebb, egyértelmű nevű függvényekre
- Mélyen egymásba ágyazott feltételek egyszerűsítése (early return pattern)
- Komplex kifejezések kiemelése beszédes nevű változókba
- Maximális egyszerűségre törekvés minden megoldásban

### 1.4 Unused imports és függőségek

- Minden fájlban ellenőrizni az importokat — nem használtakat törölni
- `package.json`-ban nem használt csomagokat eltávolítani
- Elavult csomagokat frissíteni vagy kiváltani

---

## 2. Függvény Dokumentáció — JSDoc Annotációk

Minden függvényt, composable-t, service metódust és utility függvényt **kötelező** JSDoc annotációkkal dokumentálni.

### 2.1 Kötelező tagek

```javascript
/**
 * Rövid, egyértelmű leírás a függvény céljáról.
 *
 * @param {string} name - A paraméter leírása
 * @param {number} [optional=10] - Opcionális paraméter alapértékkel
 * @returns {Promise<Object>} A visszatérési érték leírása
 * @throws {Error} Mikor dobhat hibát
 * @example
 * const result = await fetchUser('user-123')
 * // => { id: 'user-123', name: 'Kiss Péter' }
 */
```

### 2.2 Kiemelt dokumentálandó területek

- **Composable-ök** (`src/composables/`): a visszaadott reaktív értékek és metódusok dokumentálása
- **Service-ek** (`src/services/`): Supabase lekérdezések, paraméterek és válasz típusok
- **Utils** (`src/utils/`): input/output, edge case-ek
- **Store action-ök** (`src/stores/`): állapotváltozások, mellékhatások

### 2.3 Komponens dokumentáció

Vue SFC-k `<script setup>` blokkjában:
- A komponens fájl tetején egy kommentblokk a komponens céljával
- Props és emits dokumentálása
- Bonyolultabb reaktív logika magyarázata

---

## 3. Unit Tesztek

> **CLAUDE.md felülírás aktív:** Optimalizálás során a tesztírás kötelező, annak ellenére, hogy a CLAUDE.md alapértelmezetten tiltja.

### 3.1 Teszt keretrendszer

- **Vitest** használata (Vue 3 + Vite natív integráció)
- Teszt konfiguráció: `vitest.config.js` a projekt gyökerében
- Teszt futtatás: `npm run test` script hozzáadása a `package.json`-hoz

### 3.2 Mit kell tesztelni

- **Minden service** (`src/services/`): Supabase hívások mockolt válaszokkal
- **Minden util függvény** (`src/utils/`): input/output tesztek, edge case-ek
- **Minden composable** (`src/composables/`): reaktív viselkedés, állapotváltozások
- **Store action-ök** (`src/stores/`): állapotmódosítások helyessége

### 3.3 Tesztek elhelyezése

- Tesztek a forrásfájl mellé: `[fájlnév].spec.js`
- Példa: `src/utils/formatting.js` → `src/utils/formatting.spec.js`
- Példa: `src/services/userService.js` → `src/services/userService.spec.js`

### 3.4 Teszt minőség

- Minden publikus függvényhez legalább 2 teszt eset (happy path + edge case)
- Mock-ok használata külső függőségekhez (Supabase, fetch)
- Beszédes teszt nevek magyarul vagy angolul

---

## 4. Biztonsági Előírások Betartatása

### 4.1 OWASP Top 10 ellenőrzés

A teljes kódbázist ellenőrizni kell az alábbi sebezhetőségek szempontjából:

| Kockázat | Ellenőrzés |
|---|---|
| **Injection** | Paraméteres lekérdezések, nincs string-összefűzés SQL-ben |
| **Broken Auth** | Token kezelés, session lejárat, biztonságos jelszókezelés |
| **XSS** | Felhasználói input sanitizálása, `v-html` kerülése |
| **CSRF** | SameSite cookie-k, CSRF tokenek ahol szükséges |
| **Security Misconfiguration** | HTTPS, biztonságos headerek, CORS policy |
| **Sensitive Data Exposure** | Titkosítás, nincs hardcoded secret |
| **Broken Access Control** | Route guard-ok, jogosultságellenőrzés |

### 4.2 Titkos kulcsok keresése

- Teljes kódbázis átvizsgálása hardcoded jelszavak, API kulcsok, tokenek után
- Minden titok `.env` fájlba kerüljön
- `.env` fájl **soha** nem kerülhet git repóba (`.gitignore` ellenőrzés)
- `.env.example` aktualitásának ellenőrzése

### 4.3 Dependency audit

```bash
npm audit
```

- Ismert sebezhetőségű csomagok azonosítása és frissítése
- Ha a frissítés nem lehetséges, alternatív csomag keresése
- Eredmény jelentése a felhasználónak

---

## 5. GDPR.md Megfelelőség — Globális Ellenőrzés

### 5.1 Teljes kódbázis átvizsgálása

A `.claude/GDPR.md` összes szabályát ellenőrizni kell a teljes projektben:

- **Személyes adatkezelés:** Minden személyes adatot kezelő kódrészlet jogalap-dokumentáltsága
- **Adatminimalizálás:** Nincs-e felesleges személyes adat lekérdezés (`SELECT *` tilalom)
- **HTTPS kötelezettség:** Minden fetch/API hívás HTTPS-en történik
- **URL-ek:** Személyes adat nem szerepel URL-ben vagy query paraméterben
- **Logolás:** Logokban nincs személyes adat tiszta szövegben
- **Hibakezelés:** Hibaüzenetek nem tartalmaznak személyes adatot
- **Cookie-k:** Megfelelő beállítások (httpOnly, secure, sameSite)
- **Token kezelés:** Authorization headerben, nem URL-ben

### 5.2 Azonnali leállás

Ha bármely GDPR.md szabály sérül, az agent **azonnal leáll**, jelenti a problémát, és javítja, mielőtt folytatná az optimalizálás többi lépését.

---

## 6. SEO Elvek — Kötelező Betartás

### 6.1 Meta adatok

Minden route-hoz tartozó oldalnak rendelkeznie kell:

- `<title>` — egyedi, releváns, max. 60 karakter
- `<meta name="description">` — max. 160 karakter, tartalmazzon kulcsszavakat
- Open Graph tagek (`og:title`, `og:description`, `og:image`, `og:url`)
- Canonical URL (`<link rel="canonical">`)

Megvalósítás: a router `meta` mezőjében vagy a `useHead` composable segítségével.

### 6.2 Szemantikus HTML

- Megfelelő heading hierarchia (`h1` → `h2` → `h3`, egy `h1` oldalanként)
- Szemantikus elemek használata: `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<header>`
- Nem `<div>` és `<span>` mindenre

### 6.3 Releváns kulcsszavak

- Minden oldal szöveges tartalma tartalmazzon releváns kulcsszavakat
- Alt attribútum minden `<img>` elemen — leíró, kulcsszavakat tartalmazó szöveg
- Beszédes URL-ek (slug-ok), nem ID-alapú route-ok ahol lehetséges (pl. `/lovaink/bucephalus` vs `/horses/123`)

### 6.4 Teljesítmény (Core Web Vitals)

- Képek lazy loading-ja (`loading="lazy"`)
- Kritikus CSS inline betöltése
- JavaScript bundle méret minimalizálása
- Route-alapú code splitting (`() => import(...)` a routerben)

### 6.5 Egyéb SEO követelmények

- `robots.txt` létezésének és helyességének ellenőrzése
- `sitemap.xml` generálása ha nincs
- Strukturált adatok (JSON-LD) ahol releváns (pl. üzleti adatok, termékek)
- 404-es oldal kezelése

---

## 7. Akadálymentesítés (Accessibility — a11y)

### 7.1 Alapvető a11y ellenőrzés

- Minden interaktív elemnek legyen `aria-label` vagy látható label
- Megfelelő kontraszt arányok (WCAG AA minimum)
- Billentyűzettel navigálható felület (`tabindex`, `:focus` stílusok)
- Űrlap mezők `<label>` elemmel összekapcsolva (`for`/`id`)
- `alt` attribútum minden képen (SEO + a11y)

### 7.2 ARIA attribútumok

- Dinamikus tartalomnál `aria-live` régiók
- Modálok és dropdown-ok megfelelő `role` és `aria-*` attribútumai
- Skip navigation link a fő tartalomhoz

---

## 8. Teljesítmény Optimalizálás

### 8.1 Bundle méret

- Route-alapú lazy loading minden nem-kritikus oldalra
- Tree-shaking ellenőrzése — csak használt modulok importálása
- Nagyméretű függőségek azonosítása és kiváltása ha lehetséges

### 8.2 Képek

- Megfelelő méret és formátum (WebP/AVIF preferált)
- Lazy loading képekre (`loading="lazy"`)
- `width` és `height` attribútumok megadása (CLS megelőzés)

### 8.3 Hálózati kérések

- Felesleges API hívások azonosítása és eliminálása
- Adatok cache-elése ahol lehetséges
- Párhuzamos kérések `Promise.all`-lal ahol függetlenek

---

## 9. Végrehajtási Sorrend és Ellenőrzési Protokoll

Az optimalizálás lépéseit az alábbi sorrendben kell végrehajtani:

1. **Kód optimalizálás** (§1) — tiszta, egyszerű kódbázis legyen az alap
2. **Biztonsági ellenőrzés** (§4) — kritikus problémák azonnali javítása
3. **GDPR megfelelőség** (§5) — teljes kódbázis átvizsgálása
4. **JSDoc dokumentáció** (§2) — az optimalizált kód dokumentálása
5. **Unit tesztek** (§3) — a végleges kódra tesztek írása
6. **SEO** (§6) — meta adatok, kulcsszavak, szemantikus HTML
7. **Akadálymentesítés** (§7) — a11y ellenőrzés
8. **Teljesítmény** (§8) — bundle, képek, hálózat

### 9.1 Lépésenkénti visszajelzés

Minden lépés befejezése után rövid összefoglalót kell adni a felhasználónak:
- Mi változott
- Hány fájl érintett
- Milyen problémák kerültek javításra

### 9.2 Végleges jelentés

Az optimalizálás végén összefoglaló jelentés:
- Elvégzett optimalizálások listája
- Javított biztonsági és GDPR problémák
- Teszt lefedettség összesítés
- SEO és a11y állapot
- Fennmaradó javaslatok (ha van)

---

*Ez a szabályrendszer kizárólag az "optimalizálás" kérés kontextusában aktív. Normál fejlesztés során a CLAUDE.md szabályai az irányadóak.*