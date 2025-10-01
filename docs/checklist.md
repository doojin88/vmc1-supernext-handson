# Implementation Checklist

## Overview
This document tracks the implementation progress of all 9 features for the Blog Experience Campaign Platform.

---

## 001: Signup & Role Selection

### Backend
- [ ] Create `src/features/auth/backend/schema.ts`
  - [ ] SignupRequestSchema with email, password, name, phone, role validation
  - [ ] SignupResponseSchema
  - [ ] UserProfileRowSchema
- [ ] Create `src/features/auth/backend/error.ts`
  - [ ] Define authErrorCodes
- [ ] Create `src/features/auth/backend/service.ts`
  - [ ] signupUser function with transaction support
  - [ ] Create auth user, user profile, terms agreement
  - [ ] Rollback on failure
- [ ] Create `src/features/auth/backend/route.ts`
  - [ ] POST /auth/signup route
- [ ] Register auth routes in `src/backend/hono/app.ts`
- [ ] Write unit tests for auth service

### Frontend
- [ ] Create `src/features/auth/lib/dto.ts` (re-export schemas)
- [ ] Create `src/features/auth/types.ts` (UserRole, ROLE_LABELS)
- [ ] Create `src/features/auth/hooks/useSignupMutation.ts`
- [ ] Create `src/constants/terms.ts` (CURRENT_TERMS_VERSION)
- [ ] Update `src/app/signup/page.tsx`
  - [ ] Add role selection field
  - [ ] Add full name and phone number fields
  - [ ] Add terms agreement checkbox
  - [ ] Integrate useSignupMutation
  - [ ] Add role-based redirection
- [ ] Add form validation for phone number format
- [ ] Add shadcn components: form, radio-group, checkbox
- [ ] Complete QA test sheet

### Testing
- [ ] Run type check: `npm run type-check`
- [ ] Run linter: `npm run lint`
- [ ] Run build: `npm run build`
- [ ] Manual testing with QA sheet

---

## 002: Influencer Profile Registration

### Backend
- [ ] Create `src/features/influencer/backend/schema.ts`
  - [ ] ChannelSchema with platform validation
  - [ ] CreateProfileRequestSchema with age check
  - [ ] CreateProfileResponseSchema
- [ ] Create `src/features/influencer/backend/error.ts`
- [ ] Create `src/features/influencer/backend/service.ts`
  - [ ] createInfluencerProfile with channels
  - [ ] Rollback on channel insertion failure
- [ ] Create `src/features/influencer/backend/route.ts`
  - [ ] POST /influencer/profile
- [ ] Register routes in Hono app
- [ ] Write unit tests

### Frontend
- [ ] Create `src/features/influencer/types.ts` (platforms, URL patterns)
- [ ] Create `src/features/influencer/lib/dto.ts`
- [ ] Create `src/features/influencer/components/channel-input.tsx`
- [ ] Create `src/features/influencer/hooks/useCreateProfileMutation.ts`
- [ ] Create `src/app/onboarding/influencer/page.tsx`
  - [ ] Birth date picker
  - [ ] Dynamic channel management (add/remove)
  - [ ] Platform-specific URL validation
- [ ] Add shadcn components: select, date-picker
- [ ] Complete QA test sheet

### Testing
- [ ] Type check, lint, build
- [ ] Manual testing

---

## 003: Advertiser Profile Registration

### Backend
- [ ] Create `src/features/advertiser/backend/schema.ts`
  - [ ] CreateAdvertiserProfileRequestSchema
  - [ ] Business registration number format validation
- [ ] Create `src/features/advertiser/backend/error.ts`
- [ ] Create `src/features/advertiser/backend/service.ts`
  - [ ] createAdvertiserProfile
  - [ ] Duplicate registration check
- [ ] Create `src/features/advertiser/backend/route.ts`
- [ ] Register routes
- [ ] Write unit tests

### Frontend
- [ ] Create `src/features/advertiser/types.ts` (categories)
- [ ] Create `src/features/advertiser/lib/dto.ts`
- [ ] Create `src/features/advertiser/hooks/useCreateProfileMutation.ts`
- [ ] Create `src/app/onboarding/advertiser/page.tsx`
  - [ ] Business information form
  - [ ] Category selection
  - [ ] Registration number formatter
- [ ] Complete QA test sheet

### Testing
- [ ] Type check, lint, build
- [ ] Manual testing

---

