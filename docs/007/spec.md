# Use Case 007: My Applications (Influencer)

## Overview
Influencer views and manages their campaign applications with status filtering.

## Primary Actor
Authenticated User (Influencer)

## Precondition
- User is logged in
- User has influencer role
- User has completed influencer profile

## Trigger
User clicks "My Applications" in navigation menu

## Main Scenario
1. User navigates to "My Applications" page
2. System loads user's application list
3. System displays applications with:
   - Campaign title
   - Store name
   - Application date
   - Planned visit date
   - Application status badge (submitted/selected/rejected)
   - Campaign status
4. User can filter by status:
   - All applications
   - Submitted (pending review)
   - Selected (accepted)
   - Rejected (not selected)
5. System updates list based on selected filter
6. User clicks on an application
7. System shows detailed application view with full message and campaign details

## Edge Cases

### No Applications
- **No applications yet**: Show empty state with "Browse campaigns" button
- **Illustration/message**: "You haven't applied to any campaigns yet"

### Filter Results
- **No applications in selected status**: Show "No {status} applications" message
- **Empty filter result**: Provide option to clear filter

### Application Status Updates
- **Status changed since load**: Show notification badge, allow refresh
- **Real-time updates**: Optional polling or websocket for status changes

### Campaign Status
- **Campaign deleted**: Show "Campaign no longer available" in card
- **Recruitment closed**: Show campaign status badge
- **Selection completed**: Highlight if user was selected

### Loading States
- **Data loading**: Show skeleton loaders for application cards
- **Network error**: Show retry button with cached data
- **Timeout**: Show error with refresh option

### Pagination
- **Many applications**: Implement pagination or infinite scroll
- **Load more**: Show "Load more" button at bottom

## Business Rules
- Only influencers can access this page
- Advertisers are redirected to campaign dashboard
- Applications are sorted by created_at DESC (newest first)
- All application statuses are visible (no hiding rejected applications)
- Status filter is optional (default shows all)
- Each application card shows:
  - Campaign thumbnail
  - Campaign title
  - Store name
  - Application submission date
  - Planned visit date
  - Current status badge
- Clicking application shows full details in modal or separate page
- Application message and planned visit date are read-only
- Users cannot edit or delete applications after submission
- Status badge colors:
  - submitted: yellow/pending
  - selected: green/success
  - rejected: red/error

## Sequence Diagram

```plantuml
@startuml
actor User
participant FE
participant BE
participant Database

User -> FE: Click "My Applications"
FE -> User: Navigate to /my-applications

FE -> BE: GET /api/my-applications?status=all&page=1

BE -> BE: Verify user is influencer

BE -> Database: SELECT applications a\nJOIN campaigns c ON a.campaign_id = c.id\nWHERE a.influencer_id={current_user}\nORDER BY a.created_at DESC\nLIMIT 20

Database -> BE: Return applications list

BE -> BE: Format response with campaign details
BE -> FE: 200 OK\n{applications[], total_count}

FE -> FE: Render application cards
FE -> User: Display applications list

alt User applies status filter
  User -> FE: Select "Selected" filter
  
  FE -> BE: GET /api/my-applications?status=selected
  
  BE -> Database: SELECT applications a\nJOIN campaigns c ON a.campaign_id = c.id\nWHERE a.influencer_id={current_user}\nAND a.status='selected'\nORDER BY a.created_at DESC
  
  Database -> BE: Return filtered applications
  BE -> FE: 200 OK\n{applications[]}
  FE -> User: Display filtered list
end

alt User clicks application card
  User -> FE: Click application
  
  FE -> BE: GET /api/applications/{application_id}
  
  BE -> Database: SELECT applications a\nJOIN campaigns c ON a.campaign_id = c.id\nWHERE a.id={application_id}\nAND a.influencer_id={current_user}
  
  Database -> BE: Return application details
  BE -> FE: 200 OK\n{application, campaign}
  
  FE -> User: Show detailed view
end

@enduml
```

