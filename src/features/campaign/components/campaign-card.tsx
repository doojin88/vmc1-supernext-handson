'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Building2 } from 'lucide-react';
import type { Campaign } from '../lib/dto';
import { CAMPAIGN_CATEGORY_LABELS, CAMPAIGN_CATEGORY_COLORS, CAMPAIGN_CATEGORY_ICONS } from '../types';

type CampaignCardProps = {
  campaign: Campaign;
  onViewDetails: (campaignId: string) => void;
};

export const CampaignCard = ({ campaign, onViewDetails }: CampaignCardProps) => {
  const isApplicationOpen = new Date(campaign.applicationDeadline) > new Date();
  const isFull = campaign.currentParticipants >= campaign.maxParticipants;
  const canApply = isApplicationOpen && !isFull;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd (EEE)', { locale: ko });
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className={`${CAMPAIGN_CATEGORY_COLORS[campaign.category]} flex items-center gap-1`}
            >
              <span>{CAMPAIGN_CATEGORY_ICONS[campaign.category]}</span>
              {CAMPAIGN_CATEGORY_LABELS[campaign.category]}
            </Badge>
            {!canApply && (
              <Badge variant="secondary">
                {isFull ? '모집완료' : '마감'}
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
            {campaign.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-3 mb-4">
            {campaign.description}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Building2 className="h-4 w-4" />
          <span>{campaign.advertiserName}</span>
          <span className="text-slate-400">•</span>
          <span>{campaign.advertiserBusinessType}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4" />
          <span>신청마감: {formatDate(campaign.applicationDeadline)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users className="h-4 w-4" />
          <span>
            {campaign.currentParticipants}/{campaign.maxParticipants}명
          </span>
          <div className="flex-1 bg-slate-200 rounded-full h-2">
            <div
              className="bg-slate-400 h-2 rounded-full"
              style={{
                width: `${(campaign.currentParticipants / campaign.maxParticipants) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          <span>보상: {campaign.compensation}</span>
        </div>
        <Button
          variant={canApply ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewDetails(campaign.id)}
          disabled={!canApply}
        >
          {canApply ? '자세히 보기' : '마감됨'}
        </Button>
      </div>
    </Card>
  );
};
