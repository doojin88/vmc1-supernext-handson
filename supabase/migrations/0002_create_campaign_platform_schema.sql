-- ============================================================
-- Migration: 0002_create_campaign_platform_schema
-- Description: Create schema for blog experience campaign platform
--              Includes user profiles, influencer/advertiser profiles,
--              campaigns, and applications
-- ============================================================

BEGIN;

-- ============================================================
-- 1. USER PROFILES (Common layer for all users)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('influencer', 'advertiser')),
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_profiles IS 'Common user profile data with role assignment';
COMMENT ON COLUMN user_profiles.role IS 'User role: influencer or advertiser';
COMMENT ON COLUMN user_profiles.full_name IS 'User full name';
COMMENT ON COLUMN user_profiles.phone_number IS 'Contact phone number';

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Disable RLS
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. TERMS AGREEMENTS (Consent tracking)
-- ============================================================

CREATE TABLE IF NOT EXISTS terms_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    terms_version TEXT NOT NULL,
    agreed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE terms_agreements IS 'Track user consent to terms and conditions';
COMMENT ON COLUMN terms_agreements.terms_version IS 'Version identifier for terms document';

-- Prevent duplicate agreements for same version
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'terms_agreements_user_id_terms_version_key'
    ) THEN
        ALTER TABLE terms_agreements 
        ADD CONSTRAINT terms_agreements_user_id_terms_version_key 
        UNIQUE(user_id, terms_version);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_terms_agreements_user_id ON terms_agreements(user_id);

-- Disable RLS
ALTER TABLE terms_agreements DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. INFLUENCER PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS influencer_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    birth_date DATE NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE influencer_profiles IS 'Influencer-specific profile data';
COMMENT ON COLUMN influencer_profiles.birth_date IS 'Influencer birth date for age verification';
COMMENT ON COLUMN influencer_profiles.is_verified IS 'Whether influencer profile is verified';

-- Disable RLS
ALTER TABLE influencer_profiles DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. INFLUENCER CHANNELS (SNS platforms)
-- ============================================================

CREATE TABLE IF NOT EXISTS influencer_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('naver', 'youtube', 'instagram', 'threads')),
    channel_name TEXT NOT NULL,
    channel_url TEXT NOT NULL,
    follower_count INTEGER,
    verification_status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (verification_status IN ('pending', 'verified', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE influencer_channels IS 'SNS channel information for influencers';
COMMENT ON COLUMN influencer_channels.platform IS 'SNS platform: naver, youtube, instagram, threads';
COMMENT ON COLUMN influencer_channels.channel_name IS 'Display name of the channel';
COMMENT ON COLUMN influencer_channels.channel_url IS 'URL to the channel';
COMMENT ON COLUMN influencer_channels.follower_count IS 'Number of followers/subscribers';
COMMENT ON COLUMN influencer_channels.verification_status IS 'Channel verification status: pending, verified, failed';

-- Prevent duplicate channels
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'influencer_channels_user_id_platform_channel_url_key'
    ) THEN
        ALTER TABLE influencer_channels 
        ADD CONSTRAINT influencer_channels_user_id_platform_channel_url_key 
        UNIQUE(user_id, platform, channel_url);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_influencer_channels_user_id ON influencer_channels(user_id);
CREATE INDEX IF NOT EXISTS idx_influencer_channels_status ON influencer_channels(verification_status);

-- Disable RLS
ALTER TABLE influencer_channels DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. ADVERTISER PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS advertiser_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_registration_number TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE advertiser_profiles IS 'Advertiser business information';
COMMENT ON COLUMN advertiser_profiles.business_name IS 'Name of the business';
COMMENT ON COLUMN advertiser_profiles.business_registration_number IS 'Business registration number (unique)';
COMMENT ON COLUMN advertiser_profiles.location IS 'Business location/address';
COMMENT ON COLUMN advertiser_profiles.category IS 'Business category';
COMMENT ON COLUMN advertiser_profiles.is_verified IS 'Whether business is verified';

-- Ensure unique business registration numbers
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'advertiser_profiles_business_registration_number_key'
    ) THEN
        ALTER TABLE advertiser_profiles 
        ADD CONSTRAINT advertiser_profiles_business_registration_number_key 
        UNIQUE(business_registration_number);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_advertiser_profiles_verified ON advertiser_profiles(is_verified);

