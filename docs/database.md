# Database Design - Blog Experience Campaign Platform

## Overview

This document describes the database schema and data flow for the Blog Experience Campaign SaaS platform. The platform connects advertisers with influencers for campaign matching and management.

**Database**: PostgreSQL (via Supabase)  
**Authentication**: Supabase Auth (Email-based)

---

## High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. SIGNUP & ROLE SELECTION                                          │
│    Supabase Auth (auth.users)                                       │
│            ↓                                                         │
│    user_profiles (role, name, phone)                                │
│            ↓                                                         │
│    terms_agreements (consent tracking)                              │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┴──────────────────────┐
        ↓                                             ↓
┌──────────────────────────┐          ┌──────────────────────────┐
│ 2. INFLUENCER ONBOARDING │          │ 3. ADVERTISER ONBOARDING │
│                          │          │                          │
│  influencer_profiles     │          │  advertiser_profiles     │
│  (birth_date, verified)  │          │  (business info)         │
│          ↓               │          │                          │
│  influencer_channels     │          │                          │
│  (SNS platforms)         │          │                          │
└──────────────────────────┘          └──────────────────────────┘
        ↓                                             ↓
┌──────────────────────────┐          ┌──────────────────────────┐
│ 4-6. BROWSE & APPLY      │          │ 8-9. MANAGE CAMPAIGNS    │
│                          │          │                          │
│  campaigns (READ)        │◄─────────│  campaigns (CRUD)        │
│      ↓                   │          │      ↓                   │
│  applications (CREATE)   │          │  applications (VIEW)     │
│                          │          │  (select winners)        │
└──────────────────────────┘          └──────────────────────────┘
        ↓
┌──────────────────────────┐
│ 7. MY APPLICATIONS       │
│                          │
│  applications (READ)     │
│  (filter by status)      │
└──────────────────────────┘
```

---

## User Flow → Data Flow Mapping

### 1. Signup & Role Selection
- **Input**: Email, password, name, phone, role (influencer/advertiser), terms agreement
- **Tables**: `auth.users` → `user_profiles` → `terms_agreements`
- **Output**: User account created with role assigned

### 2. Influencer Profile Registration
- **Input**: Birth date, SNS channels (platform, name, URL, follower count)
- **Tables**: `influencer_profiles`, `influencer_channels`
- **Output**: Profile marked for verification, influencer can apply to campaigns

### 3. Advertiser Profile Registration
- **Input**: Business name, location, category, business registration number
- **Tables**: `advertiser_profiles`
- **Output**: Profile marked for verification, advertiser can create campaigns

### 4. Home & Campaign Browsing
- **Input**: Filter/sort preferences
- **Tables**: `campaigns` (READ, status='recruiting')
- **Output**: List of active campaigns

### 5. Campaign Detail View
- **Input**: Campaign ID
- **Tables**: `campaigns` (JOIN with advertiser info)
- **Output**: Detailed campaign information, application button (if eligible)

### 6. Campaign Application
- **Input**: Message, planned visit date
- **Tables**: `applications` (CREATE)
- **Constraints**: Must be influencer, no duplicate applications
- **Output**: Application submitted (status='submitted')

### 7. My Applications (Influencer)
- **Input**: Status filter
- **Tables**: `applications` (READ, WHERE influencer_id = current_user)
- **Output**: List of applications with status

### 8. Campaign Management (Advertiser)
- **Input**: Campaign details (title, dates, benefits, mission, store info)
- **Tables**: `campaigns` (CREATE/READ)
- **Output**: Campaign created (status='recruiting')

### 9. Campaign Detail & Selection (Advertiser)
- **Input**: Campaign ID, selection decisions
- **Tables**: `campaigns` (UPDATE status), `applications` (READ/UPDATE)
- **Flow**: 
  - recruiting → recruitment_closed (early closure)
  - recruitment_closed → selection_completed (after selecting winners)
  - Update selected applications: status='selected', others='rejected'

---

## Database Schema

### Entity Relationship Diagram

```
auth.users (Supabase)
    ↓ (1:1)
user_profiles
    ├─→ (1:1) influencer_profiles
    │         ↓ (1:N)
    │     influencer_channels
    │
    ├─→ (1:1) advertiser_profiles
    │         ↓ (1:N)
    │     campaigns
    │         ↓ (N:M via applications)
    │     influencer_profiles
    │
    └─→ (1:N) terms_agreements