## 004: Home & Campaign Browsing

### Backend
- [ ] Create `src/features/campaign/backend/schema.ts`
  - [ ] CampaignListQuerySchema (pagination, filters, sorting)
  - [ ] CampaignCardSchema
  - [ ] CampaignListResponseSchema
- [ ] Create `src/features/campaign/backend/error.ts`
- [ ] Create `src/features/campaign/backend/service.ts`
  - [ ] listCampaigns with filters and pagination
- [ ] Create `src/features/campaign/backend/route.ts`
  - [ ] GET /campaigns
- [ ] Register routes
- [ ] Write unit tests

### Frontend
- [ ] Create `src/features/campaign/lib/dto.ts`
- [ ] Create `src/features/campaign/components/campaign-card.tsx`
- [ ] Create `src/features/campaign/components/campaign-filter.tsx`
- [ ] Create `src/features/campaign/hooks/useCampaignsQuery.ts`
- [ ] Update `src/app/page.tsx`
  - [ ] Campaign list with cards
  - [ ] Filter controls
  - [ ] Sort controls
  - [ ] Pagination/load more
- [ ] Add skeleton loaders
- [ ] Complete QA test sheet

### Testing
- [ ] Type check, lint, build
- [ ] Manual testing

---

## 005: Campaign Detail View

### Backend
- [ ] Update `src/features/campaign/backend/service.ts`
  - [ ] getCampaignById with advertiser info
- [ ] Add route: GET /campaigns/:id
- [ ] Add route: GET /campaigns/:campaignId/my-application
- [ ] Write unit tests

### Frontend
- [ ] Create `src/features/campaign/components/apply-button.tsx`
  - [ ] Conditional rendering based on role and profile
- [ ] Create `src/features/campaign/hooks/useCampaignQuery.ts`
- [ ] Create `src/features/application/hooks/useApplicationCheck.ts`
- [ ] Create `src/app/campaigns/[id]/page.tsx`
  - [ ] Campaign detail display
  - [ ] Store information
  - [ ] Benefits and mission
  - [ ] Apply button with eligibility checks
- [ ] Complete QA test sheet

### Testing
- [ ] Type check, lint, build
- [ ] Manual testing

---

## 006: Campaign Application

### Backend
- [ ] Create `src/features/application/backend/schema.ts`
  - [ ] CreateApplicationRequestSchema
  - [ ] CreateApplicationResponseSchema
- [ ] Create `src/features/application/backend/error.ts`
- [ ] Create `src/features/application/backend/service.ts`
  - [ ] createApplication with validations
  - [ ] Campaign status check
  - [ ] Duplicate check
- [ ] Create `src/features/application/backend/route.ts`
  - [ ] POST /applications
- [ ] Register routes
- [ ] Write unit tests

### Frontend
- [ ] Create `src/features/application/lib/dto.ts`
- [ ] Create `src/features/application/hooks/useApplyMutation.ts`
- [ ] Create `src/app/campaigns/[id]/apply/page.tsx`
  - [ ] Application form
  - [ ] Message textarea with character counter
  - [ ] Planned visit date picker
  - [ ] Campaign summary display
- [ ] Complete QA test sheet

### Testing
- [ ] Type check, lint, build
- [ ] Manual testing

---

## 007: My Applications (Influencer)

### Backend
- [ ] Update `src/features/application/backend/schema.ts`
  - [ ] MyApplicationsQuerySchema
  - [ ] ApplicationItemSchema
- [ ] Update `src/features/application/backend/service.ts`
  - [ ] getMyApplications with status filter
- [ ] Add route: GET /my-applications
- [ ] Write unit tests

### Frontend
- [ ] Create `src/features/application/components/application-card.tsx`
- [ ] Create `src/features/application/components/application-status-badge.tsx`
- [ ] Create `src/features/application/components/status-filter.tsx`
- [ ] Create `src/features/application/components/application-detail-modal.tsx`
- [ ] Create `src/features/application/hooks/useMyApplicationsQuery.ts`
- [ ] Create `src/app/my-applications/page.tsx`
  - [ ] Application list
  - [ ] Status filter
  - [ ] Empty state
  - [ ] Pagination
- [ ] Add role guard (influencer only)
- [ ] Complete QA test sheet

### Testing
- [ ] Type check, lint, build
- [ ] Manual testing

---

## 008: Campaign Management (Advertiser)

