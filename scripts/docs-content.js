// Felhasználói dokumentáció tartalma — Laguna Lovasklub
// Minden szöveg magyar nyelvű, laikus célközönségnek szól.

// Csomóponttípusok:
// h1, h2, h3      — fejlécek
// body             — normál bekezdés
// bold             — félkövér bekezdés (figyelmeztetés, kiemelés)
// steps            — sorszámozott lépések (items tömb)
// warning          — figyelmeztető bekezdés
// qa               — kérdés-válasz pár ({ q, a })

export const chapter1 = {
  title: 'Felhasználói kézikönyv',
  sections: [
    // --- Bevezetés ---
    {
      heading: 'Bevezetés',
      level: 2,
      content: [
        {
          type: 'body',
          text: 'A Laguna Lovasklub weboldala egy internetes alkalmazás, amely a hérégi (Komárom-Esztergom megye) Laguna Lovasklub bemutatkozó felülete. Az oldalon megtalálható a klub bemutatása, az eladó és nem eladó lovak listája és részletes adatlapja, a versenyeredmények, egy webshop, valamint egy kapcsolatfelvételi űrlap. A weboldal adminisztrátori felületet is tartalmaz, amelyen a klub munkatársai kezelhetik a tartalmakat.',
        },
        {
          type: 'body',
          text: 'A dokumentáció célja, hogy segítse a felhasználókat az alkalmazás könnyű és hatékony használatában, legyen szó akár a nyilvános oldalak böngészéséről, akár az adminisztrátori feladatok ellátásáról.',
        },
      ],
    },

    // --- Az alkalmazás áttekintése ---
    {
      heading: 'Az alkalmazás áttekintése',
      level: 2,
      content: [
        {
          type: 'body',
          text: 'Az alkalmazás egy böngészőben futó weboldal, amely számítógépen, táblagépen és okostelefonon egyaránt használható. Nincs szükség semmilyen program telepítésére — elég megnyitni egy böngészőt (például Google Chrome, Mozilla Firefox, Microsoft Edge vagy Safari).',
        },
      ],
    },
    {
      heading: 'Navigáció',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Az oldal tetején egy navigációs sáv (menüsor) található, amely minden oldalon látható. A menüsor az alábbi menüpontokat tartalmazza:',
        },
        {
          type: 'steps',
          items: [
            'Rólunk — a klub bemutatkozó oldala (ez a főoldal)',
            'Webshop — a termékek böngészése és vásárlása',
            'Kosár ikon — a bevásárlókosár tartalma (a kis szám jelzi, hány termék van benne)',
            'Lovaink — a klub lovainak listája',
            'Eredményeink — a versenyeredmények áttekintése',
            'Kapcsolat — kapcsolatfelvételi űrlap',
          ],
        },
        {
          type: 'body',
          text: 'Ha a felhasználó nincs bejelentkezve, a menüsorban megjelenik egy Bejelentkezés gomb (lakat ikon). Ha be van jelentkezve, helyette az Admin és a Kijelentkezés gombok láthatók.',
        },
        {
          type: 'body',
          text: 'Okostelefonon a menü egy úgynevezett „hamburger" gomb (három vízszintes vonal) mögé kerül. Erre kattintva megjelenik a menülista.',
        },
      ],
    },
    {
      heading: 'Sötét és világos megjelenés',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'A menüsorban található egy nap/hold ikon, amellyel válthat a sötét és a világos megjelenési mód között. Az alkalmazás alapértelmezetten sötét módban indul. A választás megőrződik: ha legközelebb megnyitja az oldalt, az utoljára választott megjelenés töltődik be.',
        },
      ],
    },

    // --- Nyilvános oldalak ---
    {
      heading: 'Nyilvános oldalak',
      level: 2,
      content: [
        {
          type: 'body',
          text: 'Az alábbi oldalak mindenki számára elérhetők, bejelentkezés nélkül.',
        },
      ],
    },

    // Rólunk
    {
      heading: 'Rólunk (Főoldal)',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Ez az oldal az alkalmazás nyitóoldala. Itt olvasható a klub bemutatkozása, a filozófiája és a szolgáltatásai.',
        },
        {
          type: 'body',
          text: 'Az oldalon az alábbi tartalmak jelennek meg:',
        },
        {
          type: 'steps',
          items: [
            'Fejléckép a „Rólunk" felirattal.',
            'A klub bemutatkozó szövege.',
            'Szolgáltatások szekció — négy kártya, amelyek a klub főbb szolgáltatásait mutatják be: lóbetörés és sportlovak felkészítése, lótartás (beállóhelyek), lovasoktatás, valamint Hofmag mágnesterápia.',
            'Eladó lovak szekció — ha vannak eladásra kínált lovak, itt legfeljebb kettő jelenik meg képpel és egy „Tudj meg többet" hivatkozással.',
            'Legutóbbi versenyek szekció — az öt legfrissebb verseny neve és dátuma látható, amelyekre kattintva az Eredményeink oldalra jutunk.',
          ],
        },
      ],
    },

    // Lovaink
    {
      heading: 'Lovaink',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Ezen az oldalon a klub összes lova megtekinthető kártyás elrendezésben.',
        },
        {
          type: 'bold',
          text: 'Hogyan érhető el: Kattintson a menüsorban a „Lovaink" menüpontra.',
        },
        {
          type: 'body',
          text: 'A használat lépései:',
        },
        {
          type: 'steps',
          items: [
            'Az oldal tetején három szűrőgomb található: „Összes", „Eladók" és „Nem eladók". Ezekre kattintva szűrheti a lovak listáját.',
            'Minden lókártya tartalmazza: a ló fényképét, a nevét, a nemét (mén vagy kanca, ikonnal jelölve), a születési dátumát, valamint egy „Eladó" (zöld) vagy „Nem eladó" (szürke) jelölést.',
            'Kattintson egy ló kártyájára a részletes adatlap megnyitásához.',
          ],
        },
      ],
    },

    // Ló részletes oldal
    {
      heading: 'Ló részletes adatlapja',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Egy adott ló részletes adatlapja a ló kártyájára kattintva érhető el a Lovaink oldalról.',
        },
        {
          type: 'body',
          text: 'Az adatlap tartalma:',
        },
        {
          type: 'steps',
          items: [
            'Fejléckép a ló nevével.',
            'Fotógaléria — ha több kép is tartozik a lóhoz, a „Következő" és „Előző" gombokkal lapozhat. A képek száma is látható (pl. „1 / 3").',
            'A ló neve, neme (mén vagy kanca), születési dátuma és eladási státusza.',
            'A ló leírása.',
            'Származási táblázat — a ló apja (fedeztetőmén) és anyja (anyakanca). Ha ezek a lovak is szerepelnek a rendszerben, nevükre kattintva megnyithatja az ő adatlapjukat is.',
            'Családfa megtekintése gomb — megnyomásával egy teljes képernyős interaktív családfa-ábra jelenik meg, ahol a lovak nemük szerint színezve (kék = mén, piros = kanca) láthatók, és rájuk kattintva megnyithatók az adatlapjaik.',
            'Ha a ló eladásra kínált, egy információs doboz jelenik meg a kapcsolatfelvételi lehetőségről.',
            'Hasonló lovak szekció — az oldal alján legfeljebb 4 hasonló nemű ló kártyája jelenik meg.',
          ],
        },
        {
          type: 'body',
          text: 'A „Vissza a listára" gombbal visszatérhet a lovak listájához.',
        },
      ],
    },

    // Webshop
    {
      heading: 'Webshop',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'A webshopban a klub által kínált termékek böngészhetők és rendelhetők meg.',
        },
        {
          type: 'bold',
          text: 'Hogyan érhető el: Kattintson a menüsorban a „Webshop" menüpontra.',
        },
        {
          type: 'body',
          text: 'A használat lépései:',
        },
        {
          type: 'steps',
          items: [
            'Az oldal tetején kategória-szűrő gombok találhatók. Az „Összes" gombbal minden termék megjelenik; az egyes kategórianevekre kattintva csak az adott kategória termékei szűrődnek.',
            'A termékek kártyás elrendezésben jelennek meg. Minden kártya tartalmazza: a termék képét, nevét, rövid leírását, árát (Ft-ban) és a készlet állapotát („Készleten" vagy „Nincs készleten").',
            'Ha a termék készleten van, közvetlenül a kártyáról a „Kosárba" gombbal a kosárba teheti.',
            'A kártyára kattintva megnyílik a termék részletes oldala.',
          ],
        },
      ],
    },

    // Termék részletes oldal
    {
      heading: 'Termék részletes oldala',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Egy termék részletes oldala a webshopban a termék kártyájára kattintva érhető el.',
        },
        {
          type: 'body',
          text: 'Az oldal tartalma:',
        },
        {
          type: 'steps',
          items: [
            'A termék képe nagy méretben.',
            'A termék neve és kategóriája.',
            'Az ár zöld színnel kiemelve.',
            'Készletállapot: „Készleten" (zöld, ha 10-nél több van), „Alacsony készlet: X db" (sárga figyelmeztetés, ha kevesebb mint 10 van) vagy „Nincs készleten" (szürke).',
            'A termék részletes leírása.',
            'Mennyiségválasztó (+/– gombokkal) — csak akkor jelenik meg, ha a termék készleten van. A választható mennyiség nem haladhatja meg a tényleges készletet.',
            'Kosárba gomb — a beállított mennyiséget a kosárba helyezi. A gomb rövid időre zöldre vált, jelezve a sikeres hozzáadást.',
            'Az oldal alján legfeljebb 4 hasonló kategóriájú termék jelenik meg ajánlásként.',
          ],
        },
        {
          type: 'body',
          text: 'A „Vissza a termékekhez" gombbal visszatérhet a webshop főoldalára.',
        },
      ],
    },

    // Kosár
    {
      heading: 'Kosár',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'A kosár tartalmazza az összes terméket, amelyet korábban a „Kosárba" gombbal hozzáadott.',
        },
        {
          type: 'bold',
          text: 'Hogyan érhető el: Kattintson a menüsorban a kosár ikonra, vagy a termék részletes oldaláról a kosár felé navigálva.',
        },
        {
          type: 'body',
          text: 'A használat lépései:',
        },
        {
          type: 'steps',
          items: [
            'A kosár táblázatos formában jeleníti meg a termékeket: kép, név (kattintható hivatkozás a termékhez), egységár, mennyiség, részösszeg és egy törlés gomb.',
            'A mennyiséget a +/– gombokkal módosíthatja, vagy közvetlenül beírhatja.',
            'Egy adott termék eltávolításához kattintson az X gombra a sor végén.',
            'Az összes termék egyszerre törölhető a „Kosár ürítése" gombbal.',
            'A jobb oldalon látható az összesítő: összes termék darabszáma és a végösszeg.',
            'A „Tovább a pénztárhoz" gombbal a pénztár oldalra juthat.',
            'A „Vásárlás folytatása" gombbal visszatérhet a webshopba.',
          ],
        },
        {
          type: 'body',
          text: 'Ha a kosár üres, egy tájékoztató szöveg jelenik meg, és egy gomb, amellyel visszatérhet a webshopba.',
        },
        {
          type: 'warning',
          text: 'Figyelem: A kosár tartalma az oldal bezárásakor elveszhet. Ajánlott a megrendelést egy munkamenetben befejezni.',
        },
      ],
    },

    // Pénztár
    {
      heading: 'Pénztár',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'A pénztár oldalon a megrendelés véglegesíthető. A szállítási és fizetési funkció jelenleg fejlesztés alatt áll.',
        },
        {
          type: 'body',
          text: 'Az oldalon a kosár tartalma összesítve jelenik meg (termék neve, mennyisége, egységára és részösszege). A szállítás és a fizetés szekcióknál egy „Hamarosan elérhető!" tájékoztató jelenik meg. A megrendelés gomb jelenleg nem aktív.',
        },
        {
          type: 'warning',
          text: 'Figyelem: A megrendelés funkció a weboldal jelen verziójában még nem működik. Ha rendelni szeretne, kérjük, vegye fel a kapcsolatot a klubbal az elérhetőségek egyikén.',
        },
      ],
    },

    // Eredményeink
    {
      heading: 'Eredményeink',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Ezen az oldalon a klub versenyeredményei tekinthetők meg évek szerinti bontásban.',
        },
        {
          type: 'bold',
          text: 'Hogyan érhető el: Kattintson a menüsorban az „Eredményeink" menüpontra.',
        },
        {
          type: 'body',
          text: 'Az oldal felépítése:',
        },
        {
          type: 'steps',
          items: [
            'Az oldal tetején három statisztikai kártya látható: az aktív versenyzők száma, a bajnoki címek száma és az összes elért helyezés.',
            'Az eredmények évek szerint csoportosítva jelennek meg. A legfrissebb év automatikusan nyitva van.',
            'Egy évre kattintva legördül a versenyek listája. Minden évnél látható a versenyek száma is.',
            'Egy versenyre kattintva megjelenik a verseny képe (ha van), leírása, valamint az eredmények táblázata.',
            'Az eredménytáblázat oszlopai: helyezés (színes jelzéssel — arany = 1. hely, szürke = 2. hely, piros = 3. hely, kék = egyéb), versenyző neve, ló neve, szakág és elért eredmény.',
          ],
        },
      ],
    },

    // Kapcsolat
    {
      heading: 'Kapcsolat',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'A kapcsolatfelvételi oldalon üzenetet küldhet a klubnak.',
        },
        {
          type: 'bold',
          text: 'Hogyan érhető el: Kattintson a menüsorban a „Kapcsolat" menüpontra.',
        },
        {
          type: 'body',
          text: 'Az űrlap kitöltésének lépései:',
        },
        {
          type: 'steps',
          items: [
            'Töltse ki a „Név" mezőt (kötelező).',
            'Töltse ki az „E-mail cím" mezőt (kötelező).',
            'Opcionálisan adja meg a telefonszámát.',
            'Opcionálisan adja meg az üzenet tárgyát.',
            'Írja be az üzenetét a szöveges mezőbe (kötelező).',
            'Jelölje be az adatvédelmi hozzájárulás jelölőnégyzetét. Az adatvédelmi nyilatkozat hivatkozásra kattintva elolvashatja annak tartalmát.',
            'Kattintson a „Küldés" gombra.',
          ],
        },
        {
          type: 'body',
          text: 'Sikeres küldés után egy „Köszönjük az üzenetét! Hamarosan felvesszük Önnel a kapcsolatot." szöveg jelenik meg. Ha hiba történik, erről hibaüzenet tájékoztatja.',
        },
        {
          type: 'warning',
          text: 'Figyelem: Az űrlap csak akkor küldhető el, ha minden kötelező mező ki van töltve, és az adatvédelmi hozzájárulás be van jelölve.',
        },
      ],
    },

    // Adatvédelmi nyilatkozat
    {
      heading: 'Adatvédelmi nyilatkozat',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Az adatvédelmi nyilatkozat az oldal láblécében és a kapcsolatfelvételi űrlapon található hivatkozásra kattintva érhető el. Itt olvasható, hogy a Laguna Lovasklub Kft. milyen személyes adatokat kezel, milyen jogalappal, és milyen jogai vannak a felhasználónak (hozzáférés, helyesbítés, törlés kérése).',
        },
      ],
    },

    // Lábléc
    {
      heading: 'Lábléc',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Az oldal alján (lábléc) az alábbi információk találhatók minden oldalon:',
        },
        {
          type: 'steps',
          items: [
            'A klub logója és rövid leírása.',
            'Partnerek hivatkozásai: Hofmag, Equiterra, Bemer, St. Hippolyt, Equine America.',
            'Közösségi média: Facebook és Instagram oldalak linkjei.',
            'Elérhetőségek: e-mail cím (lagunalovasklub@gmail.com), telefonszám (+36 20 981 3383) és a klub címe (2832 Héreg) térképes hivatkozással.',
            'Hivatkozás az adatvédelmi nyilatkozatra.',
          ],
        },
      ],
    },

    // --- Admin felület ---
    {
      heading: 'Adminisztrátori felület',
      level: 2,
      content: [
        {
          type: 'body',
          text: 'Az adminisztrátori felület kizárólag bejelentkezett felhasználók számára érhető el. Itt kezelhetők a lovak, termékek, versenyek és a beérkezett üzenetek.',
        },
      ],
    },

    // Bejelentkezés
    {
      heading: 'Bejelentkezés',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Az adminisztrátori felület eléréséhez be kell jelentkezni.',
        },
        {
          type: 'bold',
          text: 'Hogyan érhető el: Kattintson a menüsorban a „Bejelentkezés" (lakat ikon) gombra.',
        },
        {
          type: 'steps',
          items: [
            'Adja meg az e-mail címét.',
            'Adja meg a jelszavát.',
            'Kattintson a „Bejelentkezés" gombra.',
          ],
        },
        {
          type: 'body',
          text: 'Sikeres bejelentkezés után automatikusan az adminisztrátori irányítópultra kerül. Ha az adatok hibásak, egy „Hibás email vagy jelszó" hibaüzenet jelenik meg.',
        },
        {
          type: 'warning',
          text: 'Figyelem: A rendszerben nincs regisztrációs lehetőség. Az adminisztrátori fiókokat közvetlenül a rendszergazda hozza létre. Ha elfelejtette a jelszavát, forduljon a rendszergazdához.',
        },
      ],
    },

    // Admin irányítópult
    {
      heading: 'Irányítópult',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Az irányítópult az adminisztrátori felület nyitóoldala. Bejelentkezés után ide kerül a felhasználó.',
        },
        {
          type: 'body',
          text: 'Az oldalon négy kártya jelenik meg, amelyekre kattintva a megfelelő kezelőfelületre juthat:',
        },
        {
          type: 'steps',
          items: [
            'Lovak — lovak hozzáadása, szerkesztése és törlése.',
            'Termékek — webshop termékek és kategóriák kezelése.',
            'Versenyek — versenyesemények és eredmények kezelése.',
            'Üzenetek — a kapcsolatfelvételi űrlapon beérkezett üzenetek megtekintése.',
          ],
        },
        {
          type: 'body',
          text: 'Az oldalon gyors hivatkozások is találhatók a nyilvános oldalakra (főoldal, lovak, webshop, eredmények), így gyorsan ellenőrizheti, hogyan néz ki a tartalom a látogatók számára.',
        },
      ],
    },

    // Lovak kezelése
    {
      heading: 'Lovak kezelése',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Ezen az oldalon a klub lovainak adatait kezelheti: új lovat vehet fel, meglévőt szerkeszthet vagy törölhet.',
        },
        {
          type: 'bold',
          text: 'Hogyan érhető el: Az irányítópulton kattintson a „Lovak" kártyára.',
        },
        {
          type: 'body',
          text: 'A lovak táblázatos formában jelennek meg: azonosító, kép, név, nem, születési dátum és eladási státusz.',
        },
        {
          type: 'body',
          text: 'Új ló hozzáadása:',
        },
        {
          type: 'steps',
          items: [
            'Kattintson az „Új ló hozzáadása" gombra.',
            'Töltse ki a ló nevét (kötelező).',
            'Válassza ki a ló nemét: Mén vagy Kanca (kötelező).',
            'Adja meg a születési dátumot (dátumválasztó segítségével).',
            'Válassza ki az apa (fedeztetőmén) nevét a legördülő listából (opcionális — csak mén lovak jelennek meg).',
            'Válassza ki az anya (anyakanca) nevét a legördülő listából (opcionális — csak kanca lovak jelennek meg).',
            'Jelölje be az „Eladásra kínálva" jelölőnégyzetet, ha a ló eladó.',
            'Írja be a ló leírását a szöveges mezőbe (opcionális).',
            'Töltsön fel egy fényképet a lóról (JPG, PNG vagy WebP formátum, legfeljebb 5 MB méretben). A feltöltés után az előnézeti kép megjelenik.',
            'Kattintson a „Mentés" gombra.',
          ],
        },
        {
          type: 'body',
          text: 'Ló szerkesztése: A lovak listájában kattintson a kívánt ló „Szerkesztés" gombjára. A szerkesztőfelület ugyanazokat a mezőket tartalmazza, mint az új ló hozzáadásakor, előre kitöltve a meglévő adatokkal.',
        },
        {
          type: 'body',
          text: 'Ló törlése: Kattintson a „Törlés" gombra. Egy megerősítő ablak jelenik meg — a törlés csak az „Igen" gombra kattintva hajtódik végre.',
        },
        {
          type: 'warning',
          text: 'Figyelem: A ló törlése végleges és nem visszavonható! A törlés előtt győződjön meg róla, hogy valóban a megfelelő lovat választotta ki.',
        },
        {
          type: 'warning',
          text: 'Figyelem: Szerkesztés közben az apa és az anya nem módosítható. Ha ezeket az adatokat kell változtatni, törölje a lovat és hozza létre újra a helyes adatokkal.',
        },
      ],
    },

    // Termékek kezelése
    {
      heading: 'Termékek kezelése',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Ezen az oldalon a webshop termékeit és kategóriáit kezelheti.',
        },
        {
          type: 'bold',
          text: 'Hogyan érhető el: Az irányítópulton kattintson a „Termékek" kártyára.',
        },
        {
          type: 'body',
          text: 'Az oldal négy fül között válthat:',
        },
        {
          type: 'steps',
          items: [
            'Termékek listája — az összes termék táblázatos formában: azonosító, kép, név, kategória, ár, elérhetőség. Szerkesztés és törlés gombok minden sorban.',
            'Új termék — új termék létrehozása.',
            'Kategóriák — a termékkategóriák listája szerkesztési és törlési lehetőséggel.',
            'Új kategória — új kategória létrehozása.',
          ],
        },
        {
          type: 'body',
          text: 'Új termék hozzáadása:',
        },
        {
          type: 'steps',
          items: [
            'Kattintson az „Új termék" fülre.',
            'Válasszon kategóriát a legördülő listából (kötelező).',
            'Adja meg a termék nevét (kötelező).',
            'Írja be a termék leírását (opcionális).',
            'Adja meg az árat forintban (kötelező).',
            'Adja meg a készlet mennyiségét darabban.',
            'Töltsön fel egy termékfotót (JPG, PNG vagy WebP, legfeljebb 50 MB).',
            'Kattintson a „Mentés" gombra.',
          ],
        },
        {
          type: 'body',
          text: 'A termék elérhetősége automatikusan a készletmennyiség alapján kerül megállapításra: ha a készlet nagyobb, mint nulla, a termék „Készleten" lesz.',
        },
        {
          type: 'body',
          text: 'Új kategória hozzáadása: Kattintson az „Új kategória" fülre, adja meg a kategória nevét, majd kattintson a „Mentés" gombra. Meglévő kategória szerkesztéséhez kattintson a kategória melletti „Szerkesztés" gombra.',
        },
        {
          type: 'warning',
          text: 'Figyelem: Kategória törlésekor az adott kategóriába tartozó termékek kategória nélkül maradhatnak. Törlés előtt helyezze át a termékeket másik kategóriába.',
        },
      ],
    },

    // Versenyek kezelése
    {
      heading: 'Versenyek kezelése',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Ezen az oldalon a versenyeseményeket és az egyes versenyekhez tartozó eredményeket kezelheti.',
        },
        {
          type: 'bold',
          text: 'Hogyan érhető el: Az irányítópulton kattintson a „Versenyek" kártyára.',
        },
        {
          type: 'body',
          text: 'Két fül érhető el:',
        },
        {
          type: 'steps',
          items: [
            'Versenyek listája — az összes verseny táblázatos formában: azonosító, kép, név, helyszín, dátum, eredmények száma. Szerkesztés és törlés gombok minden sorban.',
            'Új verseny — új versenyesemény létrehozása.',
          ],
        },
        {
          type: 'body',
          text: 'Új verseny hozzáadása:',
        },
        {
          type: 'steps',
          items: [
            'Kattintson az „Új verseny" fülre.',
            'Adja meg a verseny nevét (kötelező).',
            'Adja meg a helyszínt (kötelező).',
            'Válassza ki a kezdő dátumot (kötelező).',
            'Opcionálisan adja meg a befejező dátumot (többnapos versenyeknél).',
            'Írja be a verseny leírását (opcionális).',
            'Töltsön fel egy fényképet a versenyről (opcionális, legfeljebb 50 MB).',
            'Kattintson a „Mentés" gombra.',
          ],
        },
        {
          type: 'body',
          text: 'Eredmények hozzáadása egy versenyhez:',
        },
        {
          type: 'steps',
          items: [
            'A versenyek listájában kattintson a kívánt verseny „Szerkesztés" gombjára.',
            'A szerkesztőoldalon a verseny adatai alatt megjelenik az eredmények szekció.',
            'Az „Új eredmény hozzáadása" résznél töltse ki a mezőket: versenyző neve (kötelező), ló (opcionális, legördülő listából), szakág (kötelező), helyezés (szám, opcionális) és elismerés szövege (opcionális).',
            'Kattintson az „Eredmény hozzáadása" gombra.',
            'Az eredmény megjelenik a táblázatban. Egy eredményt az adott sor „Törlés" gombjával távolíthat el.',
          ],
        },
        {
          type: 'warning',
          text: 'Figyelem: Egy verseny törlése az összes hozzá tartozó eredményt is törli! A törlés végleges és nem visszavonható.',
        },
      ],
    },

    // Üzenetek kezelése
    {
      heading: 'Beérkezett üzenetek',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'Ezen az oldalon a kapcsolatfelvételi űrlapon beérkezett üzenetek tekinthetők meg.',
        },
        {
          type: 'bold',
          text: 'Hogyan érhető el: Az irányítópulton kattintson az „Üzenetek" kártyára.',
        },
        {
          type: 'body',
          text: 'Az üzenetek listában jelennek meg. Minden üzenetnél látható a feladó neve, e-mail címe, telefonszáma (ha megadta), a tárgy, az üzenet szövege és a beérkezés időpontja.',
        },
      ],
    },

    // Kijelentkezés
    {
      heading: 'Kijelentkezés',
      level: 3,
      content: [
        {
          type: 'body',
          text: 'A kijelentkezéshez kattintson a menüsorban a „Kijelentkezés" gombra. Ezután a rendszer visszairányítja a nyilvános főoldalra, és az adminisztrátori felület nem lesz elérhető, amíg újra be nem jelentkezik.',
        },
      ],
    },

    // Hasznos tippek
    {
      heading: 'Hasznos tippek',
      level: 2,
      content: [
        {
          type: 'steps',
          items: [
            'Használjon modern böngészőt (Google Chrome, Firefox, Edge vagy Safari legújabb verziója) a legjobb élmény érdekében.',
            'Az oldal okostelefonon is tökéletesen használható — a menü a hamburger gomb (☰) mögött érhető el.',
            'A sötét/világos mód váltásához kattintson a nap/hold ikonra a menüsor jobb oldalán.',
            'A kosár ikonra húzva az egeret (asztali gépen) megjelenik egy gyors összesítő a kosár tartalmáról anélkül, hogy el kellene navigálnia a kosár oldalra.',
            'A ló családfájában az egyes lovak nevére kattintva közvetlenül eljuthat az adott ló adatlapjára.',
            'Ha egy termékből alacsony a készlet, sárga figyelmeztető jelzés látható — érdemes hamar rendelni.',
            'Az eredmények oldalon az arany, ezüst és bronz helyezések színkóddal vannak jelölve a könnyebb áttekinthetőség érdekében.',
          ],
        },
      ],
    },
  ],
}

