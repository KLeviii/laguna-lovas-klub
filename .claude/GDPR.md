# 🔐 GDPR Szabályzat Kódoló Agentnek
### Kötelező érvényű adatvédelmi és adatkezelési előírások fejlesztés közben

---

> **⛔ KRITIKUS FIGYELMEZTETÉS**
> Ez a dokumentum kötelező érvényű szabályokat tartalmaz. Ha bármely szabály sérül – akár kódolás, akár adatbázis-tervezés, akár API-hívás közben –, az agentnek **azonnal le kell állnia**, jeleznie kell a problémát, és **a munka folytatása előtt ki kell javítania** a jogsértést. A felhasználót is értesíteni kell, ha adatbázis-módosítás vagy manuális beavatkozás szükséges.

---

## 1. Alapelvek – A GDPR Öt Aranyszabálya

A GDPR (2016/679 EU rendelet) minden adatkezelési tevékenységre vonatkozik, ahol természetes személyek személyes adatait kezeled. Kódolás közben ezeket az alapelveket minden döntésnél szem előtt kell tartanod.

**1.1 Jogalaphoz kötöttség** — Személyes adatot csak akkor szabad gyűjteni, tárolni vagy feldolgozni, ha ahhoz egyértelmű jogalap létezik. A hat lehetséges jogalap: hozzájárulás, szerződéses kötelezettség, jogi kötelezettség, létfontosságú érdek, közfeladat, jogos érdek. A kódban mindig dokumentálni kell, hogy melyik jogalapra támaszkodik az adott adatkezelési művelet.

**1.2 Célhoz kötöttség** — Az adatot kizárólag arra a célra szabad felhasználni, amelyre gyűjtötték. Ha például egy e-mail-cím regisztrációhoz lett megadva, azt nem szabad marketing célra használni anélkül, hogy erre külön jogalap ne állna fenn.

**1.3 Adattakarékosság** — Csak annyi adatot szabad gyűjteni, amennyi a cél eléréséhez feltétlenül szükséges. Kódolás közben minden adatmező létjogosultságát meg kell kérdőjelezni: "Valóban szükséges ez az adat a funkció működéséhez?"

**1.4 Pontosság** — A tárolt adatoknak naprakészeknek és pontosnak kell lenniük. Az adatbázisban gondoskodni kell arról, hogy elavult adatokat frissíteni vagy törölni lehessen.

**1.5 Korlátozott tárolhatóság** — Az adatot csak addig szabad tárolni, ameddig a cél indokolja. Az adatbázis tervezésekor kötelező meghatározni a megőrzési időt (`retention_period`), és automatikus törlési mechanizmust kell beépíteni.

---

## 2. Adatbázis Tervezési Kötelezettségek

Az adatbázis az adatvédelem szempontjából a legkritikusabb pont. Minden adatbázis-tervezési döntésnél az alábbi szabályokat kötelező alkalmazni.

### 2.1 Kötelező mezők minden személyes adatot tartalmazó táblában

Minden olyan táblában, amely természetes személyek adatait tárolja, az alábbi metaadatmezőket kötelező felvenni:

```sql
-- Példa: kötelező GDPR metaadatmezők
ALTER TABLE users ADD COLUMN consent_given BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN consent_timestamp TIMESTAMP;
ALTER TABLE users ADD COLUMN consent_version VARCHAR(10);       -- melyik adatvédelmi nyilatkozathoz járultak hozzá
ALTER TABLE users ADD COLUMN data_retention_until DATE;         -- meddig tárolható az adat
ALTER TABLE users ADD COLUMN anonymized BOOLEAN DEFAULT FALSE;  -- anonimizálva lett-e
ALTER TABLE users ADD COLUMN deletion_requested_at TIMESTAMP;  -- törlési kérelem időpontja
ALTER TABLE users ADD COLUMN data_source VARCHAR(255);          -- honnan származik az adat
```

> **⚠️ AGENT ELLENŐRZÉS:** Ha személyes adatot tartalmazó táblát hozol létre vagy módosítasz, és ezek a mezők hiányoznak, állj meg, és utasítsd a felhasználót, hogy futtassa a szükséges `ALTER TABLE` parancsokat az adatbázison.

### 2.2 Személyes adat azonosítása