### Backend
- [ ] Update `src/features/campaign/backend/schema.ts`
  - [ ] CreateCampaignRequestSchema
  - [ ] AdvertiserCampaignItemSchema
- [ ] Update `src/features/campaign/backend/service.ts`
  - [ ] createCampaign
  - [ ] listMyCampaigns
- [ ] Add route: POST /campaigns
- [ ] Add route: GET /advertiser/campaigns
- [ ] Write unit tests

### Frontend
- [ ] Create `src/features/campaign/components/create-campaign-dialog.tsx`
- [ ] Create `src/features/campaign/components/campaign-table.tsx`
- [ ] Create `src/features/campaign/hooks/useCreateCampaignMutation.ts`
- [ ] Create `src/features/campaign/hooks/useMyCampaignsQuery.ts`
- [ ] Create `src/app/(protected)/campaigns/manage/page.tsx`
  - [ ] Campaign dashboard
  - [ ] Create button
  - [ ] Campaign table
  - [ ] Empty state
- [ ] Add role guard (advertiser only)
- [ ] Add date range validation
- [ ] Complete QA test sheet

### Testing
- [ ] Type check, lint, build
- [ ] Manual testing

---

## 009: Campaign Detail & Selection (Advertiser)

### Backend
- [ ] Update `src/features/campaign/backend/schema.ts`
  - [ ] ApplicantItemSchema
  - [ ] SelectParticipantsRequestSchema
- [ ] Update `src/features/campaign/backend/service.ts`
  - [ ] getCampaignApplicants with ownership check
  - [ ] closeRecruitment
  - [ ] selectParticipants with rollback
- [ ] Add route: GET /campaigns/:id/applicants
- [ ] Add route: PUT /campaigns/:id/close
- [ ] Add route: POST /campaigns/:id/select
- [ ] Write unit tests with rollback scenarios

### Frontend
- [ ] Create `src/features/campaign/components/applicants-table.tsx`
- [ ] Create `src/features/campaign/components/close-recruitment-dialog.tsx`
- [ ] Create `src/features/campaign/components/selection-dialog.tsx`
- [ ] Create `src/features/campaign/hooks/useApplicantsQuery.ts`
- [ ] Create `src/features/campaign/hooks/useCloseCampaignMutation.ts`
- [ ] Create `src/features/campaign/hooks/useSelectParticipantsMutation.ts`
- [ ] Update `src/app/(protected)/campaigns/[id]/page.tsx`
  - [ ] Applicants table with selection
  - [ ] Close recruitment button
  - [ ] Select participants button
  - [ ] Status-based conditional rendering
- [ ] Add ownership verification
- [ ] Add selection count validation
- [ ] Complete QA test sheet

### Testing
- [ ] Type check, lint, build
- [ ] Manual testing

---

## Cross-Cutting Concerns

### Shared Utilities
- [ ] Create phone validation utility
- [ ] Create email validation utility
- [ ] Create date utilities (age calculation, formatting)
- [ ] Create URL validation utilities

### Authentication & Authorization
- [ ] Update middleware for role-based access
- [ ] Add auth context with role information
- [ ] Update useCurrentUser hook to include profile status

### UI Components (Shadcn)
- [ ] Install required shadcn components
- [ ] Customize theme if needed
- [ ] Ensure accessibility

### Database
- [ ] ✅ Migration 0002 created (user profiles, campaigns, applications)
- [ ] Apply migration to Supabase
- [ ] Verify tables and indexes

### Documentation
- [ ] Update README with setup instructions
- [ ] Document environment variables
- [ ] Document API endpoints

---

## Testing & Quality Assurance

### Unit Tests
- [ ] Auth service tests
- [ ] Influencer service tests
- [ ] Advertiser service tests
- [ ] Campaign service tests
- [ ] Application service tests

### Integration Tests
- [ ] End-to-end user flows
- [ ] Influencer journey
- [ ] Advertiser journey

### Manual QA
- [ ] Complete all QA test sheets
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Test error scenarios
- [ ] Test edge cases

### Performance
- [ ] Check bundle size
- [ ] Optimize images
- [ ] Add loading states
- [ ] Implement pagination properly

---

## Deployment Preparation
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Build succeeds without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All tests passing

---

## Current Status
**Last Updated**: 2025-10-01

**Completed Features**: 0/9
**In Progress**: None
**Next Up**: Feature 001 - Signup & Role Selection