export const chapter2 = {
  title: 'Telepítési útmutató',
  sections: [
    {
      heading: 'Bevezetés',
      level: 2,
      content: [
        {
          type: 'body',
          text: 'Ez a fejezet lépésről lépésre bemutatja, hogyan helyezheti üzembe a Laguna Lovasklub webalkalmazást. A telepítéshez alapszintű számítógépes ismeretek szükségesek (fájlok kezelése, böngésző használata). Ha bizonytalan bármelyik lépésben, kérjen segítséget a fejlesztőtől.',
        },
      ],
    },

    {
      heading: 'Szükséges eszközök és előfeltételek',
      level: 2,
      content: [
        {
          type: 'body',
          text: 'A telepítés előtt győződjön meg róla, hogy az alábbiak rendelkezésre állnak:',
        },
        {
          type: 'steps',
          items: [
            'Egy számítógép internetkapcsolattal.',
            'Node.js (20-as vagy újabb verzió) — ez egy szoftver, amely az alkalmazás futtatásához szükséges. Letölthető a https://nodejs.org oldalról: válassza az „LTS" (ajánlott) verziót, és telepítse a letöltött fájlt. A telepítő végigvezeti a lépéseken.',
            'Egy Supabase fiók — a Supabase egy internetes szolgáltatás, amely az alkalmazás adatbázisát és felhasználókezelését biztosítja. Regisztráció: https://supabase.com. Ingyenes csomaggal is használható.',
            'A projekt forráskódja — ezt a fejlesztőtől kapja meg (általában egy tömörített mappában).',
          ],
        },
      ],
    },

    {
      heading: 'A telepítés lépései',
      level: 2,
      content: [
        {
          type: 'steps',
          items: [
            'Csomagolja ki a kapott projektmappát a számítógépére egy tetszőleges helyre (például az Asztalra).',
            'Nyissa meg a „Parancssor" (Windows) vagy a „Terminál" (Mac/Linux) programot. Windows rendszeren: nyomja meg a Windows billentyűt, gépelje be: „cmd", majd nyomjon Entert.',
            'Navigáljon a projektmappába. Gépelje be: cd [mappa elérési útja] — majd nyomjon Entert. Például: cd C:\\Users\\Felhasznalo\\Desktop\\laguna-lovas-klub',
            'Gépelje be: npm install — majd nyomjon Entert. Ez letölti az alkalmazás működéséhez szükséges összetevőket. Ez néhány percig tarthat — várja meg, amíg befejeződik.',
            'Készítsen egy beállítófájlt: a projektmappában keressen egy .env.example nevű fájlt. Másolja le, és nevezze át .env-re (pont nélkül a végén). Nyissa meg egy egyszerű szövegszerkesztővel (pl. Jegyzettömb).',
            'Töltse ki a beállítófájl (.env) tartalmát a Supabase projekt adataival: a VITE_SUPABASE_URL sorba írja be a Supabase projekt URL-jét, a VITE_SUPABASE_ANON_KEY sorba pedig az anon (nyilvános) kulcsot. Ezeket a Supabase vezérlőpultján, a projekt beállításainál találja (Settings → API).',
            'Állítsa be a Supabase adatbázist: a fejlesztőtől kapott adatbázis-séma fájlt (SQL) töltse be a Supabase SQL szerkesztőjébe (a Supabase vezérlőpult „SQL Editor" menüpontjában). Futtassa a szkriptet a „Run" gombbal.',
            'Hozzon létre egy adminisztrátori felhasználót a Supabase vezérlőpulton: navigáljon az „Authentication" → „Users" menüpontra, és kattintson az „Add user" gombra. Adjon meg egy e-mail címet és jelszót.',
          ],
        },
      ],
    },

    {
      heading: 'Az alkalmazás indítása',
      level: 2,
      content: [
        {
          type: 'body',
          text: 'A telepítés befejezése után az alkalmazás elindítható:',
        },
        {
          type: 'steps',
          items: [
            'A parancssorban (amely a projektmappára mutat) gépelje be: npm run dev — majd nyomjon Entert.',
            'Néhány másodperc múlva megjelenik egy üzenet, amely tartalmaz egy webcímet (általában: http://localhost:5173). Ezt nyissa meg a böngészőjében.',
            'Ha a főoldal megjelenik a „Rólunk" tartalommal, az alkalmazás sikeresen fut.',
          ],
        },
        {
          type: 'body',
          text: 'Éles üzembe helyezéshez (amikor az alkalmazásnak a nyilvános interneten kell futnia), a parancssorban gépelje be: npm run build — ez elkészíti az alkalmazás végleges változatát. A keletkező dist mappát töltse fel egy webtárhely szolgáltatóhoz (pl. Netlify, Vercel), vagy kérje a fejlesztő segítségét.',
        },
      ],
    },

    {
      heading: 'Első bejelentkezés',
      level: 2,
      content: [
        {
          type: 'steps',
          items: [
            'Nyissa meg az alkalmazást a böngészőben.',
            'Kattintson a menüsorban a lakat ikonra (Bejelentkezés).',
            'Adja meg a Supabase-ben létrehozott adminisztrátori e-mail címet és jelszót.',
            'Ha sikeresen belépett, az irányítópult jelenik meg — innentől kezelheti a tartalmakat.',
          ],
        },
      ],
    },

    {
      heading: 'Ellenőrzés — honnan tudja, hogy minden rendben van?',
      level: 2,
      content: [
        {
          type: 'steps',
          items: [
            'A főoldal (Rólunk) betöltődik, és megjelenik a klub bemutatkozó szövege.',
            'A Lovaink, Webshop és Eredményeink oldalak betöltődnek (ha még nincsenek adatok, üres állapotot mutatnak — ez normális).',
            'Be tud jelentkezni az adminisztrátori fiókkal, és eléri az irányítópultot.',
            'Az irányítópultról képes új lovat, terméket vagy versenyt felvenni, és az a nyilvános oldalon is megjelenik.',
          ],
        },
      ],
    },

    {
      heading: 'Gyakori telepítési hibák és megoldásuk',
      level: 2,
      content: [
        {
          type: 'bold',
          text: '1. „npm: command not found" vagy „npm nem ismerhető fel" hibaüzenet',
        },
        {
          type: 'body',
          text: 'Ez azt jelenti, hogy a Node.js nincs telepítve, vagy a telepítése nem fejeződött be megfelelően. Megoldás: töltse le és telepítse újra a Node.js-t a https://nodejs.org oldalról. Telepítés után zárja be és nyissa meg újra a parancssort.',
        },
        {
          type: 'bold',
          text: '2. Az alkalmazás elindul, de az oldalon nem jelennek meg adatok',
        },
        {
          type: 'body',
          text: 'Ennek oka általában a hibás vagy hiányzó .env beállítófájl. Ellenőrizze, hogy a .env fájl létezik a projektmappában, és a benne lévő VITE_SUPABASE_URL és VITE_SUPABASE_ANON_KEY értékek helyesek. A módosítás után indítsa újra az alkalmazást (a parancssorban nyomjon Ctrl+C-t, majd gépelje be újra: npm run dev).',
        },
        {
          type: 'bold',
          text: '3. „Hibás email vagy jelszó" hibaüzenet a bejelentkezésnél',
        },
        {
          type: 'body',
          text: 'Ellenőrizze, hogy pontosan azt az e-mail címet és jelszót adja meg, amelyet a Supabase-ben regisztrált. Figyeljen a kis- és nagybetűkre a jelszóban. Ha a jelszót elfelejtette, a Supabase vezérlőpulton (Authentication → Users) visszaállíthatja.',
        },
      ],
    },
  ],
}

