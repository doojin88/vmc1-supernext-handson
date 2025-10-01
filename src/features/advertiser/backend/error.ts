export const advertiserErrorCodes = {
  profileCreationFailed: 'PROFILE_CREATION_FAILED',
  businessNumberValidationFailed: 'BUSINESS_NUMBER_VALIDATION_FAILED',
  duplicateBusinessNumber: 'DUPLICATE_BUSINESS_NUMBER',
  validationError: 'VALIDATION_ERROR',
} as const;

export type AdvertiserServiceError =
  (typeof advertiserErrorCodes)[keyof typeof advertiserErrorCodes];
