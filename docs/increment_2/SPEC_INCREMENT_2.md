# Specifikáció - Inkrementum 2: Autentikáció & Admin Szerepkör

## 1. Áttekintés

Ez az inkrementum az admin bejelentkezési rendszert valósítja meg Supabase Auth használatával. Célja, hogy az adminisztrátorok be tudjanak jelentkezni, és a session megmaradjon az újratöltések között. A publikus látogatók továbbra is olvashatják a tartalmat, de csak a bejelentkezett admin módosíthatja azt.

## 2. Funkcionális Követelmények

### FR-01: Supabase Client Inicializálás
- Supabase SDK integráció Vue 3 alkalmazásba
- Környezeti változók kezelése (`.env` fájl)
- Globális Supabase client singleton létrehozása

### FR-02: Admin Bejelentkezési Űrlap
- Publikus route: `/admin/login`
- Email és jelszó mező validációval
- "Bejelentkezés" gomb
- Hibaüzenetek megjelenítése (pl. rossz jelszó)
- Sikeres bejelentkezés után átirányítás `/admin` dashboardra

### FR-03: Session Kezelés
- JWT token tárolása `localStorage`-ban
- Session automatikus betöltése oldal újratöltésekor
- Auth state globális elérhetősége (Vue Composable vagy Plugin)

### FR-04: Kijelentkezés
- "Kijelentkezés" gomb az admin oldalak fejlécében
- Token törlése localStorage-ból
- Átirányítás a főoldalra (`/`)

### FR-05: Védett Admin Oldalak
- Route: `/admin` - Admin Dashboard (védett)
- Route: `/admin/*` - Minden admin aloldal védett
- Navigation Guard: Router `beforeEach` hook
- Nem bejelentkezett felhasználók átirányítása `/admin/login`-ra

### FR-06: Admin Dashboard
- Központi admin felület linkekkel:
  - Lovak kezelése → `/admin/horses` (későbbi inkrementum)
  - Termékek kezelése → `/admin/products` (későbbi inkrementum)
  - Versenyek kezelése → `/admin/competitions` (későbbi inkrementum)
  - Üzenetek → `/admin/messages` (későbbi inkrementum)
- Egyszerű kártyás/lista layout Bootstrap-pel

### FR-07: Admin Gombok Publikus Oldalakon
- "Szerkesztés" gombok megjelenítése csak bejelentkezett adminnak
- Példa helyek:
  - Lovaink oldal: minden lónál "Szerkesztés" gomb
  - Webshop: "Termék hozzáadása" gomb
  - Eredmények: "Verseny hozzáadása" gomb
- Gombok elrejtése ha nincs bejelentkezve

## 3. Nem-Funkcionális Követelmények

### NFR-01: Biztonság
- JWT token biztonságos tárolása
- HTTPS használata production környezetben (Supabase)
- Jelszó minimum 8 karakter (Supabase Auth default)

### NFR-02: Felhasználói Élmény
- Gyors bejelentkezés (<2 másodperc)
- Tiszta hibaüzenetek
- Responsive design mobil eszközökre is

### NFR-03: Karbantarthatóság
- Auth logika központosított (composable)
- Újrafelhasználható komponensek (pl. ProtectedRoute wrapper)
- Tiszta környezeti változó kezelés

## 4. Technikai Implementáció

### 4.1 Fájlok és Komponensek

#### Új fájlok:
1. **`.env`** - Környezeti változók
   ```
   VITE_SUPABASE_URL=https://kbicrsztrtxpqocrlujj.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_vHCpwYYEwzD0PrCWnlFUrg_KrnaIezT
   ```

2. **`src/lib/supabase.js`** - Supabase client inicializálás
   ```javascript
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

3. **`src/composables/useAuth.js`** - Auth state és műveletek
   - `user` (reactive ref) - bejelentkezett user vagy null
   - `isAuthenticated` (computed) - boolean
   - `signIn(email, password)` - bejelentkezés
   - `signOut()` - kijelentkezés
   - `initAuth()` - session visszaállítása localStorage-ból

4. **`src/components/admin/LoginPage.vue`** - Bejelentkezési űrlap

5. **`src/components/admin/AdminLayout.vue`** - Admin oldalak layout (header + sidebar/nav)

6. **`src/components/admin/AdminDashboard.vue`** - Admin főoldal

#### Módosított fájlok:
1. **`src/router/index.js`** - Navigation guard hozzáadása
2. **`src/main.js`** - Auth inicializálás app indításkor
3. **`src/components/Header.vue`** - Admin gomb megjelenítése ha bejelentkezve
4. **Publikus oldalak** (HorsesPage, Webshop, ResultsPage) - Admin gombok feltételesen

### 4.2 Router Guard Logika

```javascript
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()
  
  // Admin oldalak védelme
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!isAuthenticated.value) {
      return next('/admin/login')
    }
  }
  
  // Ha már be van jelentkezve és a login oldalra megy
  if (to.path === '/admin/login' && isAuthenticated.value) {
    return next('/admin')
  }
  
  next()
})
```

### 4.3 Auth Composable API

```javascript
// Használat komponensekben
const { user, isAuthenticated, signIn, signOut } = useAuth()

