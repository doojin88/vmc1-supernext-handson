-- ============================================================
-- Migration: 0005_fix_advertiser_profiles_schema
-- Description: Fix advertiser_profiles table schema to match service code
-- ============================================================

BEGIN;

-- Drop existing advertiser_profiles table and recreate with correct schema
DROP TABLE IF EXISTS advertiser_profiles CASCADE;

CREATE TABLE IF NOT EXISTS advertiser_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    business_number TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    business_type TEXT NOT NULL CHECK (business_type IN ('food', 'beauty', 'fashion', 'tech', 'lifestyle', 'other')),
    company_description TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (verification_status IN ('pending', 'verified', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE advertiser_profiles IS 'Advertiser business information';
COMMENT ON COLUMN advertiser_profiles.company_name IS 'Name of the company';
COMMENT ON COLUMN advertiser_profiles.business_number IS 'Business registration number (unique)';
COMMENT ON COLUMN advertiser_profiles.contact_name IS 'Contact person name';
COMMENT ON COLUMN advertiser_profiles.contact_phone IS 'Contact phone number';
COMMENT ON COLUMN advertiser_profiles.contact_email IS 'Contact email address';
COMMENT ON COLUMN advertiser_profiles.business_type IS 'Business category: food, beauty, fashion, tech, lifestyle, other';
COMMENT ON COLUMN advertiser_profiles.company_description IS 'Company description';
COMMENT ON COLUMN advertiser_profiles.verification_status IS 'Verification status: pending, verified, failed';

-- Ensure unique business registration numbers
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'advertiser_profiles_business_number_key'
    ) THEN
        ALTER TABLE advertiser_profiles 
        ADD CONSTRAINT advertiser_profiles_business_number_key 
        UNIQUE(business_number);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_advertiser_profiles_verification_status ON advertiser_profiles(verification_status);

-- Disable RLS
ALTER TABLE advertiser_profiles DISABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
CREATE TRIGGER update_advertiser_profiles_updated_at
    BEFORE UPDATE ON advertiser_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- ============================================================
-- Migration completed successfully
-- ============================================================
