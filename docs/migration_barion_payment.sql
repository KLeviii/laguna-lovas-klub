-- Barion fizetési integráció – DB migráció
-- Futtasd ezt a Supabase SQL Editor-ban (Dashboard → SQL Editor)

-- 1. Új mezők az orders táblához
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'barion',
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS barion_payment_id text;

-- 3. Index a callback gyors kereséséhez
CREATE INDEX IF NOT EXISTS idx_orders_barion_payment_id
  ON orders(barion_payment_id);

-- payment_status lehetséges értékek: 'pending' | 'paid' | 'failed' | 'refunded'
