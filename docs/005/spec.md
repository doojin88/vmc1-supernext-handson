# Use Case 005: Campaign Detail View

## Overview
User views detailed information about a specific campaign and determines eligibility to apply.

## Primary Actor
Any User (Anonymous or Authenticated)

## Precondition
- Campaign exists in the system
- Campaign is accessible (not deleted)

## Trigger
User clicks on a campaign card from the campaign list

## Main Scenario
1. User navigates to campaign detail page
2. System loads campaign information
3. System displays campaign details:
   - Campaign title and description
   - Store information (name, address, phone)
   - Recruitment period (start/end dates)
   - Recruitment count (current/target)
   - Benefits provided
   - Mission requirements
   - Campaign status
4. System checks user authentication and role
5. System determines eligibility to apply:
   - If anonymous: Show "Login to apply" button
   - If advertiser: Hide apply button
   - If influencer without profile: Show "Complete profile to apply" button
   - If influencer with profile: Show "Apply" button
6. If eligible influencer, user clicks "Apply" button
7. System navigates to application page

## Edge Cases

### Campaign Not Found
- **Invalid campaign ID**: Show 404 error page with navigation options
- **Campaign deleted**: Show "Campaign no longer available" message

### Campaign Status
- **Recruitment closed**: Hide apply button, show "Recruitment closed" status
- **Selection completed**: Show "Selection completed" status
- **Recruitment ended (date passed)**: Show "Recruitment period ended"

### User Already Applied
- **Duplicate application check**: Show "Already applied" with view application button
- **Navigate to application status**: Link to "My Applications" page

### Access Control
- **Anonymous user**: Show "Login required" message with login button
- **Advertiser viewing**: Show full details but no apply option
- **Influencer without profile**: Show prompt to complete profile first

### Loading/Error States
- **Campaign data loading**: Show skeleton loader
- **Network error**: Show retry button
- **Image loading failure**: Use placeholder images

## Business Rules
- All users can view campaign details (public access)
- Only influencers with completed profiles can apply
- Advertiser users cannot apply to campaigns
- Users can only submit one application per campaign
- Apply button is hidden if:
  - User already applied
  - Campaign status is not 'recruiting'
  - Recruitment end date has passed
  - User is not an influencer
  - Influencer profile is incomplete
- Store information is always visible
- Contact information is displayed for all users

## Sequence Diagram

```plantuml
@startuml
actor User
participant FE
participant BE
participant Database

User -> FE: Click campaign card
FE -> User: Navigate to /campaigns/{id}

FE -> BE: GET /api/campaigns/{id}

BE -> Database: SELECT campaigns\nWHERE id={id}
Database -> BE: Return campaign data

alt Campaign not found
  BE -> FE: 404 Not Found
  FE -> User: Show error page
else Campaign found
  BE -> FE: 200 OK\n{campaign details}
  
  FE -> FE: Render campaign details
  FE -> User: Display campaign information
  
  alt User is authenticated
    FE -> BE: GET /api/user/profile
    BE -> Database: SELECT user_profiles, influencer_profiles\nWHERE user_id={current_user}
    Database -> BE: Return user data
    BE -> FE: 200 OK\n{role, profile_complete}
    
    alt User is influencer
      FE -> BE: GET /api/campaigns/{id}/my-application
      BE -> Database: SELECT applications\nWHERE campaign_id={id}\nAND influencer_id={current_user}
      Database -> BE: Return application or null
      BE -> FE: 200 OK\n{application or null}
      
      alt Already applied
        FE -> User: Show "Already applied" badge
      else Profile complete and not applied
        FE -> User: Show "Apply" button (enabled)
      else Profile incomplete
        FE -> User: Show "Complete profile" button
      end
    else User is advertiser
      FE -> User: Hide apply button
    end
  else User is anonymous
    FE -> User: Show "Login to apply" button
  end
end

User -> FE: Click "Apply" button
FE -> User: Navigate to application page

@enduml
```

