export const campaignErrorCodes = {
  campaignsNotFound: 'CAMPAIGNS_NOT_FOUND',
  campaignNotFound: 'CAMPAIGN_NOT_FOUND',
  campaignCreationFailed: 'CAMPAIGN_CREATION_FAILED',
  invalidPagination: 'INVALID_PAGINATION',
  invalidCategory: 'INVALID_CATEGORY',
  invalidCampaignId: 'INVALID_CAMPAIGN_ID',
  invalidCampaignData: 'INVALID_CAMPAIGN_DATA',
  unauthorizedAccess: 'UNAUTHORIZED_ACCESS',
  databaseError: 'DATABASE_ERROR',
} as const;

export type CampaignServiceError =
  (typeof campaignErrorCodes)[keyof typeof campaignErrorCodes];
