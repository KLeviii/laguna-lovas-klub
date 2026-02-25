-- =============================================================================
-- LAGUNA LOVASKLUB - SEED DATA
-- Futtatás: Supabase SQL Editor → paste & run
-- Idempotens: törli a meglévő seed adatokat, majd újra beszúrja
-- =============================================================================

-- Törlés fordított függőségi sorrendben
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM contact_submissions;
DELETE FROM competition_results;
DELETE FROM competitions;
DELETE FROM horse_images;
DELETE FROM products;
DELETE FROM product_categories;
DELETE FROM horses;

-- =============================================================================
-- 1. HORSES (20 db)
-- Tesztelési szempontok:
--   - male / female vegyesen
--   - is_for_sale: true / false
--   - price_huf: van / NULL / szélsőséges értékek
--   - birth_date: van / NULL
--   - breed: van / NULL
--   - description: van / NULL
--   - sire_id / dam_id: van / NULL (self-reference)
-- =============================================================================

INSERT INTO horses (id, name, gender, birth_date, breed, description, is_for_sale, price_huf, main_img_url, sire_id, dam_id) VALUES

-- Alapító lovak (nincs szülő hivatkozás)
('a0000001-0000-0000-0000-000000000001', 'Villám', 'male', '2010-03-15', 'Magyar sportló', 'Tapasztalt díjugratóló, számos versenyen bizonyított. Kiváló vérmérsékletű, megbízható.', false, NULL, NULL, NULL, NULL),
('a0000001-0000-0000-0000-000000000002', 'Csillag', 'female', '2011-07-22', 'Furioso-North Star', 'Gyönyörű kanca, kiváló anyai vonallal. Több sikeres csikót nevelt fel.', false, NULL, NULL, NULL, NULL),
('a0000001-0000-0000-0000-000000000003', 'Tűzgolyó', 'male', '2009-01-10', 'Holsteini', 'Importált mén Németországból. Erős ugróképesség, kiváló genetika.', false, NULL, NULL, NULL, NULL),
('a0000001-0000-0000-0000-000000000004', 'Szellő', 'female', '2012-05-30', 'Kisbéri félvér', NULL, false, NULL, NULL, NULL, NULL),
('a0000001-0000-0000-0000-000000000005', 'Bársony', 'female', '2008-11-01', 'Gidrán', 'Idős, de még aktív kanca. Ideális oktatási célra.', false, NULL, NULL, NULL, NULL),

-- Lovak szülő hivatkozásokkal
('a0000001-0000-0000-0000-000000000006', 'Villámfény', 'male', '2016-04-12', 'Magyar sportló', 'Villám és Csillag utódja. Tehetséges fiatal mén, díjugrató karrierre készül.', false, NULL, NULL, 'a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002'),
('a0000001-0000-0000-0000-000000000007', 'Holdvilág', 'female', '2017-06-18', 'Magyar sportló', 'Villám és Csillag második utódja. Elegáns megjelenés, kiváló díjlovagláshoz.', true, 3500000, NULL, 'a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002'),
('a0000001-0000-0000-0000-000000000008', 'Tűzmadár', 'female', '2018-02-25', 'Holsteini x Furioso', 'Tűzgolyó és Csillag utódja. Rendkívüli ugróképesség.', true, 5800000, NULL, 'a0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000002'),
('a0000001-0000-0000-0000-000000000009', 'Vihar', 'male', '2015-09-03', 'Holsteini', 'Tűzgolyó fia, Szellő anyától. Erőteljes, de kissé temperamentumos.', true, 4200000, NULL, 'a0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000004'),
('a0000001-0000-0000-0000-000000000010', 'Napsugár', 'female', '2019-07-07', 'Kisbéri félvér', 'Fiatal kanca, oktatásban használjuk. Nagyon barátságos.', false, NULL, NULL, NULL, 'a0000001-0000-0000-0000-000000000004'),

-- Eladó lovak különböző árakkal
('a0000001-0000-0000-0000-000000000011', 'Sámson', 'male', '2014-12-20', 'Mecklenburgi', 'Nagy testű, erős mén. Fogathajtásra és díjugrásra egyaránt alkalmas.', true, 8500000, NULL, NULL, NULL),
('a0000001-0000-0000-0000-000000000012', 'Pillangó', 'female', '2020-03-01', 'Magyar sportló', 'Fiatal, képzetlen kanca, nagy potenciállal.', true, 1200000, NULL, NULL, NULL),
('a0000001-0000-0000-0000-000000000013', 'Csákó', 'male', '2013-08-14', NULL, 'Vegyes fajtájú, de megbízható ló. Tökéletes kezdő lovasoknak.', true, 450000, NULL, NULL, NULL),