Személyes adatnak minősül minden olyan információ, amely alapján egy természetes személy azonosítható vagy azonosíthatóvá válik. Kódolás közben személyes adatnak kell tekinteni:

- Nevet, e-mail-címet, telefonszámot, postacímet
- IP-címet (dinamikus IP is személyes adat az EU joggyakorlatban!)
- Cookie-azonosítókat, session tokeneket, device fingerprint-et
- Felhasználói viselkedési adatokat, ha azok személyhez köthetők
- Lokációs adatokat
- Egészségügyi, biometrikus vagy genetikai adatokat (ezek különleges kategóriájú adatok – fokozott védelmet igényelnek)
- Pénzügyi adatokat, számlaszámokat
- Fényképeket és hangfelvételeket

### 2.3 Adatbázis biztonsági kötelezettségek

Az adatbázissal való minden kommunikáció biztonsági kritikus. A következő szabályok megszegése azonnali leállást von maga után:

**Titkosítás:** Az adatbázisban a különleges kategóriájú adatokat (egészségügyi, biometrikus, politikai stb.) titkosítva kell tárolni. Jelszavakat bcrypt, Argon2 vagy scrypt algoritmussal kell hashelni – tiszta szöveges jelszó tárolása **tilos és azonnali GDPR-sértés**.

```javascript
// ✅ HELYES – jelszó hashelése
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(plainPassword, 12); // min. 10 kör

// ❌ TILOS – soha ne tárold így
const user = { password: plainPassword }; // GDPR SÉRTÉS – ÁLLJ MEG!
```

**SQL Injection elleni védelem:** Minden adatbázis-lekérdezésben paraméteres lekérdezéseket vagy ORM-et kell használni. A közvetlen string-összefűzés személyes adatok kiszivárgásához vezethet.

```javascript
// ✅ HELYES – paraméteres lekérdezés
const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

// ❌ TILOS – SQL injection lehetőség, GDPR sértés
const result = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

**Kapcsolat titkosítása:** Az adatbázis-kapcsolatot SSL/TLS titkosítással kell felépíteni.

```javascript
// ✅ HELYES – SSL kapcsolat
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true } // production-ben soha ne legyen false!
});
```

### 2.4 Adatminimalizálás lekérdezéseknél

Soha ne kérdezz le több adatot, mint amennyire az adott funkcióhoz szükség van.

```javascript
// ✅ HELYES – csak a szükséges mezők
const user = await db.query('SELECT id, username, email FROM users WHERE id = $1', [userId]);

// ❌ KERÜLENDŐ – felesleges személyes adatok lekérdezése
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
// A SELECT * lekérdezi a jelszóhasht, születési dátumot stb. is, amire nincs szükség!
```

---

## 3. JavaScript Fetch Metódusok és API Kommunikáció

### 3.1 HTTPS kötelezettség

Minden fetch hívás kizárólag HTTPS protokollon keresztül történhet. HTTP-n küldött személyes adat **kötelező GDPR-sértés**, azonnali leállást von maga után.

```javascript
// ✅ HELYES
const response = await fetch('https://api.pelda.hu/users', { ... });

// ❌ TILOS – titkosítatlan kapcsolat
const response = await fetch('http://api.pelda.hu/users', { ... }); // ÁLLJ MEG!
```

### 3.2 Authorization és adatvédelem a headerekben

Hitelesítési tokeneket mindig a `Authorization` headerben kell küldeni, soha ne URL paraméterként, mivel az URL megjelenik a szerver logokban és a böngésző előzményeiben.

```javascript
// ✅ HELYES – token a headerben
const response = await fetch('https://api.pelda.hu/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
});

// ❌ TILOS – token az URL-ben (megjelenik a logokban és a history-ban!)
const response = await fetch(`https://api.pelda.hu/profile?token=${accessToken}`);
```

### 3.3 Személyes adatok küldése POST body-ban

Személyes adatokat mindig a request body-jában kell küldeni, titkosított HTTPS kapcsolaton.

```javascript
// ✅ HELYES – személyes adatok a body-ban
const response = await fetch('https://api.pelda.hu/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: userEmail,
    name: userName,
    // Hozzájárulás rögzítése az API hívással együtt
    consent: {
      terms: true,
      privacy_policy: true,
      version: '2.1',
      timestamp: new Date().toISOString()
    }
  })
});

