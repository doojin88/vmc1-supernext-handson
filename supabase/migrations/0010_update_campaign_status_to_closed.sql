-- ============================================================
-- Migration: 0010_update_campaign_status_to_closed
-- Description: Update campaign status from 'recruitment_closed' to 'closed'
--              to match the new simplified status schema
-- ============================================================

BEGIN;

-- Update all campaigns with 'recruitment_closed' status to 'closed'
UPDATE campaigns
SET status = 'closed'
WHERE status = 'recruitment_closed';

-- Verify the update was successful
-- SELECT id, title, status FROM campaigns WHERE status = 'closed' LIMIT 5;

COMMIT;
