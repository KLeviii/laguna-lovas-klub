# Dokumentáció - Inkrementum 2: Autentikáció & Admin Szerepkör

## 🎯 Implementált Funkciók

### 1. Supabase Autentikáció Integráció
- **Supabase Client**: Globális singleton client inicializálva `src/lib/supabase.js`-ben
- **Környezeti változók**: `.env` fájl VITE prefix-szel
- **SDK verzió**: `@supabase/supabase-js` (latest)

### 2. Auth State Management
- **Composable**: `useAuth()` - Vue 3 Composition API alapú auth kezelés
- **Globális state**: Reactive `user` objektum, `isAuthenticated` computed
- **Műveletek**: `signIn()`, `signOut()`, `initAuth()`
- **Session persistence**: localStorage-ban tárolva, automatikus visszatöltés

### 3. Admin Bejelentkezés
- **Route**: `/admin/login` (publikus)
- **Komponens**: `LoginPage.vue`
- **Funkciók**:
  - Email + jelszó validáció
  - Hibaüzenet megjelenítés
  - Loading state (spinner)
  - Sikeres bejelentkezés után átirányítás `/admin`-ra

### 4. Admin Dashboard
- **Route**: `/admin` (védett)
- **Komponens**: `AdminDashboard.vue`
- **Layout**: `AdminLayout.vue` wrapper (header + kijelentkezés gomb)
- **Tartalom**: 4 admin funkció kártya (Lovak, Termékek, Versenyek, Üzenetek)
- **Gyors linkek**: Publikus oldalak megtekintése

### 5. Navigation Guard
- **Router guard**: `router.beforeEach()`
- **Logika**:
  - `/admin/*` védett route-ok → átirányít `/admin/login`-ra ha nincs session
  - `/admin/login` → átirányít `/admin`-ra ha már be van jelentkezve
- **Meta tags**: `requiresAuth`, `requiresGuest`

### 6. Admin Gombok Publikus Oldalakon
- **Feltételes megjelenítés**: `v-if="isAuthenticated"`
- **Helyek**:
  - HorsesPage: "Lovak kezelése" gomb
  - Webshop: "Termékek kezelése" gomb
  - ResultsPage: "Versenyek kezelése" gomb
- **Header navbar**: "Admin" link megjelenik bejelentkezve

---

## 🏗️ Architektúra

### Auth Flow Diagram

```
App Start
   ↓
main.js → useAuth().initAuth()
   ↓
Supabase.auth.getSession() ← localStorage
   ↓
   ├─ Session found → user state frissítés
   └─ No session → user = null
   ↓
App.mount('#app')

---

User clicks "Login"
   ↓
LoginPage.vue → useAuth().signIn(email, password)
   ↓
Supabase.auth.signInWithPassword()
   ↓
   ├─ Success → session localStorage-ba + user state + redirect /admin
   └─ Error → hibaüzenet megjelenítés

---

User clicks "Logout"
   ↓
AdminLayout.vue → useAuth().signOut()
   ↓
Supabase.auth.signOut()
   ↓
localStorage clear + user = null + redirect /
```

### Komponens Hierarchia

```
App.vue
├── Header.vue (v-if admin link)
├── router-view
│   ├── LoginPage.vue (publikus)
│   └── AdminLayout.vue (védett)
│       ├── Header (admin)
│       ├── slot → AdminDashboard.vue
│       └── (later: HorsesAdmin, ProductsAdmin, stb.)
└── Footer.vue
```

---

## 📂 Fájlstruktúra

```
projekt/
├── .env                          # Supabase konfiguráció (GITIGNORE!)
├── .gitignore                    # .env védelem
├── src/
│   ├── main.js                   # Auth inicializálás
│   ├── lib/
│   │   └── supabase.js          # Supabase client singleton
│   ├── composables/
│   │   └── useAuth.js           # Auth state + műveletek
│   ├── components/
│   │   ├── Header.vue           # Admin link (v-if)
│   │   ├── HorsesPage.vue       # + Admin gomb
│   │   ├── Webshop.vue          # + Admin gomb
│   │   ├── ResultsPage.vue      # + Admin gomb
│   │   └── admin/
│   │       ├── LoginPage.vue     # Bejelentkezési űrlap
│   │       ├── AdminLayout.vue   # Admin wrapper (header + logout)
│   │       └── AdminDashboard.vue # Admin főoldal
│   └── router/
│       └── index.js             # Admin route-ok + navigation guard
```

---

## 🔐 Biztonság

### RLS Policies (Supabase)

**Minden táblára** (`horses`, `products`, `competitions`, stb.):

1. **Public Read Policy**:
```sql
CREATE POLICY "Public read access" ON [table_name] FOR SELECT USING (true);
```
- Mindenki olvashat (authentikált vagy nem)

2. **Authenticated Write Policy**:
```sql
CREATE POLICY "Authenticated users can write" ON [table_name] 
FOR ALL USING (auth.role() = 'authenticated');
```
- Csak bejelentkezett felhasználók írhatnak/módosíthatnak/törölhetnek

### Token Tárolás
- **localStorage**: JWT token perzisztens tárolás
- **Auto-refresh**: Supabase SDK automatikusan kezeli a token frissítést
- **XSS védelem**: Vue 3 auto-escaping, Supabase httpOnly cookie opció (később engedélyezhető)

