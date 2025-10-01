export const applicationErrorCodes = {
  applicationCreationFailed: 'APPLICATION_CREATION_FAILED',
  applicationNotFound: 'APPLICATION_NOT_FOUND',
  campaignNotFound: 'CAMPAIGN_NOT_FOUND',
  applicationClosed: 'APPLICATION_CLOSED',
  duplicateApplication: 'DUPLICATE_APPLICATION',
  invalidApplicationData: 'INVALID_APPLICATION_DATA',
  validationError: 'VALIDATION_ERROR',
  databaseError: 'DATABASE_ERROR',
} as const;

export type ApplicationServiceError =
  (typeof applicationErrorCodes)[keyof typeof applicationErrorCodes];