-- Disable RLS
ALTER TABLE advertiser_profiles DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. CAMPAIGNS
-- ============================================================

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advertiser_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic information
    title TEXT NOT NULL,
    description TEXT,
    
    -- Recruitment details
    recruitment_start_date DATE NOT NULL,
    recruitment_end_date DATE NOT NULL,
    recruitment_count INTEGER NOT NULL CHECK (recruitment_count > 0),
    
    -- Campaign details
    benefits TEXT NOT NULL,
    mission TEXT NOT NULL,
    
    -- Store information
    store_name TEXT NOT NULL,
    store_address TEXT NOT NULL,
    store_phone TEXT,
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'recruiting' 
        CHECK (status IN ('recruiting', 'recruitment_closed', 'selection_completed')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE campaigns IS 'Campaign/experience program details and recruitment info';
COMMENT ON COLUMN campaigns.advertiser_id IS 'Advertiser who created this campaign';
COMMENT ON COLUMN campaigns.title IS 'Campaign title';
COMMENT ON COLUMN campaigns.recruitment_start_date IS 'When recruitment starts';
COMMENT ON COLUMN campaigns.recruitment_end_date IS 'When recruitment ends';
COMMENT ON COLUMN campaigns.recruitment_count IS 'Target number of influencers to recruit';
COMMENT ON COLUMN campaigns.benefits IS 'Benefits provided to selected influencers';
COMMENT ON COLUMN campaigns.mission IS 'Mission/requirements for influencers';
COMMENT ON COLUMN campaigns.status IS 'Campaign status: recruiting, recruitment_closed, selection_completed';

CREATE INDEX IF NOT EXISTS idx_campaigns_advertiser_id ON campaigns(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(recruitment_start_date, recruitment_end_date);

-- Disable RLS
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. APPLICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Application content
    message TEXT NOT NULL,
    planned_visit_date DATE NOT NULL,
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'submitted' 
        CHECK (status IN ('submitted', 'selected', 'rejected')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE applications IS 'Campaign applications from influencers';
COMMENT ON COLUMN applications.campaign_id IS 'Campaign being applied to';
COMMENT ON COLUMN applications.influencer_id IS 'Influencer submitting application';
COMMENT ON COLUMN applications.message IS 'Application message (각오 한마디)';
COMMENT ON COLUMN applications.planned_visit_date IS 'Planned date to visit store/use service';
COMMENT ON COLUMN applications.status IS 'Application status: submitted, selected, rejected';

-- Prevent duplicate applications
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'applications_campaign_id_influencer_id_key'
    ) THEN
        ALTER TABLE applications 
        ADD CONSTRAINT applications_campaign_id_influencer_id_key 
        UNIQUE(campaign_id, influencer_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_applications_campaign_id ON applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_applications_influencer_id ON applications(influencer_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Disable RLS
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 8. TRIGGERS FOR updated_at
-- ============================================================

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist (for idempotency)
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_influencer_profiles_updated_at ON influencer_profiles;
DROP TRIGGER IF EXISTS update_influencer_channels_updated_at ON influencer_channels;
DROP TRIGGER IF EXISTS update_advertiser_profiles_updated_at ON advertiser_profiles;
DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencer_profiles_updated_at
    BEFORE UPDATE ON influencer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencer_channels_updated_at
    BEFORE UPDATE ON influencer_channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advertiser_profiles_updated_at
    BEFORE UPDATE ON advertiser_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- ============================================================
-- Migration completed successfully
-- ============================================================

