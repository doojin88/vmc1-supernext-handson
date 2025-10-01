export const campaignErrorCodes = {
  campaignsNotFound: 'CAMPAIGNS_NOT_FOUND',
  invalidPagination: 'INVALID_PAGINATION',
  invalidCategory: 'INVALID_CATEGORY',
  databaseError: 'DATABASE_ERROR',
} as const;

export type CampaignServiceError =
  (typeof campaignErrorCodes)[keyof typeof campaignErrorCodes];