// Bejelentkezés
await signIn('leventekaldor@gmail.com', 'jelszó')

// Kijelentkezés
await signOut()

// Felhasználó adatok
console.log(user.value.email)
```

## 5. Supabase Konfiguráció

### 5.1 Admin User Létrehozása (Manuális - Supabase Dashboard)
1. Menj a Supabase Dashboard → Authentication → Users
2. Kattints "Add user" → "Create new user"
3. Email: `leventekaldor@gmail.com`
4. Password: [Te adod meg]
5. Auto-confirm user: ✅ (hogy ne kelljen email verifikáció)

### 5.2 RLS Policies (Row Level Security)
Minden táblához (`horses`, `products`, `competitions`, stb.):

**Public Read Policy:**
```sql
CREATE POLICY "Public read access"
ON [table_name]
FOR SELECT
USING (true);
```

**Authenticated Write Policy:**
```sql
CREATE POLICY "Authenticated users can write"
ON [table_name]
FOR ALL
USING (auth.role() = 'authenticated');
```

## 6. Definition of Done (DoD)

### Funkcionális DoD:
- [ ] Admin be tud jelentkezni email + jelszó kombinációval
- [ ] Hibás jelszónál hibaüzenet jelenik meg
- [ ] Sikeres bejelentkezés után átirányít `/admin` dashboardra
- [ ] Session megmarad oldal újratöltése után
- [ ] "Kijelentkezés" gomb működik és átirányít a főoldalra
- [ ] Védett admin oldalak átirányítanak `/admin/login`-ra ha nincs session
- [ ] Admin Dashboard megjeleníti a link kártyákat (horses, products, competitions, messages)
- [ ] Publikus oldalakon admin gombok csak bejelentkezve látszanak

### Technikai DoD:
- [ ] `.env` fájl létezik és tartalmazza a Supabase URL-t és API key-t
- [ ] Supabase client helyesen inicializálódik
- [ ] `useAuth` composable működik minden komponensben
- [ ] Router guard megakadályozza a nem autorizált hozzáférést
- [ ] Nincs console error az alkalmazásban
- [ ] Kód tiszta, kommentezett, karbantartható

### Biztonsági DoD:
- [ ] `.env` fájl `.gitignore`-ban van (nem kerül verziókezelésbe)
- [ ] JWT token csak localStorage-ban van (nem URL-ben vagy cookie-ban plain text)
- [ ] Supabase RLS policies aktiválva minden táblán

## 7. Kockázatok és Mitigáció

### Kockázat 1: Session elvesztése böngésző bezárása után
- **Mitigáció:** localStorage perzisztens, marad böngésző bezárás után is

### Kockázat 2: Supabase API Key kiszivárgása
- **Mitigáció:** Anon/Public key kiszivárgása NEM kritikus (RLS policies védik az adatbázist), de `.gitignore`-ba tesszük a `.env`-t

### Kockázat 3: XSS támadás JWT token ellopására
- **Mitigáció:** Vue 3 auto-escaping, sanitize user input (későbbi inkrementumokban)

## 8. Teszt Esetek

### TC-01: Sikeres bejelentkezés
1. Navigálj `/admin/login`
2. Írd be: `leventekaldor@gmail.com` / `helyes_jelszó`
3. Kattints "Bejelentkezés"
4. **Elvárt:** Átirányít `/admin` dashboardra, látható a user email

### TC-02: Hibás jelszó
1. Navigálj `/admin/login`
2. Írd be: `leventekaldor@gmail.com` / `rossz_jelszó`
3. Kattints "Bejelentkezés"
4. **Elvárt:** Hibaüzenet: "Invalid login credentials"

### TC-03: Session megmarad
1. Jelentkezz be
2. Frissítsd az oldalt (F5)
3. **Elvárt:** Továbbra is be vagy jelentkezve, nem irányít vissza login-ra

### TC-04: Védett oldal hozzáférés
1. NE jelentkezz be
2. Próbálj meg `/admin` URL-t megnyitni
3. **Elvárt:** Átirányít `/admin/login`-ra

### TC-05: Kijelentkezés
1. Jelentkezz be
2. Kattints "Kijelentkezés"
3. **Elvárt:** Átirányít `/` főoldalra, session törlődik

### TC-06: Admin gombok láthatósága
1. NE jelentkezz be
2. Menj a "Lovaink" oldalra
3. **Elvárt:** Nem látszanak szerkesztési gombok
4. Jelentkezz be
5. Menj újra "Lovaink" oldalra
6. **Elvárt:** Látszanak "Szerkesztés" gombok

## 9. Függőségek

- **Előfeltétel:** Inkrementum 1 (Supabase projekt setup) ✅ Kész
- **Blokkol:** Inkrementum 3, 4, 5, 6, 7, 8 (admin CRUD funkciók)
- **Külső függőség:** Supabase online elérhetősége

## 10. Becsült Időigény

- Supabase client + auth composable: **20 perc**
- Login komponens + validáció: **30 perc**
- Router guard: **15 perc**
- Admin layout + dashboard: **30 perc**
- Admin gombok publikus oldalakon: **20 perc**
- Tesztelés + dokumentáció: **25 perc**

**Összesen: ~2 óra** (egyezik a backlog becsléssel)
