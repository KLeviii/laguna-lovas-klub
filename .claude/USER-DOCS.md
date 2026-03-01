# Felhasználói Dokumentáció Készítési Utasítások

> **Ezek az utasítások egy Claude Code példánynak szólnak**, amely egy Vue.js projekten dolgozik.
> Feladatod: készítsd el a szoftver teljes **felhasználói dokumentációját** egyetlen `.docx` fájlként, az alábbi irányelvek szerint.

---

## Általános elvek

### Ki a célközönség?
A dokumentáció **nem fejlesztőknek** szól. A célközönség:
- A szoftver **megrendelője** (aki elrendelte a fejlesztést, de nem feltétlenül ért a technológiához)
- **Napi szintű felhasználók** (irodai dolgozók, adminisztrátorok, ügyintézők stb.)
- **Laikusok**, akik technikai előképzettség nélkül kell, hogy boldoguljanak a rendszerrel

### Írói stílus szabályok
- ❌ **Tilos** technikai zsargon magyarázat nélkül (pl. „API", „deploy", „npm", „build", „Vue component")
- ✅ Használj **hétköznapi, egyszerű magyar nyelvet**
- ✅ Minden lépést **sorszámozva**, sorrendben írj le
- ✅ Jelöld meg, **mit lát a felhasználó a képernyőn** (gomb neve, menüpont, szöveg)
- ✅ Adj meg **példákat** és **tipikus eseteket**
- ✅ Ha valamit el lehet rontani, írd le **mire figyeljen oda**
- ✅ Használj **félkövér** szedést a fontos dolgokhoz (gombnevek, mezőnevak)

---

## A dokumentáció szerkezete

A `.docx` fájl három egymást követő fejezetet tartalmazzon, egy dokumentumon belül. A fejezetek sorrendje:

1. Felhasználói kézikönyv
2. Telepítési útmutató
3. GYIK / Tudásbázis

---

## 1. fejezet – Felhasználói kézikönyv

### Mit kell tartalmaznia?
Tekintsd át a Vue projekt összes oldalát, komponensét és funkcióját. Minden egyes funkciót **a felhasználó szemszögéből** mutass be.

### Kötelező tartalmi elemek:
- **Bevezetés**: Mi ez a szoftver? Mire való? Milyen problémát old meg? Kinek szól? (laikusan, 1-3 mondat)
- **Az alkalmazás áttekintése**: A főbb oldalak/részek felsorolása, navigáció leírása
- **Funkciók részletes leírása**: Minden egyes funkcióhoz külön alfejezet az alábbi tartalommal:
  - Mit csinál ez a funkció? (1-2 mondatos összefoglaló)
  - Hogyan érhető el?
  - A használat lépései sorszámozva
  - Mit lát a felhasználó az eredmény után?
  - Mire figyeljen oda (ha van buktatója)?
- **Hasznos tippek** a hatékony használathoz

### Hogyan dolgozz?
1. Olvasd végig a projekt `src/` mappáját – különösen a `views/`, `pages/`, `components/` mappákat
2. Azonosítsd az összes felhasználó felé látható funkciót
3. Kövesd a router konfigurációt (pl. `router/index.js`) az oldalak feltérképezéséhez
4. Nézd meg a form elemeket, gombokat, táblázatokat – ezekből derül ki, mit csinálhat a felhasználó
5. Ha van `README.md` vagy egyéb leírás, azt is vedd figyelembe

---

## 2. fejezet – Telepítési útmutató

### Mit kell tartalmaznia?
Hogyan helyezi üzembe a szoftvert a megrendelő vagy egy általa megbízott (nem feltétlenül fejlesztő) személy? A cél: **nulláról működő rendszer**, érthetően.

### Kötelező tartalmi elemek:
- **Mire lesz szükség?**: Szükséges eszközök, hozzáférések, minimális technikai követelmények (laikusan fogalmazva)
- **Telepítés lépései**: Minden egyes lépés sorszámozva, részletesen
- **Első indítás és beállítás**: Hogyan kell először belépni? Milyen alapbeállításokat kell elvégezni? Alapértelmezett belépési adatok (ha van)
- **Ellenőrzés**: Honnan tudja a felhasználó, hogy minden rendben települt?
- **Hibaelhárítás telepítéskor**: A 3 leggyakoribb telepítési probléma és megoldásuk

### Hogyan dolgozz?
1. Ellenőrizd a `package.json`-t, `vite.config.js`-t vagy `vue.config.js`-t a build és szerver-igények megértéséhez
2. Keresd meg, hogy az alkalmazás milyen környezetben fut (pl. statikus tárhely, Node.js szerver, Docker)
3. Nézd meg a `.env.example` vagy hasonló konfigurációs fájlokat
4. Ha Docker-rel vagy CI/CD-vel dolgozik a projekt, azt fordítsd le emberi nyelvre
5. **Soha ne feltételezd**, hogy a megrendelő tudja, mi az a „terminál" vagy „parancssor" – ha mégis szükséges, magyarázd el nagyon részletesen

---

## 3. fejezet – GYIK / Tudásbázis

### Mit kell tartalmaznia?
A leggyakoribb kérdések és problémák, amelyekkel egy nem technikai felhasználó szembesülhet, kérdés-válasz formátumban. Legalább **15 kérdés-válasz párt** tartalmazzon.

### Kötelező témakörök:
- Általános kérdések a szoftverről
- Bejelentkezés és hozzáférés (pl. elfelejtett jelszó)
- A fő funkciók használatával kapcsolatos kérdések
- Hibák és problémák (hibaüzenetek, be nem töltő oldal stb.)
- Adatok és mentés

### Hogyan dolgozz?
1. Gondolkodj el: **mit kérdezne egy teljesen új felhasználó** az első 5 percben?
2. Gondolkodj el: **mi szokott félremenni** az ilyen típusú alkalmazásoknál?
3. Nézd meg az alkalmazás validációs üzeneteit, hibaállapotait – ezek jelzik, hol hibázhat a felhasználó
4. A válaszok legyenek **konkrétak** – ne csak azt írd, hogy „vegye fel a kapcsolatot az ügyfélszolgálattal", hanem adj valódi megoldást, ha lehetséges

---

## A .docx fájl elkészítése

### Technikai elvárások
- Az összes fejezet **egyetlen `.docx` fájlba** kerüljön
- Használj `npm install -g docx` eszközt a dokumentum generálásához
- A dokumentumnak legyen **tartalomjegyzéke** az elején
- Fejezetek elválasztásához használj oldalváltást (`PageBreak`)
- Alkalmazz egységes fejléc-stílusokat (Heading 1 a fő fejezetek, Heading 2 az alfejezetek)
- A sorszámozott lépéseket `LevelFormat.DECIMAL` listával formázd
- A figyelmeztetéseket és tippeket emeld ki vizuálisan (pl. félkövér szöveg)
- A dokumentum legyen A4-es méretű

### Végrehajtási sorrend
1. Projekt áttekintése (`src/` mappa, router, komponensek, konfigurációs fájlok)
2. A tartalom összeállítása mind a három fejezethez
3. A `.docx` fájl legenerálása JavaScript (`docx` csomag) segítségével
4. Validálás (`python scripts/office/validate.py`)
5. A kész fájl elhelyezése: `docs/felhasznaloi-dokumentacio.docx`

### Minőségellenőrzés – ezt kérdezd meg magadtól
Mielőtt befejezed, ellenőrizd:
- Érthető-e egy 50 éves, nem IT-s személy számára is?
- Minden lépés sorszámozott és konkrét?
- Nincs magyarázatlan technikai szó?
- Szerepel-e benne, mit lát a felhasználó a képernyőn minden fontos lépésnél?
- A GYIK-ban legalább 15 kérdés-válasz pár szerepel?
- A telepítési útmutató lefedi az első bejelentkezést is?
- A tartalomjegyzék helyesen hivatkozik minden fejezetre?

---

*Ez az utasításfájl a Claude Code példánynak szól. A végfelhasználó soha nem látja ezt a fájlt.*