-- ============================================================
-- Migration: 0008_update_campaign_dates_to_2025
-- Description: Update campaign recruitment dates for 2025-10-02 timeframe
--              Set recruitment start dates to within 1 week before current date
--              Set recruitment end dates to within 1 month after current date
-- ============================================================

BEGIN;

-- Update all campaigns to have recruitment dates relative to 2025-10-02
-- Using specific dates for consistency across all campaigns

UPDATE campaigns
SET
    recruitment_start_date = CASE
        WHEN id = '11111111-1111-1111-1111-111111111111' THEN '2025-09-28'  -- 4 days before
        WHEN id = '22222222-2222-2222-2222-222222222222' THEN '2025-09-26'  -- 6 days before
        WHEN id = '33333333-3333-3333-3333-333333333333' THEN '2025-09-29'  -- 3 days before
        WHEN id = '44444444-4444-4444-4444-444444444444' THEN '2025-09-27'  -- 5 days before
        WHEN id = '55555555-5555-5555-5555-555555555555' THEN '2025-10-01'  -- 1 day before
        WHEN id = '66666666-6666-6666-6666-666666666666' THEN '2025-09-30'  -- 2 days before
        WHEN id = '77777777-7777-7777-7777-777777777777' THEN '2025-09-25'  -- 7 days before
        WHEN id = '88888888-8888-8888-8888-888888888888' THEN '2025-09-28'  -- 4 days before
        ELSE recruitment_start_date
    END,
    recruitment_end_date = CASE
        WHEN id = '11111111-1111-1111-1111-111111111111' THEN '2025-10-15'  -- 13 days after
        WHEN id = '22222222-2222-2222-2222-222222222222' THEN '2025-10-18'  -- 16 days after
        WHEN id = '33333333-3333-3333-3333-333333333333' THEN '2025-10-12'  -- 10 days after
        WHEN id = '44444444-4444-4444-4444-444444444444' THEN '2025-10-20'  -- 18 days after
        WHEN id = '55555555-5555-5555-5555-555555555555' THEN '2025-10-08'  -- 6 days after
        WHEN id = '66666666-6666-6666-6666-666666666666' THEN '2025-10-22'  -- 20 days after
        WHEN id = '77777777-7777-7777-7777-777777777777' THEN '2025-10-10'  -- 8 days after
        WHEN id = '88888888-8888-8888-8888-888888888888' THEN '2025-10-25'  -- 23 days after
        ELSE recruitment_end_date
    END,
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

-- Ensure all campaigns have proper categories
UPDATE campaigns
SET category = CASE
    WHEN id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444') THEN 'other'
    WHEN id IN ('55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666') THEN 'restaurant'
    WHEN id = '77777777-7777-7777-7777-777777777777' THEN 'cafe'
    WHEN id = '88888888-8888-8888-8888-888888888888' THEN 'other'
    ELSE category
END
WHERE category IS NULL OR category = '';

COMMIT;

