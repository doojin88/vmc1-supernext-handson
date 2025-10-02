-- ============================================================
-- Migration: 0006_add_campaign_category
-- Description: Add category column to campaigns table for filtering
-- ============================================================

BEGIN;

-- Add category column to campaigns table
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'other' 
CHECK (category IN ('cafe', 'restaurant', 'electronics', 'beauty', 'app', 'fashion', 'health', 'education', 'entertainment', 'other'));

-- Add comment for the column
COMMENT ON COLUMN campaigns.category IS 'Campaign category for filtering and organization';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);

-- Update existing campaigns to have a default category
UPDATE campaigns 
SET category = 'other' 
WHERE category IS NULL OR category = '';

-- Make category column NOT NULL after setting default values
ALTER TABLE campaigns 
ALTER COLUMN category SET NOT NULL;

COMMIT;