export const chapter3 = {
  title: 'Gyakran Ismételt Kérdések (GYIK)',
  sections: [
    {
      heading: 'Általános kérdések',
      level: 2,
      content: [
        {
          type: 'qa',
          q: 'Mi ez az alkalmazás?',
          a: 'A Laguna Lovasklub weboldala, amelyen megismerheti a klubot, böngészheti a lovakat és a webshop termékeit, megtekintheti a versenyeredményeket, valamint kapcsolatba léphet a klubbal. Az adminisztrátorok számára a háttérben tartalom-kezelési felület is elérhető.',
        },
        {
          type: 'qa',
          q: 'Milyen böngészővel tudom használni az oldalt?',
          a: 'Az alkalmazás minden modern böngészőben működik: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari. Javasoljuk a böngésző legújabb verziójának használatát. Internet Explorer nem támogatott.',
        },
        {
          type: 'qa',
          q: 'Használható okostelefonon is?',
          a: 'Igen, az oldal reszponzív kialakítású, azaz automatikusan alkalmazkodik a képernyő méretéhez. Okostelefonon a menü a képernyő tetején lévő hamburger ikonra (☰) kattintva nyitható meg.',
        },
        {
          type: 'qa',
          q: 'Hogyan válthatok sötét és világos mód között?',
          a: 'A menüsor jobb szélén található nap/hold ikonra kattintva válthat. A választás automatikusan mentődik, legközelebb is az utoljára kiválasztott mód töltődik be.',
        },
      ],
    },
    {
      heading: 'Bejelentkezés és hozzáférés',
      level: 2,
      content: [
        {
          type: 'qa',
          q: 'Hogyan tudok bejelentkezni az adminisztrátori felületre?',
          a: 'Kattintson a menüsorban a lakat ikonra (Bejelentkezés). Adja meg az e-mail címét és jelszavát, majd kattintson a „Bejelentkezés" gombra. Sikeres belépés után az irányítópultra kerül.',
        },
        {
          type: 'qa',
          q: 'Elfelejtettem a jelszavamat. Mit tegyek?',
          a: 'A weboldalon jelenleg nincs jelszó-emlékeztető funkció. Kérje meg a rendszergazdát, hogy a Supabase vezérlőpulton (Authentication → Users) állítsa vissza a jelszavát.',
        },
        {
          type: 'qa',
          q: 'Hogyan jelentkezhetek ki?',
          a: 'A menüsorban kattintson a „Kijelentkezés" gombra. Ezután az alkalmazás a nyilvános főoldalra irányítja.',
        },
        {
          type: 'qa',
          q: 'Miért nem látom a Bejelentkezés gombot?',
          a: 'Ha már be van jelentkezve, a Bejelentkezés gomb helyett az „Admin" és a „Kijelentkezés" gombok jelennek meg. Ha ki szeretne jelentkezni és újra bejelentkezni, először kattintson a „Kijelentkezés" gombra.',
        },
      ],
    },
    {
      heading: 'Lovak kezelése',
      level: 2,
      content: [
        {
          type: 'qa',
          q: 'Hogyan adhatok hozzá új lovat?',
          a: 'Jelentkezzen be, majd az irányítópulton kattintson a „Lovak" kártyára. Kattintson az „Új ló hozzáadása" gombra, töltse ki az űrlapot (legalább a nevet és a nemet kötelező megadni), és kattintson a „Mentés" gombra.',
        },
        {
          type: 'qa',
          q: 'Miért nem tudom megváltoztatni egy ló szüleit szerkesztés közben?',
          a: 'A szülő (apa és anya) adatok szerkesztés közben nem módosíthatók. Ha hibás adatot adott meg, törölje a lovat, és hozza létre újra a helyes szülő-adatokkal.',
        },
      ],
    },
    {
      heading: 'Webshop és kosár',
      level: 2,
      content: [
        {
          type: 'qa',
          q: 'Hogyan tudok terméket a kosárba tenni?',
          a: 'A webshop oldalon kattintson a kívánt termék „Kosárba" gombjára, vagy nyissa meg a termék részletes oldalát, válassza ki a kívánt mennyiséget, majd kattintson a „Kosárba" gombra. A gomb rövid időre zöldre vált, jelezve, hogy a termék sikeresen hozzá lett adva.',
        },
        {
          type: 'qa',
          q: 'Hogyan módosíthatom a kosár tartalmát?',
          a: 'A kosár oldalon (a menüsorban a kosár ikonra kattintva érhető el) a +/– gombokkal módosíthatja a mennyiséget, az X gombbal eltávolíthat egy terméket, vagy a „Kosár ürítése" gombbal az összes terméket törölheti.',
        },
        {
          type: 'qa',
          q: 'A pénztárban nem tudok rendelést leadni. Miért?',
          a: 'A rendelés funkció a weboldal jelenlegi verziójában még fejlesztés alatt áll. Ha szeretne terméket vásárolni, kérjük, vegye fel a kapcsolatot a klubbal a Kapcsolat oldalon, e-mailben vagy telefonon.',
        },
      ],
    },
    {
      heading: 'Versenyek és eredmények',
      level: 2,
      content: [
        {
          type: 'qa',
          q: 'Hogyan vihetek fel új versenyeredményt?',
          a: 'Jelentkezzen be, és az irányítópulton válassza a „Versenyek" kártyát. Ha a verseny már létezik, kattintson rá a „Szerkesztés" gombbal, és az oldal alján adja hozzá az eredményeket. Ha a verseny még nem létezik, először hozza létre az „Új verseny" fülön.',
        },
      ],
    },
    {
      heading: 'Kapcsolatfelvételi űrlap',
      level: 2,
      content: [
        {
          type: 'qa',
          q: 'Küldtem egy üzenetet a kapcsolatfelvételi űrlapon. Honnan tudhatom, hogy megérkezett?',
          a: 'Ha az űrlap kitöltése és elküldése után a „Köszönjük az üzenetét! Hamarosan felvesszük Önnel a kapcsolatot." szöveg jelenik meg, az üzenet sikeresen el lett küldve. Az adminisztrátor az Üzenetek menüpont alatt látja a beérkezett üzeneteket.',
        },
        {
          type: 'qa',
          q: 'Miért nem tudom elküldeni az űrlapot?',
          a: 'Ellenőrizze, hogy minden kötelező mező (Név, E-mail, Üzenet) ki van-e töltve, és hogy bejelölte-e az adatvédelmi hozzájárulás jelölőnégyzetet. Ha valamelyik hiányzik, az alkalmazás nem engedi az elküldést.',
        },
      ],
    },
    {
      heading: 'Hibaelhárítás',
      level: 2,
      content: [
        {
          type: 'qa',
          q: 'Az oldal nem tölt be, vagy fehér képernyőt mutat. Mit tegyek?',
          a: 'Próbálja meg frissíteni az oldalt (F5 vagy Ctrl+R). Ha továbbra sem működik, törölje a böngésző gyorsítótárát (Chrome-ban: Ctrl+Shift+Delete → „Gyorsítótárazott képek és fájlok" → Törlés), vagy próbálja meg másik böngészőben.',
        },
        {
          type: 'qa',
          q: 'A képek nem jelennek meg. Mi lehet az oka?',
          a: 'Ellenőrizze az internetkapcsolatát. A képek a Supabase tárhelyről töltődnek be, ehhez aktív internetkapcsolat szükséges. Ha a probléma fennáll, lehetséges, hogy a kép törölve lett a tárhelyről — ebben az esetben forduljon a rendszergazdához.',
        },
        {
          type: 'qa',
          q: 'Hibaüzenet jelenik meg az oldalon. Mit csináljak?',
          a: 'Jegyezze fel a hibaüzenet szövegét, és frissítse az oldalt. Ha a hiba ismétlődik, értesítse a rendszergazdát a hibaüzenet pontos szövegével és azzal, hogy milyen műveletet próbált végrehajtani.',
        },
      ],
    },
  ],
}
