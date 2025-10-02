'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Building2 } from 'lucide-react';
import type { Campaign } from '../lib/dto';
import { CAMPAIGN_STATUS_LABELS, CAMPAIGN_STATUS_COLORS } from '../types';

type CampaignCardProps = {
  campaign: Campaign;
  onViewDetails: (campaignId: string) => void;
};

export const CampaignCard = ({ campaign, onViewDetails }: CampaignCardProps) => {
  const isApplicationOpen = new Date(campaign.recruitmentEndDate) > new Date();
  const canApply = isApplicationOpen && campaign.status === 'recruiting';

  // Determine the actual status to display
  const getDisplayStatus = () => {
    if (campaign.status === 'closed') {
      return { label: '마감', color: 'bg-gray-100 text-gray-800' };
    }
    if (!isApplicationOpen) {
      return { label: '마감', color: 'bg-gray-100 text-gray-800' };
    }
    return { label: '모집중', color: 'bg-green-100 text-green-800' };
  };

  const displayStatus = getDisplayStatus();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd (EEE)', { locale: ko });
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${displayStatus.color} flex items-center gap-1`}>
              {displayStatus.label}
            </Badge>
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
          <span>모집마감: {formatDate(campaign.recruitmentEndDate)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users className="h-4 w-4" />
          <span>
            모집인원: {campaign.recruitmentCount}명
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          <span>혜택: {campaign.benefits}</span>
        </div>
        <Button
          variant={canApply ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewDetails(campaign.id)}
          disabled={!canApply}
        >
          {canApply ? '자세히 보기' : displayStatus.label}
        </Button>
      </div>
    </Card>
  );
};
