export type CampaignCategory = 'food' | 'beauty' | 'fashion' | 'tech' | 'lifestyle' | 'other';

export const CAMPAIGN_CATEGORY_LABELS: Record<CampaignCategory, string> = {
  food: '식품/음료',
  beauty: '뷰티/화장품',
  fashion: '패션/의류',
  tech: 'IT/테크',
  lifestyle: '라이프스타일',
  other: '기타',
};

export const CAMPAIGN_CATEGORY_COLORS: Record<CampaignCategory, string> = {
  food: 'bg-orange-100 text-orange-800',
  beauty: 'bg-pink-100 text-pink-800',
  fashion: 'bg-purple-100 text-purple-800',
  tech: 'bg-blue-100 text-blue-800',
  lifestyle: 'bg-green-100 text-green-800',
  other: 'bg-gray-100 text-gray-800',
};

export const CAMPAIGN_CATEGORY_ICONS: Record<CampaignCategory, string> = {
  food: '🍽️',
  beauty: '💄',
  fashion: '👗',
  tech: '💻',
  lifestyle: '🏠',
  other: '📦',
};

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  draft: '임시저장',
  active: '진행중',
  paused: '일시정지',
  completed: '완료',
  cancelled: '취소',
};
