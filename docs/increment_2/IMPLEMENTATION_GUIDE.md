# Inkrementum 2 - Implementációs Útmutató

## 📦 Létrehozott Fájlok

### Új fájlok:
1. `.env` - Környezeti változók (Supabase konfiguráció)
2. `.gitignore` - Git ignore konfiguráció (.env védelem)
3. `src/lib/supabase.js` - Supabase client inicializálás
4. `src/composables/useAuth.js` - Auth state és műveletek
5. `src/components/admin/LoginPage.vue` - Bejelentkezési űrlap
6. `src/components/admin/AdminLayout.vue` - Admin layout (header + kijelentkezés)
7. `src/components/admin/AdminDashboard.vue` - Admin főoldal

### Módosított fájlok:
1. `src/main.js` - Auth inicializálás hozzáadva
2. `src/router/index.js` - Admin route-ok + navigation guard
3. `src/components/Header.vue` - Admin link bejelentkezve
4. `src/components/HorsesPage.vue` - "Lovak kezelése" admin gomb
5. `src/components/Webshop.vue` - "Termékek kezelése" admin gomb
6. `src/components/ResultsPage.vue` - "Versenyek kezelése" admin gomb

---

## 🚀 Telepítés és Beüzemelés

### 1. Fájlok Áthelyezése
Másold át az összes létrehozott fájlt a projektedbe. Ügyelj arra, hogy a mappa struktúra megmaradjon:

```
projekt-gyökér/
├── .env                          # ÚJ
├── .gitignore                    # ÚJ vagy MERGE
├── src/
│   ├── main.js                   # MÓDOSÍTOTT
│   ├── lib/
│   │   └── supabase.js          # ÚJ
│   ├── composables/
│   │   └── useAuth.js           # ÚJ
│   ├── components/
│   │   ├── Header.vue           # MÓDOSÍTOTT
│   │   ├── HorsesPage.vue       # MÓDOSÍTOTT
│   │   ├── Webshop.vue          # MÓDOSÍTOTT
│   │   ├── ResultsPage.vue      # MÓDOSÍTOTT
│   │   └── admin/
│   │       ├── LoginPage.vue     # ÚJ
│   │       ├── AdminLayout.vue   # ÚJ
│   │       └── AdminDashboard.vue # ÚJ
│   └── router/
│       └── index.js             # MÓDOSÍTOTT
```

### 2. Supabase Admin User Létrehozása

**FONTOS:** Ezt manuálisan kell elvégezned a Supabase Dashboard-on!

