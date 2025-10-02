export const CAMPAIGN_CATEGORIES = [
  'all',
  'cafe',
  'restaurant', 
  'electronics',
  'beauty',
  'app',
  'fashion',
  'health',
  'education',
  'entertainment',
  'other'
] as const;

export type CampaignCategory = typeof CAMPAIGN_CATEGORIES[number];

export const CATEGORY_LABELS: Record<CampaignCategory, string> = {
  all: '전체',
  cafe: '카페',
  restaurant: '맛집',
  electronics: '전자',
  beauty: '뷰티',
  app: '앱',
  fashion: '패션',
  health: '헬스',
  education: '교육',
  entertainment: '엔터테인먼트',
  other: '기타',
};

export const CATEGORY_COLORS: Record<CampaignCategory, string> = {
  all: 'bg-slate-900 text-white',
  cafe: 'bg-amber-100 text-amber-800',
  restaurant: 'bg-orange-100 text-orange-800',
  electronics: 'bg-blue-100 text-blue-800',
  beauty: 'bg-pink-100 text-pink-800',
  app: 'bg-purple-100 text-purple-800',
  fashion: 'bg-rose-100 text-rose-800',
  health: 'bg-green-100 text-green-800',
  education: 'bg-indigo-100 text-indigo-800',
  entertainment: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-100 text-gray-800',
};
