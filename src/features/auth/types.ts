export type UserRole = 'influencer' | 'advertiser';

export const ROLE_LABELS: Record<UserRole, string> = {
  influencer: '인플루언서',
  advertiser: '광고주',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  influencer: '다양한 체험단에 참여하고 리뷰를 작성합니다',
  advertiser: '체험단을 등록하고 인플루언서를 모집합니다',
};

export type CurrentUserSnapshot = {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  user: {
    id: string;
    email: string | null;
    appMetadata: Record<string, unknown>;
    userMetadata: Record<string, unknown>;
  } | null;
};

export type CurrentUserContextValue = {
  status: CurrentUserSnapshot['status'];
  user: CurrentUserSnapshot['user'];
  isAuthenticated: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
};
