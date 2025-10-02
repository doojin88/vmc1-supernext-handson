-- ============================================================
-- Migration: 0008_update_campaign_dates_to_future
-- Description: Update campaign recruitment dates to be after 2025-10-10
--              This ensures all sample campaigns show as "recruiting" status
-- ============================================================

BEGIN;

-- Update all campaigns to have recruitment end dates after 2025-10-10
-- Using 2025-10-10 as base date + random days (1-60) to spread them out

UPDATE campaigns 
SET 
    recruitment_start_date = '2025-10-01'::date,
    recruitment_end_date = '2025-10-10'::date + (RANDOM() * 60 + 1)::INTEGER * INTERVAL '1 day',
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

COMMIT;

-- ============================================================
-- Migration completed successfully
-- ============================================================
