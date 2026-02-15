# Laguna Lovasklub - Supabase Integráció

## Projekt Áttekintés

A Laguna Lovasklub statikus HTML weboldal dinamikus, adatbázis-vezérelt alkalmazássá alakítása Supabase backend használatával.

## Alapvető Technológiai Stack

- **Frontend:** Meglévő HTML/CSS/Bootstrap
- **Backend:** Supabase (PostgreSQL adatbázis)
- **API:** Supabase REST API
- **Auth:** Supabase Authentication
- **Storage:** Supabase Storage (képek)

## Funkcionális Területek

### 1. Lovaink Kezelése
- Lovak adatainak tárolása és megjelenítése
- Származási fa (pedigree) kezelése
- Képek tárolása lovainkról

### 2. Webshop
- Termékek kezelése (tápok, kiegészítők)
- Kategorizálás
- Alapvető termékinformációk

### 3. Versenyeredmények
- Versenyek tárolása
- Eredmények/helyezések rögzítése
- Időrendi megjelenítés

### 4. Felhasználók & Autentikáció
- Admin bejelentkezés
- Jogosultságkezelés (csak olvasás vs. szerkesztés)

### 5. Képkezelés
- Lovak képeinek tárolása
- Verseny fotók tárolása
- Optimalizált képek lekérése

### 6. Kapcsolatfelvétel
- Űrlap beküldések tárolása
- Email értesítés (opcionális későbbi bővítés)

## Nem-Funkcionális Követelmények

- **Teljesítmény:** Gyors képbetöltés, optimalizált lekérdezések
- **Biztonság:** Row Level Security (RLS) minden táblán
- **Skálázhatóság:** 100-500 ló, 1000+ versenyeredmény kezelése
- **Karbantarthatóság:** Egyszerű CRUD műveletek, tiszta API struktúra