-- Szélsőséges esetek
('a0000001-0000-0000-0000-000000000014', 'Herceg', 'male', '2005-01-01', 'Arab telivér', 'Prémium arab telivér, nemzetközi versenyeredményekkel.', true, 25000000, NULL, NULL, NULL),
('a0000001-0000-0000-0000-000000000015', 'Bodza', 'female', NULL, NULL, NULL, false, NULL, NULL, NULL, NULL),
('a0000001-0000-0000-0000-000000000016', 'Mokka', 'male', NULL, 'Haflinger', 'Barátságos póniméretű ló.', true, 350000, NULL, NULL, NULL),
('a0000001-0000-0000-0000-000000000017', 'Délibáb', 'female', '2021-11-11', 'Lipicai', 'Fiatal lipicai kanca, klasszikus fehér szín.', false, NULL, NULL, NULL, NULL),
('a0000001-0000-0000-0000-000000000018', 'Tornado', 'male', '2016-06-06', 'KWPN', 'Holland sportló, kiemelkedő mozgás.', true, 12000000, NULL, NULL, NULL),
('a0000001-0000-0000-0000-000000000019', 'Boglárka', 'female', '2019-04-20', 'Magyar sportló', NULL, true, 2800000, NULL, 'a0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000010'),
('a0000001-0000-0000-0000-000000000020', 'Szikra', 'male', '2022-01-15', 'Furioso-North Star', 'Legfiatalabb csikónk. Még betöretlen, de ígéretes vérvonal.', true, 1800000, NULL, 'a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000005');


-- =============================================================================
-- 2. PRODUCT CATEGORIES (6 db)
-- =============================================================================

INSERT INTO product_categories (id, name, slug, description, display_order) VALUES
('b0000001-0000-0000-0000-000000000001', 'Nyergek', 'nyergek', 'Minőségi nyergek kezdőknek és haladóknak egyaránt.', 1),
('b0000001-0000-0000-0000-000000000002', 'Kantárok és fejszerszámok', 'kantarok-es-fejszerszamok', 'Kantárok, zabla, fejszerszámok széles választéka.', 2),
('b0000001-0000-0000-0000-000000000003', 'Lovaglóruházat', 'lovagloruházat', NULL, 3),
('b0000001-0000-0000-0000-000000000004', 'Lóápolás', 'loapolas', 'Kefék, samponok, pataapolók és egyéb ápolószerek.', 4),
('b0000001-0000-0000-0000-000000000005', 'Takarmány és kiegészítők', 'takarmany-es-kiegeszitok', 'Prémium takarmányok, vitaminok, ásványi anyagok.', 5),
('b0000001-0000-0000-0000-000000000006', 'Istálló felszerelés', 'istallo-felszereles', 'Vödrök, etető, itató, bokszberendezés.', 6);


-- =============================================================================
-- 3. PRODUCTS (25 db)
-- Tesztelési szempontok:
--   - minden kategóriából több termék
--   - is_available: true / false
--   - szélsőséges árak
--   - description: van / NULL
--   - image_url: mind NULL (képek nem kellenek)
-- =============================================================================

INSERT INTO products (id, category_id, name, description, price_huf, image_url, is_available) VALUES