### .gitignore
- `.env` fájl NEM kerül verziókezelésbe
- Csapattagok saját `.env` fájlt hoznak létre lokálisan

---

## 🧪 Tesztelés

### Unit Tesztek (Jövőbeli TODO)
- `useAuth.js` composable tesztelése (vitest)
- Mock Supabase client
- Session management logika

### E2E Tesztek (Jövőbeli TODO)
- Teljes bejelentkezési flow (Cypress/Playwright)
- Navigation guard működés
- Admin gombok láthatósága

### Manuális Tesztelés
- ✅ Sikeres bejelentkezés
- ✅ Hibás jelszó kezelése
- ✅ Session megmaradás újratöltéskor
- ✅ Védett oldal hozzáférés
- ✅ Kijelentkezés
- ✅ Admin gombok feltételes megjelenítése

---

## 🚨 Known Issues / Limitations

### Jelenlegi Korlátozások
1. **Nincs "Elfelejtett jelszó" funkció** - jövőbeli inkrementumban implementálható
2. **Nincs multi-role support** - jelenleg minden bejelentkezett user = admin
3. **Nincs session timeout kezelés** - Supabase default 1 órás token élettartam
4. **Admin CRUD oldalak még placeholder-ek** - Inkrementum 4-8-ban implementálva lesznek

### Ismert Hibák
- **Nincs** - az implementáció tesztelve és működik ✅

---

## 🔄 Jövőbeli Fejlesztések

### Short-term (következő inkrementumok)
1. Admin CRUD oldalak implementálása (Inkrementum 3-8)
2. File upload funkció (képek)
3. Form validáció bővítése

### Long-term (opcionális)
1. Elfelejtett jelszó funkció (Supabase Auth email templates)
2. Multi-role support (admin, moderator, viewer)
3. 2FA autentikáció
4. Audit log (ki, mikor, mit módosított)
5. Session timeout warning

---

## 📚 API Referencia

### `useAuth()` Composable

```javascript
import { useAuth } from '@/composables/useAuth'

const {
  user,              // Ref<User | null>
  isAuthenticated,   // ComputedRef<boolean>
  loading,           // Ref<boolean>
  error,             // Ref<string | null>
  initAuth,          // () => Promise<void>
  signIn,            // (email, password) => Promise<{success: boolean, error?: string}>
  signOut            // () => Promise<{success: boolean, error?: string}>
} = useAuth()

// Példa használat
if (isAuthenticated.value) {
  console.log('Bejelentkezve mint:', user.value.email)
}

await signIn('user@example.com', 'password')
await signOut()
```

### Navigation Guard

```javascript
// router/index.js
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()

  // Védett oldal
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return next('/admin/login')
  }

  // Login oldal ha már be van jelentkezve
  if (to.meta.requiresGuest && isAuthenticated.value) {
    return next('/admin')
  }

  next()
})
```

---

## 📞 Troubleshooting

### Probléma: "Cannot read property 'email' of null"
**OK:** A `user` ref `null` amikor nincs bejelentkezve.
**Megoldás**: Használj `v-if="isAuthenticated"` vagy optional chaining: `user?.email`

### Probléma: Session nem marad meg
**OK:** localStorage nincs engedélyezve böngészőben (Incognito mode).
**Megoldás**: Ne használj Incognito mode-ot fejlesztés során.

### Probléma: Admin gombok nem jelennek meg
**OK 1:** Az `useAuth` nincs importálva a komponensben.
**Megoldás**: `import { useAuth } from '@/composables/useAuth'`

**OK 2:** A `v-if` directive hibás.
**Megoldás**: Ellenőrizd: `v-if="isAuthenticated"` (NEM `v-if="user"`)

---

## ✅ Definition of Done - Ellenőrzés

- [x] Admin be tud jelentkezni email + jelszó kombinációval
- [x] Hibás jelszónál hibaüzenet jelenik meg
- [x] Sikeres bejelentkezés után átirányít `/admin` dashboardra
- [x] Session megmarad oldal újratöltése után
- [x] "Kijelentkezés" gomb működik és átirányít a főoldalra
- [x] Védett admin oldalak átirányítanak `/admin/login`-ra ha nincs session
- [x] Admin Dashboard megjeleníti a link kártyákat
- [x] Publikus oldalakon admin gombok csak bejelentkezve látszanak
- [x] `.env` fájl létezik és tartalmazza a Supabase URL-t és API key-t
- [x] Supabase client helyesen inicializálódik
- [x] `useAuth` composable működik minden komponensben
- [x] Router guard megakadályozza a nem autorizált hozzáférést
- [x] Nincs console error az alkalmazásban
- [x] Kód tiszta, kommentezett, karbantartható
- [x] `.env` fájl `.gitignore`-ban van
- [x] JWT token csak localStorage-ban van
- [x] Supabase RLS policies aktiválva minden táblán

**STÁTUSZ: ✅ KÉSZ - Minden DoD kritérium teljesült**

---

**Dokumentáció utolsó frissítése:** 2026-02-15
**Implementálta:** Claude (AI Asszisztens)
**Review-zta:** [Fejlesztő neve]
