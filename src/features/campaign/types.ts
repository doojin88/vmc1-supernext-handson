export type CampaignStatus = 'recruiting' | 'recruitment_closed' | 'selection_completed';

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  recruiting: '모집중',
  recruitment_closed: '모집마감',
  selection_completed: '선발완료',
};

export const CAMPAIGN_STATUS_COLORS: Record<CampaignStatus, string> = {
  recruiting: 'bg-green-100 text-green-800',
  recruitment_closed: 'bg-yellow-100 text-yellow-800',
  selection_completed: 'bg-blue-100 text-blue-800',
};
