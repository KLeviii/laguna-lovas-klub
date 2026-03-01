-- =============================================================================
-- MIGRÁCIÓ: is_pedigree_only oszlop hozzáadása a horses táblához
-- Futtatás: Supabase SQL Editor → paste & run
-- =============================================================================

ALTER TABLE horses
ADD COLUMN IF NOT EXISTS is_pedigree_only BOOLEAN NOT NULL DEFAULT false;

-- Meglévő lovak automatikusan false értéket kapnak (DEFAULT)