1. Nyisd meg: [https://supabase.com/dashboard/project/kbicrsztrtxpqocrlujj](https://supabase.com/dashboard/project/kbicrsztrtxpqocrlujj)
2. Menj: **Authentication** → **Users** menüpontra
3. Kattints: **"Add user"** → **"Create new user"**
4. Töltsd ki:
   - **Email**: `leventekaldor@gmail.com`
   - **Password**: [válassz biztonságos jelszót, legalább 8 karakter]
   - **Auto Confirm User**: ✅ (pipáld be, hogy ne kelljen email verifikáció)
5. Kattints: **"Create user"**

### 3. RLS Policies Beállítása (Supabase SQL Editor)

Menj a **SQL Editor** menüpontra és futtasd le az alábbi SQL parancsokat minden táblára:

```sql
-- PUBLIC READ (minden táblára)
CREATE POLICY "Public read access" ON horses FOR SELECT USING (true);
CREATE POLICY "Public read access" ON horse_images FOR SELECT USING (true);
CREATE POLICY "Public read access" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON competitions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON competition_results FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contact_submissions FOR SELECT USING (true);

-- AUTHENTICATED WRITE (minden táblára)
CREATE POLICY "Authenticated users can write" ON horses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can write" ON horse_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can write" ON product_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can write" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can write" ON competitions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can write" ON competition_results FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can write" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');
```

**Megjegyzés:** Ha a táblák neve eltér, módosítsd a parancsokban a táblaneveket!

### 4. Alkalmazás Indítása

```bash
# Függőségek telepítése (ha még nem tetted)
npm install

# Dev szerver indítása
npm run dev
```

---

## ✅ Tesztelési Checklist

### Teszt 1: Bejelentkezés
- [ ] Nyisd meg: `http://localhost:5173/#/admin/login`
- [ ] Írd be: `leventekaldor@gmail.com` + [jelszavad]
- [ ] Kattints "Bejelentkezés"
- [ ] **Elvárt:** Átirányít `/admin` dashboardra

### Teszt 2: Hibás jelszó
- [ ] Nyisd meg: `http://localhost:5173/#/admin/login`
- [ ] Írd be: `leventekaldor@gmail.com` + `rosszjelszo123`
- [ ] Kattints "Bejelentkezés"
- [ ] **Elvárt:** Piros hibaüzenet: "Hibás email vagy jelszó..."

### Teszt 3: Session megmarad
- [ ] Jelentkezz be sikeresen
- [ ] Frissítsd az oldalt (F5)
- [ ] **Elvárt:** Továbbra is be vagy jelentkezve, látod az Admin linket a navbarban

### Teszt 4: Védett oldal
- [ ] Kijelentkezés után próbáld meg elérni: `http://localhost:5173/#/admin`
- [ ] **Elvárt:** Átirányít `/admin/login`-ra

### Teszt 5: Kijelentkezés
- [ ] Jelentkezz be
- [ ] Kattints a "Kijelentkezés" gombra (jobb felső sarok az admin oldalakon)
- [ ] **Elvárt:** Átirányít a főoldalra, az "Admin" link eltűnik a navbarból

### Teszt 6: Admin gombok
- [ ] **Bejelentkezés NÉLKÜL:**
  - Menj "Lovaink" oldalra → NEM látszik "Lovak kezelése" gomb
  - Menj "Webshop" oldalra → NEM látszik "Termékek kezelése" gomb
  - Menj "Eredmények" oldalra → NEM látszik "Versenyek kezelése" gomb
  
- [ ] **Bejelentkezés UTÁN:**
  - Menj "Lovaink" oldalra → LÁTSZIK "Lovak kezelése" gomb
  - Menj "Webshop" oldalra → LÁTSZIK "Termékek kezelése" gomb
  - Menj "Eredmények" oldalra → LÁTSZIK "Versenyek kezelése" gomb

### Teszt 7: Admin Dashboard
- [ ] Jelentkezz be
- [ ] Menj `/admin` dashboardra
- [ ] **Elvárt:** Látod a 4 kártya linket: Lovak, Termékek, Versenyek, Üzenetek
- [ ] Kattints mindegyikre → átirányítanak (jelenleg ugyanarra a dashboardra, mert a CRUD oldalak még nincsenek elkészítve)

---

## 🐛 Gyakori Hibák és Megoldások

### Hiba: "Missing Supabase environment variables"
**OK:** A `.env` fájl nem található vagy nem megfelelő helyen van.
**Megoldás:** Ellenőrizd, hogy a `.env` fájl a projekt gyökerében van-e (ugyanott ahol a `package.json`).

### Hiba: "Invalid API key" vagy 401 Unauthorized
**OK:** Rossz Supabase API key a `.env` fájlban.
**Megoldás:** 
1. Menj Supabase Dashboard → Settings → API
2. Másold ki az **anon/public** key-t
3. Cseréld le a `.env` fájlban: `VITE_SUPABASE_ANON_KEY=...`

### Hiba: Bejelentkezés után azonnal kijelentkezik
**OK:** Az admin user nincs létrehozva Supabase-ben, vagy nincs megerősítve.
**Megoldás:** Ellenőrizd a Supabase Dashboard → Authentication → Users menüt, hogy létezik-e a `leventekaldor@gmail.com` user és "Confirmed" státuszú-e.

### Hiba: RLS Policy error INSERT/UPDATE/DELETE műveletekkor
**OK:** Az RLS policies nincsenek megfelelően beállítva.
**Megoldás:** Futtasd le újra az SQL parancsokat a fenti "3. RLS Policies" szekcióból.

---

## 📝 Következő Lépések

Most, hogy az autentikáció működik, a következő inkrementumok implementálhatók:

1. **Inkrementum 3**: Lovak megjelenítése (Read) - API-ból töltse be a lovak listáját
2. **Inkrementum 4**: Lovak Admin kezelése (Create/Update/Delete) - CRUD funkciók

Minden készen áll! 🎉

---

## 🆘 Támogatás

Ha bármilyen problémába ütközöl:
1. Ellenőrizd a böngésző Console-t (F12 → Console tab) - vannak-e hibák?
2. Ellenőrizd a Supabase Dashboard → Logs menüt - látszanak-e API hívások?
3. Próbáld újraindítani a dev szervert (`npm run dev`)

**Ha továbbra is fennáll a hiba, jelezd és segítek! 👨‍💻**
