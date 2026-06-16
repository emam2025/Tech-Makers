-- Migration: Add payment status and reference fields
-- Run this in Supabase SQL Editor

-- Add status column to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS status text DEFAULT 'confirmed';

-- Add reference_number for InstaPay/Fawry receipts
ALTER TABLE payments ADD COLUMN IF NOT EXISTS reference_number text;

-- Add transaction_id for card/wallet transactions
ALTER TABLE payments ADD COLUMN IF NOT EXISTS transaction_id text;

-- Add receipt_url for proof of payment
ALTER TABLE payments ADD COLUMN IF NOT EXISTS receipt_url text;

-- Add paid_by_name (who made the payment - student or parent)
ALTER TABLE payments ADD COLUMN IF NOT EXISTS paid_by_name text;

-- Add valid status values
-- pending: waiting for confirmation
-- confirmed: payment verified
-- rejected: payment rejected
-- refunded: payment refunded
