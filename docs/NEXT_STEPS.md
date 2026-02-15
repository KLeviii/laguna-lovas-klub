# Következő Lépések - Supabase Integráció

## 📋 Létrehozott Dokumentumok

1. **PROJECT_VISION.md** - Projekt áttekintés
2. **DATABASE_SCHEMA.md** - Adatbázis táblák és mezők
3. **API_ENDPOINTS.md** - REST API végpontok mit csinálnak
4. **BACKLOG.md** - 11 inkrementumra bontott fejlesztési terv

## 🎯 Mit Tartalmaz a Specifikáció?

### Adatbázis Séma
- 7 tábla (lovak, képek, termékek, versenyek, eredmények, kapcsolat)
- Származási fa kezelés (apa/anya foreign key)
- Supabase Auth felhasználókhoz

### API Végpontok
- Teljes CRUD minden entitásra
- Szűrési, rendezési, lapozási lehetőségek
- Admin vs. Public jogosultságok
- Képfeltöltés Storage API-val

### Fejlesztési Terv
- 11 inkrementum prioritás szerint
- Kritikus → Magas → Közepes → Alacsony
- Becsült időigény minden feladathoz
- Elfogadási kritériumok

## ⚡ Amit Implementálni Fogsz

**REST API hívások JS-ben:**
```javascript
// Példa: Lovak lekérése
const response = await fetch('https://[project].supabase.co/rest/v1/horses', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
    'Authorization': 'Bearer YOUR_JWT' // admin műveleteknél
  }
});
const horses = await response.json();
```

**Nem kell:**
- Backend szerver írni
- SQL-t közvetlenül kezelni (Supabase Dashboard-on beállítod egyszer)
- Autentikációs rendszert fejleszteni (Supabase Auth)

**Kell:**
- Supabase projekt setup
- Táblák létrehozása Dashboard-on
- Frontend fetch() hívások
- Admin UI HTML/JS oldalak

## 🚀 Kezdjük el?

**Válaszd ki melyik inkremensummal indulnál:**

- [ ] Inkrementum 1 - Adatbázis setup (ajánlott első lépés)
- [ ] Más inkrementum (mondd meg melyik)
- [ ] Előbb kérdésed van a specifikációval kapcsolatban

**Vagy kérsz még részletesebb bontást egy konkrét inkrementumhoz?**
