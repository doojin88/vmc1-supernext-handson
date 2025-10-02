-- ============================================================
-- Migration: 0007_update_campaign_dates_to_current
-- Description: Update campaign recruitment end dates to be within the next month from current date
--              This ensures all sample campaigns show as "recruiting" status
-- ============================================================

BEGIN;

-- Update all campaigns to have recruitment end dates within the next month
-- Using CURRENT_DATE + random days (1-30) to spread them out

UPDATE campaigns 
SET 
    recruitment_start_date = CURRENT_DATE - INTERVAL '7 days',
    recruitment_end_date = CURRENT_DATE + (RANDOM() * 30 + 1)::INTEGER * INTERVAL '1 day',
    status = 'recruiting'
WHERE id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222', 
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555',
    '66666666-6666-6666-6666-666666666666',
    '77777777-7777-7777-7777-777777777777',
    '88888888-8888-8888-8888-888888888888'
);

-- Add category column if it doesn't exist (for the new campaigns)
UPDATE campaigns 
SET category = CASE 
    WHEN id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444') THEN 'other'
    WHEN id IN ('55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666') THEN 'restaurant'
    WHEN id = '77777777-7777-7777-7777-777777777777' THEN 'cafe'
    WHEN id = '88888888-8888-8888-8888-888888888888' THEN 'other'
    ELSE 'other'
END
WHERE category IS NULL OR category = '';

COMMIT;