```

---

## Table Definitions

### 1. user_profiles
**Purpose**: Store common user information and role

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, FK → auth.users | User ID from Supabase Auth |
| role | TEXT | NOT NULL, CHECK(influencer/advertiser) | User role |
| full_name | TEXT | NOT NULL | Full name |
| phone_number | TEXT | NOT NULL | Contact phone |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**: role

---

### 2. terms_agreements
**Purpose**: Track user consent to terms and conditions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Agreement ID |
| user_id | UUID | NOT NULL, FK → auth.users | User reference |
| terms_version | TEXT | NOT NULL | Terms version identifier |
| agreed_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Consent timestamp |

**Unique**: (user_id, terms_version)  
**Indexes**: user_id

---

### 3. influencer_profiles
**Purpose**: Store influencer-specific profile data

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | UUID | PK, FK → auth.users | User reference |
| birth_date | DATE | NOT NULL | Birth date |
| is_verified | BOOLEAN | NOT NULL, DEFAULT FALSE | Verification status |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

---

### 4. influencer_channels
**Purpose**: Store SNS channel information for influencers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Channel ID |
| user_id | UUID | NOT NULL, FK → auth.users | Influencer reference |
| platform | TEXT | NOT NULL, CHECK(naver/youtube/instagram/threads) | SNS platform |
| channel_name | TEXT | NOT NULL | Channel display name |
| channel_url | TEXT | NOT NULL | Channel URL |
| follower_count | INTEGER | | Number of followers |
| verification_status | TEXT | NOT NULL, DEFAULT 'pending', CHECK(pending/verified/failed) | Verification state |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Unique**: (user_id, platform, channel_url)  
**Indexes**: user_id, verification_status

---

### 5. advertiser_profiles
**Purpose**: Store advertiser business information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | UUID | PK, FK → auth.users | User reference |
| business_name | TEXT | NOT NULL | Business name |
| business_registration_number | TEXT | NOT NULL, UNIQUE | Business registration number |
| location | TEXT | NOT NULL | Business location |
| category | TEXT | NOT NULL | Business category |
| is_verified | BOOLEAN | NOT NULL, DEFAULT FALSE | Verification status |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**: is_verified

---

### 6. campaigns
**Purpose**: Store campaign information and recruitment details

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Campaign ID |
| advertiser_id | UUID | NOT NULL, FK → auth.users | Advertiser reference |
| title | TEXT | NOT NULL | Campaign title |
| description | TEXT | | Campaign description |
| recruitment_start_date | DATE | NOT NULL | Recruitment start date |
| recruitment_end_date | DATE | NOT NULL | Recruitment end date |
| recruitment_count | INTEGER | NOT NULL, CHECK(> 0) | Target recruitment count |
| benefits | TEXT | NOT NULL | Benefits provided |
| mission | TEXT | NOT NULL | Mission requirements |
| store_name | TEXT | NOT NULL | Store name |
| store_address | TEXT | NOT NULL | Store address |
| store_phone | TEXT | | Store phone number |
| status | TEXT | NOT NULL, DEFAULT 'recruiting', CHECK(recruiting/recruitment_closed/selection_completed) | Campaign status |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**: advertiser_id, status, (recruitment_start_date, recruitment_end_date)

---

### 7. applications
**Purpose**: Store campaign applications from influencers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Application ID |
| campaign_id | UUID | NOT NULL, FK → campaigns | Campaign reference |
| influencer_id | UUID | NOT NULL, FK → auth.users | Influencer reference |
| message | TEXT | NOT NULL | Application message (각오 한마디) |
| planned_visit_date | DATE | NOT NULL | Planned visit date |
| status | TEXT | NOT NULL, DEFAULT 'submitted', CHECK(submitted/selected/rejected) | Application status |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Unique**: (campaign_id, influencer_id) - Prevents duplicate applications  
**Indexes**: campaign_id, influencer_id, status

---

## Status Flow Definitions

### Campaign Status Flow
```
recruiting → recruitment_closed → selection_completed
```

- **recruiting**: Active recruitment phase
- **recruitment_closed**: Recruitment ended (manual or automatic), awaiting selection
- **selection_completed**: Winners selected, application statuses updated

### Application Status Flow
```
submitted → selected / rejected
```

- **submitted**: Application submitted and pending review
- **selected**: Selected as campaign participant
- **rejected**: Not selected for campaign

### Channel Verification Status
```
pending → verified / failed
```

- **pending**: Awaiting verification (can be async)
- **verified**: Channel verified successfully
- **failed**: Verification failed

---

## Key Business Rules

### Access Control

1. **Influencers can**:
   - View all active campaigns (status='recruiting')
   - Apply to campaigns (if influencer_profiles exists)
   - View their own applications
   - Cannot create campaigns

2. **Advertisers can**:
   - Create and manage their own campaigns
   - View applicants for their campaigns
   - Close recruitment early
   - Select campaign winners
   - Cannot apply to campaigns

### Data Integrity

1. **Unique Constraints**:
   - One application per influencer per campaign
   - One business registration number per advertiser
   - One channel URL per platform per influencer

2. **Referential Integrity**:
   - All user-related records cascade delete with auth.users
   - Applications cascade delete with campaigns
   - Profile data cascade delete with users

3. **Validation Rules**:
   - recruitment_count must be positive
   - Dates must be valid and logical
   - Status transitions must follow defined flows

---

## Performance Considerations

### Indexes

Strategic indexes are created for:
- Role-based queries (`user_profiles.role`)
- Campaign filtering (`campaigns.status`, date ranges)
- Application lookups (campaign_id, influencer_id, status)
- Verification status tracking (`influencer_channels.verification_status`)

### Query Patterns

Common queries optimized:
1. List active campaigns: `WHERE status = 'recruiting' AND recruitment_end_date >= NOW()`
2. User's applications: `WHERE influencer_id = $1 ORDER BY created_at DESC`
3. Campaign applicants: `WHERE campaign_id = $1 ORDER BY created_at ASC`
4. Advertiser campaigns: `WHERE advertiser_id = $1 ORDER BY created_at DESC`

---

## Security Considerations

- **RLS Disabled**: Row-level security is disabled; access control handled at application layer
- **No Plaintext Passwords**: Authentication delegated to Supabase Auth
- **Input Validation**: All user inputs validated at application layer before DB insertion
- **Cascading Deletes**: Proper cleanup on user deletion
- **Unique Constraints**: Prevent duplicate business registrations and applications

---

## Migration Strategy

All schema changes are tracked in `/supabase/migrations/`:
- `0002_create_campaign_platform_schema.sql` - Initial schema creation
- Future migrations will be numbered sequentially (0003, 0004, etc.)

Each migration is idempotent and can be safely re-run.

---

## Future Considerations

Potential extensions not in current scope:
- Review/rating system after campaign completion
- Notification/messaging system
- Campaign analytics and reporting
- Payment/compensation tracking
- Multi-step application workflow
- Campaign categories and tags
- Advanced search and filtering

