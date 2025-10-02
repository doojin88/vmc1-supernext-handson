-- ============================================================
-- Migration: 0003_fix_campaign_advertiser_relationship
-- Description: Fix relationship between campaigns and advertiser_profiles
--              by ensuring proper foreign key constraints
-- ============================================================

BEGIN;

-- Add foreign key constraint from campaigns.advertiser_id to advertiser_profiles.user_id
-- This creates the relationship that Supabase can use for joins
DO $$ 
BEGIN
    -- Check if the constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'campaigns_advertiser_id_advertiser_profiles_fkey'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE campaigns 
        ADD CONSTRAINT campaigns_advertiser_id_advertiser_profiles_fkey 
        FOREIGN KEY (advertiser_id) REFERENCES advertiser_profiles(user_id) ON DELETE CASCADE;
    END IF;
END $$;

COMMIT;

-- ============================================================
-- Migration completed successfully
-- ============================================================
