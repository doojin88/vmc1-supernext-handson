export const campaignErrorCodes = {
  campaignsNotFound: 'CAMPAIGNS_NOT_FOUND',
  campaignNotFound: 'CAMPAIGN_NOT_FOUND',
  invalidPagination: 'INVALID_PAGINATION',
  invalidCategory: 'INVALID_CATEGORY',
  invalidCampaignId: 'INVALID_CAMPAIGN_ID',
  databaseError: 'DATABASE_ERROR',
} as const;

export type CampaignServiceError =
  (typeof campaignErrorCodes)[keyof typeof campaignErrorCodes];
