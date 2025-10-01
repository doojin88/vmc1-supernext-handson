export const authErrorCodes = {
  emailExists: 'EMAIL_EXISTS',
  invalidCredentials: 'INVALID_CREDENTIALS',
  weakPassword: 'WEAK_PASSWORD',
  invalidPhone: 'INVALID_PHONE',
  termsNotAgreed: 'TERMS_NOT_AGREED',
  authServiceError: 'AUTH_SERVICE_ERROR',
  profileCreationFailed: 'PROFILE_CREATION_FAILED',
  validationError: 'VALIDATION_ERROR',
} as const;

export type AuthServiceError =
  (typeof authErrorCodes)[keyof typeof authErrorCodes];

