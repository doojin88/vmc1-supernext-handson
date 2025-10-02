export type CampaignStatus = 'recruiting' | 'closed';

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  recruiting: '모집중',
  closed: '마감',
};

export const CAMPAIGN_STATUS_COLORS: Record<CampaignStatus, string> = {
  recruiting: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};