// ❌ TILOS – személyes adat GET paraméterként
const response = await fetch(`https://api.pelda.hu/search?email=${userEmail}`);
// Az email megjelenik a szerver logokban és az URL history-ban!
```

### 3.4 Hibakezelés és adatszivárgás megelőzése

Fetch hívások hibakezelésénél ügyelni kell arra, hogy a hibaüzenet ne tartalmazzon személyes adatot.

```javascript
try {
  const response = await fetch('https://api.pelda.hu/users');
  if (!response.ok) {
    // ✅ HELYES – általános hibaüzenet, nem tartalmaz személyes adatot
    throw new Error(`API hiba: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  // ✅ HELYES – csak a hibakód kerül logolásra, nem a payload
  console.error('Fetch hiba:', error.message);
  
  // ❌ TILOS – soha ne logold a teljes request adatait
  // console.error('Fetch hiba:', JSON.stringify({ user: userData, error }));
}
```

---

## 4. URL-ek és Searchbar – Linkek Megjelenési Módja

### 4.1 Személyes adat az URL-ben – szigorúan tilos

Az URL-ek megjelennek a böngésző előzményeiben, a szerver access logjaiban, a referer headerekben, és megosztáskor harmadik félnek is kiadódhatnak. Ezért személyes adatot **soha** nem szabad URL-be helyezni.

```
❌ TILOS URL formák:
https://app.pelda.hu/profile?email=kovacs.janos@email.hu
https://app.pelda.hu/search?name=Kovács+János
https://app.pelda.hu/user/kovacs.janos@email.hu/settings
https://app.pelda.hu/reset-password?token=abc123&email=user@email.hu

✅ HELYES URL formák:
https://app.pelda.hu/profile/{uuid}              — belső azonosítóval
https://app.pelda.hu/search                       — a keresési paraméter POST body-ban
https://app.pelda.hu/user/{userId}/settings       — nem személyes azonosítóval
https://app.pelda.hu/reset-password/{token}       — csak a token, email nélkül
```

### 4.2 Keresőmező (searchbar) megvalósítása GDPR-kompatibilisan

Ha a searchbar személyes adatot is kereshet (pl. felhasználók keresése e-mail alapján), az alábbi mintát kell követni:

```javascript
// ✅ HELYES – keresés POST-tal, nem GET-tel
async function searchUsers(query) {
  const response = await fetch('https://api.pelda.hu/admin/users/search', {
    method: 'POST', // nem GET! A query nem kerül az URL-be
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ query }) // a keresési kifejezés a body-ban marad
  });
  return response.json();
}

// ❌ KERÜLENDŐ – GET-tel a keresési kifejezés az URL-be kerül
async function searchUsers(query) {
  return fetch(`/api/users?search=${query}`); // logokban marad!
}
```

### 4.3 Routing és navigáció

Kliens oldali routing esetén az URL-ben csak nem személyes belső azonosítók (UUID, numerikus ID) szerepelhetnek. A neveket, e-mail-eket és egyéb személyes adatokat az alkalmazás állapotában (state) kell kezelni, nem az URL-ben.

```javascript
// ✅ HELYES React Router példa
<Route path="/felhasznalo/:userId" component={UserProfile} />
// Az oldal betöltése után az API-ból kéri le az adatokat az ID alapján

// ❌ KERÜLENDŐ
<Route path="/felhasznalo/:email" component={UserProfile} />
// Az e-mail megjelenik az URL-ben és a böngésző előzményeiben!
```

---

## 5. Hozzájárulás-kezelés (Consent Management)

### 5.1 Hozzájárulás rögzítése

Ha az adatkezelés jogalapja a hozzájárulás, azt bizonyíthatóan és visszavonhatóan kell kezelni. A hozzájárulást adatbázisban kell tárolni a következő adatokkal:

```sql
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  purpose VARCHAR(100) NOT NULL,         -- mire vonatkozik (marketing, analytics stb.)
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMP,
  revoked_at TIMESTAMP,
  ip_address INET,                        -- a hozzájárulás forrása
  privacy_policy_version VARCHAR(10) NOT NULL,
  method VARCHAR(50)                      -- 'checkbox', 'api', 'verbal' stb.
);
```

### 5.2 Hozzájárulás visszavonása

A visszavonásnak ugyanolyan egyszerűnek kell lennie, mint a megadásnak. Az API-ban biztosítani kell egy végpontot a visszavonásra, és a visszavonás után az adott célra vonatkozó feldolgozást le kell állítani.

```javascript
// ✅ Hozzájárulás visszavonásának kezelése
app.delete('/api/consent/:purpose', authenticate, async (req, res) => {
  const { purpose } = req.params;
  const userId = req.user.id;
  
  await db.query(`
    UPDATE consents 
    SET granted = false, revoked_at = NOW()
    WHERE user_id = $1 AND purpose = $2 AND granted = true
  `, [userId, purpose]);
  
  // Ha marketing hozzájárulás vonódott vissza, azonnal le kell állítani
  // a marketinglistáról való feldolgozást is
  if (purpose === 'marketing') {
    await removeFromMarketingList(userId);
  }
  
  res.json({ success: true, message: 'Hozzájárulás visszavonva.' });
});
```

---

## 6. Érintetti Jogok Technikai Megvalósítása

A GDPR hat érintetti jogot biztosít, amelyek mindegyikéhez kötelező API végpontot vagy adatbázis-folyamatot biztosítani.

### 6.1 Hozzáférési jog (Art. 15) – Adatexport végpont

```javascript
// GET /api/gdpr/my-data – a felhasználó lekéri az összes tárolt adatát
app.get('/api/gdpr/my-data', authenticate, async (req, res) => {
  const userId = req.user.id;
  
  // Összegyűjtjük az összes tárolt adatot – minden táblából!
  const [userData, consents, orders, logs] = await Promise.all([
    db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [userId]),
    db.query('SELECT * FROM consents WHERE user_id = $1', [userId]),
    db.query('SELECT id, total, created_at FROM orders WHERE user_id = $1', [userId]),
    db.query('SELECT action, created_at FROM audit_logs WHERE user_id = $1', [userId])
  ]);
  
  // Gépileg olvasható formátumban kell visszaadni (JSON vagy CSV)
  res.json({
    export_date: new Date().toISOString(),
    user: userData.rows[0],
    consents: consents.rows,
    orders: orders.rows,
    activity_logs: logs.rows
  });
});
```

### 6.2 Törlési jog (Art. 17) – "Elfeledtetéshez való jog"

```javascript
// DELETE /api/gdpr/delete-account
app.delete('/api/gdpr/delete-account', authenticate, async (req, res) => {
  const userId = req.user.id;
  
  // Figyelem: egyes adatokat jogi kötelezettség miatt meg KELL őrizni
  // (pl. számviteli bizonylatok 8 évig) – ezeket csak anonimizálni szabad!
  
  await db.transaction(async (trx) => {
    // Anonimizálás – személyes adatok felülírása, nem törlés, ahol jogi kötelezettség van
    await trx.query(`
      UPDATE users SET 
        name = 'Törölt Felhasználó',
        email = CONCAT('deleted_', id, '@deleted.invalid'),
        phone = NULL,
        address = NULL,
        anonymized = true,
        anonymized_at = NOW()
      WHERE id = $1
    `, [userId]);
    
    // Hozzájárulások törlése
    await trx.query('DELETE FROM consents WHERE user_id = $1', [userId]);
    
    // Session-ök érvénytelenítése
    await trx.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
  });
  
  res.json({ success: true });
});
```

> **⚠️ AGENT FIGYELMEZTETÉS:** A törlési folyamat tervezésekor mindig ellenőrizd, hogy mely adatokat kötelező jogi okokból megőrizni (számla, tranzakció stb.). Ezeket anonimizálni kell, nem törölni! Ha bizonytalan vagy, állj meg és kérdezd meg a felhasználót.

### 6.3 Adathordozhatóság (Art. 20)

Az adatexportot gépileg olvasható, szabványos formátumban kell biztosítani (JSON, CSV). A felhasználónak joga van az adatait egy másik szolgáltatóhoz vinni.

### 6.4 Helyesbítési jog (Art. 16)

Minden személyes adathoz kötelező biztosítani egy szerkesztési felületet vagy API végpontot, amelyen a felhasználó kijavíthatja a pontatlan adatokat.

---

## 7. Naplózás (Audit Logging) és Adatszivárgás-megelőzés

### 7.1 Kötelező audit log

Minden adatbázis-műveletet, amely személyes adatot érint, naplózni kell egy audit log táblában. A napló maga is személyes adatot tartalmazhat, ezért ugyanúgy GDPR hatálya alá esik.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),        -- kinek az adatát érintette
  actor_id UUID REFERENCES users(id),       -- ki végezte a műveletet
  action VARCHAR(50) NOT NULL,              -- 'READ', 'UPDATE', 'DELETE', 'EXPORT'
  table_name VARCHAR(100),
  record_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 7.2 Mit NE logolj

A logokban tilos személyes adatot tiszta szövegként megjeleníteni:

```javascript
// ❌ TILOS – személyes adat a logban
console.log(`Felhasználó bejelentkezett: ${user.email}, jelszó: ${password}`);
logger.info({ user: userData }); // az összes mező a logba kerül!

// ✅ HELYES – csak azonosítók és műveletek
console.log(`Felhasználó bejelentkezett: userId=${user.id}`);
logger.info({ action: 'LOGIN', userId: user.id, timestamp: Date.now() });
```

### 7.3 Environment változók és titkok kezelése

Adatbázis kapcsolati stringek, API kulcsok, titkosítási kulcsok soha nem kerülhetnek kódba, git repóba vagy logba:

```javascript
// ✅ HELYES – environment változóból
const dbUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

// ❌ TILOS – hardcoded titkok, azonnal GDPR és biztonsági kockázat
const dbUrl = 'postgresql://user:password@localhost/mydb'; // ÁLLJ MEG!
const jwtSecret = 'titkosjelszo123'; // ÁLLJ MEG!
```

---

## 8. Cookie-k és Session-kezelés

### 8.1 Cookie-k GDPR követelményei

A cookie-kat kategóriákba kell sorolni, és a nem feltétlenül szükséges cookie-khoz hozzájárulást kell kérni:

- **Feltétlenül szükséges:** Session cookie, biztonsági token – hozzájárulás nélkül is engedélyezett
- **Funkcionális:** Felhasználói preferenciák – hozzájárulás szükséges
- **Analitikai:** Látogatásstatisztika – hozzájárulás szükséges  
- **Marketing:** Hirdetési célzás – hozzájárulás szükséges

```javascript
// ✅ HELYES cookie beállítások
res.cookie('session_id', token, {
  httpOnly: true,      // JavaScript nem férhet hozzá (XSS védelem)
  secure: true,        // csak HTTPS-en küldi el a böngésző
  sameSite: 'Strict',  // CSRF védelem
  maxAge: 3600000,     // lejárati idő meghatározva (1 óra)
  // domain és path is meghatározva, ha szükséges
});

// ❌ KERÜLENDŐ
res.cookie('session_id', token); // nincs httpOnly, secure, sameSite!
```

### 8.2 IP-cím kezelése

Az IP-cím személyes adat. Ha naplózod, meg kell határozni a jogalapot és a megőrzési időt. Analitikai célokra az IP-cím utolsó oktetjét anonimizálni kell:

```javascript
// ✅ HELYES – IP anonimizálás analitikához
function anonymizeIP(ip) {
  // IPv4: az utolsó oktet törlése
  return ip.replace(/(\d+\.\d+\.\d+\.)\d+/, '$10');
  // pl. 192.168.1.42 → 192.168.1.0
}
```

---

## 9. Harmadik Fél Szolgáltatások Integrálása

### 9.1 Adattovábbítás EU-n kívülre

Ha harmadik fél szolgáltatást (pl. AWS us-east, Google Analytics, SendGrid) integrálsz, ellenőrizni kell, hogy az adattovábbítás megfelel-e a GDPR-nak. Csak olyan szolgáltatók alkalmazhatók, amelyek megfelelő garanciákat nyújtanak (pl. EU-US Data Privacy Framework, Standard Contractual Clauses).

> **⚠️ AGENT ELLENŐRZÉS:** Ha új harmadik fél integrációt vezetsz be, állj meg és kérdezd meg a felhasználót, hogy az adott szolgáltató adatfeldolgozói szerződése (DPA – Data Processing Agreement) megkötve van-e. Enélkül a személyes adatok továbbítása tilos!

### 9.2 Adatfeldolgozói lánc dokumentálása

Minden harmadik fél szolgáltatót, amelynek személyes adathoz hozzáférése van, az adatkezelési nyilvántartásban kell rögzíteni.

---

## 10. Agent Folyamatos Ellenőrzési Protokoll

### 10.1 Minden kódírás előtt ellenőrizd

Mielőtt bármilyen adatkezelési kódot írsz, válaszolj ezekre a kérdésekre:

1. **Tartalmaz-e az adat személyes adatot?** Ha igen, melyik jogalapra támaszkodik az adatkezelés?
2. **Szükséges-e minden mező?** Alkalmazd az adattakarékosság elvét.
3. **Titkosítva van-e a kapcsolat?** HTTPS és SSL/TLS kötelező.
4. **Kerül-e személyes adat URL-be, logba vagy hibüzenetbe?** Ha igen, állj meg.
5. **Van-e meghatározott megőrzési idő?** Ha nem, add hozzá.

### 10.2 Adatbázis módosítás esetén kötelező felhasználói utasítás

Ha az adatbázisban GDPR-kompatibilitást biztosító módosítás szükséges, az agennek **expliciten utasítania kell a felhasználót**:

```
⚠️ GDPR MEGFELELŐSÉGI FIGYELMEZTETÉS

A következő adatbázis-módosítás szükséges a GDPR-nak való megfeleléshez.
Kérlek, futtasd le az alábbi parancsokat az adatbázison:

[SQL parancsok]

Addig nem folytatom a fejlesztést, amíg ezt el nem végzed, 
mivel a jelenlegi állapot GDPR-sértést jelent.
```

### 10.3 Azonnali leállás triggerei

Az agentnek azonnal le kell állnia és a felhasználót értesítenie kell, ha az alábbi helyzetek bármelyike fennáll:

- Személyes adat HTTP-n (nem HTTPS-en) kerülne átvitelre
- Jelszó vagy egyéb érzékeny adat titkosítatlanul kerülne adatbázisba
- Személyes adat URL-paraméterbe kerülne (GET kérés)
- SQL injection lehetőség kódban
- Hozzájárulás rögzítése nélkül gyűjtene személyes adatot
- Hardcoded credentials (jelszó, API kulcs) kerülne kódba
- Megőrzési idő nélkül tárolna személyes adatot az adatbázis
- Audit log nélkül történne személyes adaton CRUD művelet

---

## 11. Adatvédelmi Incidens (Data Breach) Kezelés

Ha fejlesztés közben potenciális adatvédelmi incidenst azonosítasz (pl. szivárgó API, titkosítatlan adatok), az agennek azonnal jeleznie kell:

```
🚨 POTENCIÁLIS ADATVÉDELMI INCIDENS AZONOSÍTVA

Leírás: [mi a probléma]
Érintett adatok: [milyen adatot érint]
Kockázat szintje: [magas/közepes/alacsony]
Szükséges azonnali lépések: [mit kell tenni]

FIGYELEM: A GDPR 72 óra alatt hatóságnak való bejelentést ír elő,
ha az incidens valószínűsíthetően kockázatot jelent az érintettekre!
Értesítsd az adatvédelmi felelőst (DPO) azonnal.
```

---

## 12. Hivatkozások és Jogforrások

Ez a dokumentum a következő jogszabályokon és iránymutatásokon alapul, amelyeket a kódolásban érintett döntéseknél figyelembe kell venni:

- **GDPR** — Az Európai Parlament és a Tanács (EU) 2016/679 rendelete (2018. május 25-től hatályos)
- **EDPB iránymutatások** — Az Európai Adatvédelmi Testület kötelező iránymutatásai (edpb.europa.eu)
- **NAIH határozatok** — Nemzeti Adatvédelmi és Információszabadság Hatóság gyakorlata (naih.hu)
- **OWASP Top 10** — Webalkalmazás-biztonsági kockázatok (owasp.org)
- **NIS2 irányelv** — Az EU kiberbiztonsági irányelve, amely az adatbiztonságra is vonatkozik

---

*Ez a szabályzat kötelező érvényű a kódoló agent minden adatkezelési tevékenységére. Módosítása csak az adatvédelmi felelős (DPO) jóváhagyásával lehetséges. Utolsó felülvizsgálat: 2025.*