-- Nyergek
('c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Kezdő tanulónyereg 16"', 'Szintetikus anyagból, könnyű, ideális tanuláshoz.', 45000, NULL, true),
('c0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'Díjlovas nyereg bőr 17"', 'Valódi bőr díjlovas nyereg, kézzel készített.', 285000, NULL, true),
('c0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'Ugrónyereg 17.5"', 'Professzionális ugrónyereg, francia tervezés.', 420000, NULL, true),
('c0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 'Westernnyereg díszített', NULL, 380000, NULL, false),

-- Kantárok
('c0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000002', 'Snaffle kantár bőr', 'Egyszerű szárú kantár minőségi bőrből.', 18500, NULL, true),
('c0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000002', 'Dupla zabla kantár', 'Versenyzéshez ajánlott, állítható pofaszíj.', 32000, NULL, true),
('c0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000002', 'Kötőfék szett', 'Kötőfék + vezető kötél, nylon.', 4500, NULL, true),
('c0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000002', 'Bitless kantár', NULL, 24000, NULL, false),

-- Lovaglóruházat
('c0000001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000003', 'Lovaglócsizma bőr 38-as', 'Valódi bőr lovaglócsizma, fekete.', 65000, NULL, true),
('c0000001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000003', 'Lovaglócsizma bőr 42-es', 'Valódi bőr lovaglócsizma, fekete, férfi méret.', 72000, NULL, true),
('c0000001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000003', 'Lovaglónadrág női S', 'Elasztikus szilikon betétes lovaglónadrág.', 22000, NULL, true),
('c0000001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000003', 'Lovaglónadrág férfi L', NULL, 24000, NULL, true),
('c0000001-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000003', 'Lovagló sisak CE minősített', 'Állítható méret, szellőző, CE EN1384.', 35000, NULL, true),
('c0000001-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000003', 'Lovaglókesztyű bőr M', 'Puha bőrkesztyű, jobb fogás a gyeplőn.', 8500, NULL, true),

-- Lóápolás
('c0000001-0000-0000-0000-000000000015', 'b0000001-0000-0000-0000-000000000004', 'Vakaró kefe szett (3 db)', 'Puha, kemény és sörénykefe egy csomagban.', 6800, NULL, true),
('c0000001-0000-0000-0000-000000000016', 'b0000001-0000-0000-0000-000000000004', 'Lósampon 1L', 'Természetes összetevők, fényes szőrzet.', 3200, NULL, true),
('c0000001-0000-0000-0000-000000000017', 'b0000001-0000-0000-0000-000000000004', 'Patakence 500ml', 'Pataápoló kenőcs, megelőzi a repedést.', 4800, NULL, true),
('c0000001-0000-0000-0000-000000000018', 'b0000001-0000-0000-0000-000000000004', 'Sörénybontó spray 300ml', NULL, 2400, NULL, true),
('c0000001-0000-0000-0000-000000000019', 'b0000001-0000-0000-0000-000000000004', 'Sebkezelő spray 200ml', 'Elsősegély spray kisebb sérülésekre.', 5600, NULL, false),

-- Takarmány
('c0000001-0000-0000-0000-000000000020', 'b0000001-0000-0000-0000-000000000005', 'Prémium müzli 20kg', 'Energiadús müzli aktív lovaknak.', 8900, NULL, true),
('c0000001-0000-0000-0000-000000000021', 'b0000001-0000-0000-0000-000000000005', 'Vitamin pellet 5kg', 'Ásványi anyag és vitamin kiegészítő.', 12500, NULL, true),
('c0000001-0000-0000-0000-000000000022', 'b0000001-0000-0000-0000-000000000005', 'Répacsemege 1kg', 'Aszalt répa jutalomfalat.', 1500, NULL, true),
('c0000001-0000-0000-0000-000000000023', 'b0000001-0000-0000-0000-000000000005', 'Nyalósó 3kg', NULL, 1800, NULL, true),

-- Istálló felszerelés
('c0000001-0000-0000-0000-000000000024', 'b0000001-0000-0000-0000-000000000006', 'Itatóvödör 20L', 'Műanyag, fagyálló, fülekkel.', 3500, NULL, true),
('c0000001-0000-0000-0000-000000000025', 'b0000001-0000-0000-0000-000000000006', 'Szénaháló nagy', 'Lassító szénaháló, 6cm szem.', 7200, NULL, true);


-- =============================================================================
-- 4. COMPETITIONS (10 db)
-- Tesztelési szempontok:
--   - múltbeli, jelenlegi, jövőbeli versenyek
--   - egynapos (end_date NULL) és többnapos
--   - description: van / NULL
-- =============================================================================

INSERT INTO competitions (id, name, location, start_date, end_date, image_url, description) VALUES
('d0000001-0000-0000-0000-000000000001', 'Laguna Tavaszi Kupa 2024', 'Laguna Lovasklub, Dömsöd', '2024-04-13', '2024-04-14', NULL, 'Hagyományos tavaszi versenyünk díjugrató és díjlovaglás kategóriákban.'),
('d0000001-0000-0000-0000-000000000002', 'Dömsödi Lovasnapok 2024', 'Dömsöd Sportpálya', '2024-06-01', '2024-06-02', NULL, 'Városi rendezvény keretében lovasbemutatókkal és versenyekkel.'),
('d0000001-0000-0000-0000-000000000003', 'Nyári Díjugratóverseny', 'Laguna Lovasklub, Dömsöd', '2024-07-20', NULL, NULL, 'Egynapos díjugratóverseny kezdő és haladó kategóriákban.'),
('d0000001-0000-0000-0000-000000000004', 'Pest Megyei Bajnokság 2024', 'Ráckeve Lovaspálya', '2024-09-07', '2024-09-08', NULL, 'A Pest megyei bajnokság selejtező fordulója.'),
('d0000001-0000-0000-0000-000000000005', 'Őszi Gála 2024', 'Laguna Lovasklub, Dömsöd', '2024-10-19', NULL, NULL, NULL),
('d0000001-0000-0000-0000-000000000006', 'Téli Tereplovaglás 2024', 'Kiskunlacháza, erdei pálya', '2024-12-07', NULL, NULL, 'Téli tereplovaglás a kiskunlacházi erdőben, 15 km-es távon.'),
('d0000001-0000-0000-0000-000000000007', 'Laguna Tavaszi Kupa 2025', 'Laguna Lovasklub, Dömsöd', '2025-04-12', '2025-04-13', NULL, 'A 2025-ös tavaszi kupa, megnövelt létszámmal.'),
('d0000001-0000-0000-0000-000000000008', 'Dunamenti Lovasfesztivál 2025', 'Százhalombatta', '2025-06-14', '2025-06-15', NULL, 'Regionális fesztivál több lovasklub részvételével.'),
('d0000001-0000-0000-0000-000000000009', 'Nyári Kupa 2025', 'Laguna Lovasklub, Dömsöd', '2025-08-23', NULL, NULL, NULL),
('d0000001-0000-0000-0000-000000000010', 'Őszi Bajnokság 2025', 'Ráckeve Lovaspálya', '2025-10-11', '2025-10-12', NULL, 'Éves záróverseny, összesített bajnoki pontokkal.');


-- =============================================================================
-- 5. COMPETITION RESULTS (30 db)
-- Tesztelési szempontok:
--   - különböző discipline értékek
--   - placement: 1-től utolsóig + NULL (csak részvétel)
--   - horse_id: van / NULL (külsős lovas)
--   - achievement: van / NULL
-- =============================================================================

INSERT INTO competition_results (id, competition_id, horse_id, jockey_name, discipline, placement, achievement) VALUES

-- Laguna Tavaszi Kupa 2024
('e0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000006', 'Kovács Tamás', 'díjugrató', 1, 'Arany díj - hibátlan ugratás'),
('e0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000009', 'Horváth Petra', 'díjugrató', 2, 'Ezüst díj'),
('e0000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000011', 'Szabó Gergő', 'díjugrató', 3, NULL),
('e0000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000007', 'Kiss Anna', 'díjlovaglás', 1, 'Legjobb összpontszám: 72.5%'),
('e0000001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000001', NULL, 'Tóth Bence', 'díjlovaglás', 2, NULL),
('e0000001-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000017', 'Farkas Lilla', 'díjlovaglás', 3, NULL),

-- Dömsödi Lovasnapok 2024
('e0000001-0000-0000-0000-000000000007', 'd0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', 'Kovács Tamás', 'díjugrató', 1, 'Különdíj: legjobb stílus'),
('e0000001-0000-0000-0000-000000000008', 'd0000001-0000-0000-0000-000000000002', NULL, 'Nagy István', 'díjugrató', 2, NULL),
('e0000001-0000-0000-0000-000000000009', 'd0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000008', 'Horváth Petra', 'tereplovaglás', 1, 'Hibátlan pályateljesítés'),
('e0000001-0000-0000-0000-000000000010', 'd0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000010', 'Molnár Zsófi', 'tereplovaglás', NULL, 'Részvétel - fiatal ló bemutató'),

-- Nyári Díjugratóverseny 2024
('e0000001-0000-0000-0000-000000000011', 'd0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000006', 'Kovács Tamás', 'díjugrató kezdő', 1, NULL),
('e0000001-0000-0000-0000-000000000012', 'd0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000012', 'Kiss Anna', 'díjugrató kezdő', 4, NULL),
('e0000001-0000-0000-0000-000000000013', 'd0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000009', 'Horváth Petra', 'díjugrató haladó', 1, 'Legjobb idő: 45.2s'),
('e0000001-0000-0000-0000-000000000014', 'd0000001-0000-0000-0000-000000000003', NULL, 'Varga Dániel', 'díjugrató haladó', 2, NULL),
('e0000001-0000-0000-0000-000000000015', 'd0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000011', 'Szabó Gergő', 'díjugrató haladó', 3, NULL),

-- Pest Megyei Bajnokság 2024
('e0000001-0000-0000-0000-000000000016', 'd0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000006', 'Kovács Tamás', 'díjugrató', 2, 'Megyei ezüst'),
('e0000001-0000-0000-0000-000000000017', 'd0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000009', 'Horváth Petra', 'díjugrató', 5, NULL),
('e0000001-0000-0000-0000-000000000018', 'd0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000007', 'Kiss Anna', 'díjlovaglás', 1, 'Megyei arany - 74.8%'),
('e0000001-0000-0000-0000-000000000019', 'd0000001-0000-0000-0000-000000000004', NULL, 'Lakatos Réka', 'díjlovaglás', 3, NULL),

-- Őszi Gála 2024
('e0000001-0000-0000-0000-000000000020', 'd0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000018', 'Kovács Tamás', 'díjugrató', 1, 'Gála győztes'),
('e0000001-0000-0000-0000-000000000021', 'd0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000008', 'Horváth Petra', 'díjugrató', 2, NULL),
('e0000001-0000-0000-0000-000000000022', 'd0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000013', 'Molnár Zsófi', 'díjugrató kezdő', NULL, 'Részvétel'),

-- Téli Tereplovaglás 2024
('e0000001-0000-0000-0000-000000000023', 'd0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000009', 'Horváth Petra', 'tereplovaglás', 1, 'Legjobb idő a 15 km-es távon'),
('e0000001-0000-0000-0000-000000000024', 'd0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000001', 'Kovács Tamás', 'tereplovaglás', 2, NULL),
('e0000001-0000-0000-0000-000000000025', 'd0000001-0000-0000-0000-000000000006', NULL, 'Papp Márton', 'tereplovaglás', 3, NULL),

-- Laguna Tavaszi Kupa 2025
('e0000001-0000-0000-0000-000000000026', 'd0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000006', 'Kovács Tamás', 'díjugrató', 1, 'Dupla arany - második egymást követő évben'),
('e0000001-0000-0000-0000-000000000027', 'd0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000008', 'Horváth Petra', 'díjugrató', 1, 'Megosztott első hely'),
('e0000001-0000-0000-0000-000000000028', 'd0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000019', 'Kiss Anna', 'díjlovaglás', 2, NULL),
('e0000001-0000-0000-0000-000000000029', 'd0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000017', 'Farkas Lilla', 'díjlovaglás', 1, 'Kimagasló szabadprogram'),
('e0000001-0000-0000-0000-000000000030', 'd0000001-0000-0000-0000-000000000007', NULL, 'Fekete Balázs', 'fogathajtás', NULL, 'Bemutató kategória - nem hivatalos');


-- =============================================================================
-- 6. CONTACT SUBMISSIONS (12 db)
-- Tesztelési szempontok:
--   - is_read: true / false
--   - phone: van / NULL
--   - rövid és hosszú üzenetek
--   - speciális karakterek (ékezetek, idézőjel, kötőjel)
-- =============================================================================

INSERT INTO contact_submissions (id, name, email, phone, message, is_read, created_at) VALUES
('f0000001-0000-0000-0000-000000000001', 'Nagy Katalin', 'nagy.katalin@gmail.com', '+36301234567', 'Sziasztok! Szeretnék érdeklődni a lovaglás óra árak felől. Van-e lehetőség próbaórára?', true, '2024-11-01 09:30:00+01'),
('f0000001-0000-0000-0000-000000000002', 'Tóth László', 'toth.laszlo@freemail.hu', NULL, 'Jó napot! Mikor vannak nyitva? Hétvégén is lehet lovagolni?', true, '2024-11-05 14:22:00+01'),
('f0000001-0000-0000-0000-000000000003', 'Kovács-Szabó Emese', 'emese.ksz@yahoo.com', '+36209876543', 'Kedves Laguna Lovasklub! A 8 éves lányom szeretne lovagolni tanulni. Van-e gyerekeknek szóló oktatás? Milyen korhatár van? Előre is köszönöm a választ, üdvözlettel: Kovács-Szabó Emese', true, '2024-11-10 11:15:00+01'),
('f0000001-0000-0000-0000-000000000004', 'Horváth Péter', 'horvath.peter@citromail.hu', '+36701112233', 'Üdv! A "Holdvilág" nevű lóról szeretnék érdeklődni. Még eladó? Mi a pontos ára és milyen papírjai vannak?', true, '2024-11-15 16:45:00+01'),
('f0000001-0000-0000-0000-000000000005', 'Müller Ágnes', 'agnes.muller@t-online.de', NULL, 'Guten Tag! Wir planen einen Reiturlaub in Ungarn. Sprechen Sie Deutsch? Können wir bei Ihnen reiten? Vielen Dank!', true, '2024-12-01 08:00:00+01'),
('f0000001-0000-0000-0000-000000000006', 'Varga Miklós', 'varga.m@gmail.com', '+36301234568', 'Szia! Szerveztek-e csapatépítő rendezvényeket cégeknek? 20-25 fős csapat lennénk.', true, '2024-12-10 13:30:00+01'),
('f0000001-0000-0000-0000-000000000007', 'Dr. Kiss Erzsébet', 'dr.kiss.erzsebet@med.hu', '+36205554444', 'Tisztelt Lovasklub! Állatorvosként ajánlanám szolgáltatásaimat. Keresnek-e lóorvost? Rendszeres viziteket is vállalok. Kérem, keressenek a megadott telefonszámon.', false, '2025-01-05 10:00:00+01'),
('f0000001-0000-0000-0000-000000000008', 'Szabó Dávid', 'szabo.david99@gmail.com', NULL, 'Sziasztok, a webshopból rendeltem egy nyerget (rendelésszám: nem tudom sajnos), de még nem kaptam visszaigazolást. Kérlek jelezzetek, hogy mi a helyzet! Köszi', false, '2025-01-10 19:20:00+01'),
('f0000001-0000-0000-0000-000000000009', 'Pintér Júlia', 'pinter.juli@outlook.com', '+36703332211', 'Lehet-e nálatok esküvői fotózást csinálni a lovakkal? :)', false, '2025-01-15 15:00:00+01'),
('f0000001-0000-0000-0000-000000000010', 'test', 'test@test.com', NULL, 'teszt üzenet', false, '2025-01-20 00:01:00+01'),
('f0000001-0000-0000-0000-000000000011', 'Németh Gábor', 'nemeth.gabor@protonmail.com', '+36301239999', 'Helló! Van lehetőség a lovardában születésnapi zsúrt tartani? A fiam 10 éves lesz és imádja a lovakat. Kb. 10-12 gyerek lenne. Mennyi lenne az ára és mit tartalmaz a program? Köszönöm szépen!', false, '2025-02-01 12:30:00+01'),
('f0000001-0000-0000-0000-000000000012', 'O''Brien Sarah', 'sarah.obrien@gmail.com', NULL, 'Hello! I''m visiting Hungary next month. Do you offer trail rides for tourists? I have intermediate riding experience. Thanks!', false, '2025-02-10 17:45:00+01');


-- =============================================================================
-- 7. ORDERS (15 db)
-- Tesztelési szempontok:
--   - minden status: pending / confirmed / shipped / delivered / cancelled
--   - is_read: true / false
--   - notes: van / NULL
--   - phone: van / NULL
--   - különböző városok, irányítószámok
-- =============================================================================

INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_name, shipping_zip, shipping_city, shipping_address, shipping_country, notes, status, total_amount_huf, is_read, created_at, updated_at) VALUES
('10000001-0000-0000-0000-000000000001', 'Nagy Katalin', 'nagy.katalin@gmail.com', '+36301234567', 'Nagy Katalin', '2344', 'Dömsöd', 'Fő utca 12.', 'Magyarország', NULL, 'delivered', 51800, true, '2024-10-15 10:30:00+01', '2024-10-20 14:00:00+01'),
('10000001-0000-0000-0000-000000000002', 'Tóth László', 'toth.laszlo@freemail.hu', NULL, 'Tóth László', '1134', 'Budapest', 'Váci út 45. 3/12', 'Magyarország', 'Kérem kapucsengő: Tóth', 'delivered', 285000, true, '2024-10-20 15:45:00+01', '2024-10-28 09:00:00+01'),
('10000001-0000-0000-0000-000000000003', 'Szabó Anna', 'szabo.anna@gmail.com', '+36207778899', 'Szabó Anna', '6720', 'Szeged', 'Tisza Lajos krt. 88.', 'Magyarország', NULL, 'delivered', 22000, true, '2024-11-01 08:00:00+01', '2024-11-08 16:30:00+01'),
('10000001-0000-0000-0000-000000000004', 'Horváth Péter', 'horvath.peter@citromail.hu', '+36701112233', 'Horváth Péter', '4028', 'Debrecen', 'Kassai út 26.', 'Magyarország', 'Szombaton leszek otthon egész nap.', 'delivered', 118500, true, '2024-11-10 12:00:00+01', '2024-11-18 11:00:00+01'),
('10000001-0000-0000-0000-000000000005', 'Varga Miklós', 'varga.m@gmail.com', '+36301234568', 'Varga Miklós', '7621', 'Pécs', 'Király utca 3.', 'Magyarország', NULL, 'cancelled', 420000, true, '2024-11-15 17:30:00+01', '2024-11-16 09:00:00+01'),
('10000001-0000-0000-0000-000000000006', 'Kiss Erzsébet', 'kiss.erzsi@gmail.com', '+36205554444', 'Kiss Erzsébet', '9700', 'Szombathely', 'Kőszegi út 11/A', 'Magyarország', 'Ha nem vagyok otthon, a szomszédnál hagyják.', 'shipped', 47800, true, '2024-12-01 09:15:00+01', '2024-12-03 14:00:00+01'),
('10000001-0000-0000-0000-000000000007', 'Papp Márton', 'papp.marton@outlook.com', NULL, 'Papp Márton', '3300', 'Eger', 'Dobó tér 1.', 'Magyarország', NULL, 'shipped', 10300, true, '2024-12-10 11:20:00+01', '2024-12-12 08:30:00+01'),
('10000001-0000-0000-0000-000000000008', 'Molnár Zsófi', 'molnar.zsofi@gmail.com', '+36709998877', 'Molnár Zsófia', '2344', 'Dömsöd', 'Petőfi Sándor u. 5.', 'Magyarország', NULL, 'confirmed', 35000, true, '2025-01-05 16:40:00+01', '2025-01-06 10:00:00+01'),
('10000001-0000-0000-0000-000000000009', 'Farkas Lilla', 'farkas.lilla@gmail.com', '+36201110000', 'Farkas Lilla', '8200', 'Veszprém', 'Óváros tér 22.', 'Magyarország', 'Ajándékba megy, kérem csomagolják szépen!', 'confirmed', 73800, false, '2025-01-15 13:55:00+01', '2025-01-16 08:00:00+01'),
('10000001-0000-0000-0000-000000000010', 'Lakatos Réka', 'lakatos.reka@yahoo.com', NULL, 'Lakatos Réka', '2030', 'Érd', 'Budai út 99.', 'Magyarország', NULL, 'pending', 8900, false, '2025-02-01 20:10:00+01', '2025-02-01 20:10:00+01'),
('10000001-0000-0000-0000-000000000011', 'Fekete Balázs', 'fekete.balazs@gmail.com', '+36305556677', 'Fekete Balázs', '1051', 'Budapest', 'Vörösmarty tér 7-8.', 'Magyarország', 'Munkahelyre kérem a kézbesítést (portás átveszi).', 'pending', 330000, false, '2025-02-05 14:00:00+01', '2025-02-05 14:00:00+01'),
('10000001-0000-0000-0000-000000000012', 'Pintér Júlia', 'pinter.juli@outlook.com', '+36703332211', 'Pintér Júlia', '2340', 'Kiskunlacháza', 'Dózsa György út 14.', 'Magyarország', NULL, 'pending', 4500, false, '2025-02-10 09:00:00+01', '2025-02-10 09:00:00+01'),
('10000001-0000-0000-0000-000000000013', 'Németh Gábor', 'nemeth.gabor@protonmail.com', '+36301239999', 'Németh Gábor', '2440', 'Százhalombatta', 'Damjanich u. 8.', 'Magyarország', 'Telefonon egyeztessünk a szállítás időpontját.', 'pending', 96200, false, '2025-02-15 18:30:00+01', '2025-02-15 18:30:00+01'),
('10000001-0000-0000-0000-000000000014', 'O''Brien Sarah', 'sarah.obrien@gmail.com', NULL, 'Sarah O''Brien', '1061', 'Budapest', 'Andrássy út 60.', 'Magyarország', 'I am staying at a hotel, please call before delivery.', 'cancelled', 65000, true, '2025-02-18 11:00:00+01', '2025-02-19 08:00:00+01'),
('10000001-0000-0000-0000-000000000015', 'Kovács Tamás', 'kovacs.tamas@gmail.com', '+36301001001', 'Kovács Tamás', '2344', 'Dömsöd', 'Rákóczi u. 30.', 'Magyarország', NULL, 'confirmed', 15300, false, '2025-02-20 07:45:00+01', '2025-02-21 09:00:00+01');


-- =============================================================================
-- 8. ORDER ITEMS (35 db)
-- Tesztelési szempontok:
--   - több tétel egy rendelésben
--   - 1 tételes rendelés
--   - nagy mennyiség
--   - NULL product_id (törölt termék szimuláció)
-- =============================================================================

INSERT INTO order_items (id, order_id, product_id, product_name, unit_price_huf, quantity) VALUES

-- Order 1 (delivered) - 2 tétel
('11000001-0000-0000-0000-000000000001', '10000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'Snaffle kantár bőr', 18500, 1),
('11000001-0000-0000-0000-000000000002', '10000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000016', 'Lósampon 1L', 3200, 2),
('11000001-0000-0000-0000-000000000003', '10000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000022', 'Répacsemege 1kg', 1500, 3),
('11000001-0000-0000-0000-000000000004', '10000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000015', 'Vakaró kefe szett (3 db)', 6800, 1),

-- Order 2 (delivered) - 1 tétel, drága
('11000001-0000-0000-0000-000000000005', '10000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'Díjlovas nyereg bőr 17"', 285000, 1),

-- Order 3 (delivered) - 1 tétel
('11000001-0000-0000-0000-000000000006', '10000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000011', 'Lovaglónadrág női S', 22000, 1),

-- Order 4 (delivered) - 3 tétel
('11000001-0000-0000-0000-000000000007', '10000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000009', 'Lovaglócsizma bőr 38-as', 65000, 1),
('11000001-0000-0000-0000-000000000008', '10000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000014', 'Lovaglókesztyű bőr M', 8500, 1),
('11000001-0000-0000-0000-000000000009', '10000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000001', 'Kezdő tanulónyereg 16"', 45000, 1),

-- Order 5 (cancelled) - 1 tétel, drága
('11000001-0000-0000-0000-000000000010', '10000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000003', 'Ugrónyereg 17.5"', 420000, 1),

-- Order 6 (shipped) - 3 tétel
('11000001-0000-0000-0000-000000000011', '10000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000017', 'Patakence 500ml', 4800, 2),
('11000001-0000-0000-0000-000000000012', '10000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000018', 'Sörénybontó spray 300ml', 2400, 3),
('11000001-0000-0000-0000-000000000013', '10000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000015', 'Vakaró kefe szett (3 db)', 6800, 4),

-- Order 7 (shipped) - 2 tétel
('11000001-0000-0000-0000-000000000014', '10000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000007', 'Kötőfék szett', 4500, 1),
('11000001-0000-0000-0000-000000000015', '10000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000018', 'Sörénybontó spray 300ml', 2400, 1),
('11000001-0000-0000-0000-000000000016', '10000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000016', 'Lósampon 1L', 3200, 1),

-- Order 8 (confirmed) - 1 tétel
('11000001-0000-0000-0000-000000000017', '10000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000013', 'Lovagló sisak CE minősített', 35000, 1),

-- Order 9 (confirmed) - 2 tétel
('11000001-0000-0000-0000-000000000018', '10000001-0000-0000-0000-000000000009', 'c0000001-0000-0000-0000-000000000010', 'Lovaglócsizma bőr 42-es', 72000, 1),
('11000001-0000-0000-0000-000000000019', '10000001-0000-0000-0000-000000000009', 'c0000001-0000-0000-0000-000000000023', 'Nyalósó 3kg', 1800, 1),

-- Order 10 (pending) - 1 tétel
('11000001-0000-0000-0000-000000000020', '10000001-0000-0000-0000-000000000010', 'c0000001-0000-0000-0000-000000000020', 'Prémium müzli 20kg', 8900, 1),

-- Order 11 (pending) - 2 tétel, drága
('11000001-0000-0000-0000-000000000021', '10000001-0000-0000-0000-000000000011', 'c0000001-0000-0000-0000-000000000002', 'Díjlovas nyereg bőr 17"', 285000, 1),
('11000001-0000-0000-0000-000000000022', '10000001-0000-0000-0000-000000000011', 'c0000001-0000-0000-0000-000000000001', 'Kezdő tanulónyereg 16"', 45000, 1),

-- Order 12 (pending) - 1 tétel
('11000001-0000-0000-0000-000000000023', '10000001-0000-0000-0000-000000000012', 'c0000001-0000-0000-0000-000000000007', 'Kötőfék szett', 4500, 1),

-- Order 13 (pending) - 4 tétel, nagy mennyiségek (pl. istálló beszerzés)
('11000001-0000-0000-0000-000000000024', '10000001-0000-0000-0000-000000000013', 'c0000001-0000-0000-0000-000000000024', 'Itatóvödör 20L', 3500, 10),
('11000001-0000-0000-0000-000000000025', '10000001-0000-0000-0000-000000000013', 'c0000001-0000-0000-0000-000000000025', 'Szénaháló nagy', 7200, 5),
('11000001-0000-0000-0000-000000000026', '10000001-0000-0000-0000-000000000013', 'c0000001-0000-0000-0000-000000000020', 'Prémium müzli 20kg', 8900, 3),
('11000001-0000-0000-0000-000000000027', '10000001-0000-0000-0000-000000000013', 'c0000001-0000-0000-0000-000000000022', 'Répacsemege 1kg', 1500, 2),

-- Order 14 (cancelled) - 1 tétel
('11000001-0000-0000-0000-000000000028', '10000001-0000-0000-0000-000000000014', 'c0000001-0000-0000-0000-000000000009', 'Lovaglócsizma bőr 38-as', 65000, 1),

-- Order 15 (confirmed) - 3 tétel, egyik product_id NULL (törölt termék)
('11000001-0000-0000-0000-000000000029', '10000001-0000-0000-0000-000000000015', NULL, 'Lovaglóbot gumi végű (MEGSZŰNT)', 3200, 1),
('11000001-0000-0000-0000-000000000030', '10000001-0000-0000-0000-000000000015', 'c0000001-0000-0000-0000-000000000022', 'Répacsemege 1kg', 1500, 5),
('11000001-0000-0000-0000-000000000031', '10000001-0000-0000-0000-000000000015', 'c0000001-0000-0000-0000-000000000017', 'Patakence 500ml', 4800, 1),

-- Extra tételek a 35 db eléréséhez
('11000001-0000-0000-0000-000000000032', '10000001-0000-0000-0000-000000000004', NULL, 'Nyeregtakaró gyapjú (MEGSZŰNT)', 15000, 1),
('11000001-0000-0000-0000-000000000033', '10000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000016', 'Lósampon 1L', 3200, 1),
('11000001-0000-0000-0000-000000000034', '10000001-0000-0000-0000-000000000009', 'c0000001-0000-0000-0000-000000000022', 'Répacsemege 1kg', 1500, 2),
('11000001-0000-0000-0000-000000000035', '10000001-0000-0000-0000-000000000013', 'c0000001-0000-0000-0000-000000000023', 'Nyalósó 3kg', 1800, 4);


-- =============================================================================
-- KÉSZ! Összesen:
--   horses:               20
--   horse_images:           0
--   product_categories:     6
--   products:              25
--   competitions:          10
--   competition_results:   30
--   contact_submissions:   12
--   orders:                15
--   order_items:           35
-- =============================================================================
