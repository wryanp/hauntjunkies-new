-- Migration: Add new fields to ticket_requests table
-- Run this in Supabase SQL Editor if you already have the ticket_requests table

ALTER TABLE ticket_requests
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS tickets INTEGER,
ADD COLUMN IF NOT EXISTS special_requests TEXT,
ADD COLUMN IF NOT EXISTS confirmation_number VARCHAR(20) UNIQUE;

-- Update tickets column to match quantity for existing records
UPDATE ticket_requests SET tickets = quantity WHERE tickets IS NULL AND quantity IS NOT NULL;

-- Make tickets NOT NULL after copying data
ALTER TABLE ticket_requests ALTER COLUMN tickets SET NOT NULL;

-- Make email optional (for cases where only phone is provided)
ALTER TABLE ticket_requests ALTER COLUMN email DROP NOT NULL;
