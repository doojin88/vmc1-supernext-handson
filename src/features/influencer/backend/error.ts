export const influencerErrorCodes = {
  profileCreationFailed: 'PROFILE_CREATION_FAILED',
  channelCreationFailed: 'CHANNEL_CREATION_FAILED',
  ageRequirementNotMet: 'AGE_REQUIREMENT_NOT_MET',
  invalidChannelUrl: 'INVALID_CHANNEL_URL',
  duplicateChannel: 'DUPLICATE_CHANNEL',
  validationError: 'VALIDATION_ERROR',
} as const;

export type InfluencerServiceError =
  (typeof influencerErrorCodes)[keyof typeof influencerErrorCodes];
