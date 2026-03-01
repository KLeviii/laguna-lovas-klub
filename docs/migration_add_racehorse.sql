-- Add is_racehorse column to horses table
-- Run this in the Supabase SQL Editor

ALTER TABLE horses
  ADD COLUMN IF NOT EXISTS is_racehorse BOOLEAN NOT NULL DEFAULT false;
