'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Users, Building2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useCampaignQuery } from '@/features/campaign/hooks/useCampaignQuery';
import { CAMPAIGN_STATUS_LABELS, CAMPAIGN_STATUS_COLORS } from '@/features/campaign/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const { data: campaign, isLoading, error } = useCampaignQuery(campaignId);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy년 MM월 dd일 (EEE)', { locale: ko });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            캠페인을 찾을 수 없습니다
          </h2>
          <p className="text-slate-600 mb-6">
            요청하신 캠페인이 존재하지 않거나 삭제되었습니다.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            이전 페이지로
          </Button>
        </Card>
      </div>
    );
  }

  const isApplicationOpen = new Date(campaign.recruitmentEndDate) > new Date();
  const isFull = campaign.status === 'recruitment_closed' || campaign.status === 'selection_completed';
  const canApply = isApplicationOpen && !isFull;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로 돌아가기
        </Button>

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                className={`${CAMPAIGN_STATUS_COLORS[campaign.status]} flex items-center gap-1`}
              >
                {CAMPAIGN_STATUS_LABELS[campaign.status]}
              </Badge>
              {!canApply && (
                <Badge variant="secondary">
                  {isFull ? '모집완료' : '마감'}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{campaign.advertiserName}</span>
                <span className="text-slate-400">•</span>
                <span>{campaign.advertiserBusinessType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              캠페인 소개
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {campaign.description}
              </p>
            </div>
          </Card>

          {/* Mission */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              미션
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {campaign.mission}
              </p>
            </div>
          </Card>

          {/* Store Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              매장 정보
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-slate-900">매장명:</span>
                <span className="ml-2 text-slate-700">{campaign.storeName}</span>
              </div>
              <div>
                <span className="font-medium text-slate-900">주소:</span>
                <span className="ml-2 text-slate-700">{campaign.storeAddress}</span>
              </div>
              {campaign.storePhone && (
                <div>
                  <span className="font-medium text-slate-900">전화번호:</span>
                  <span className="ml-2 text-slate-700">{campaign.storePhone}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              신청 현황
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">모집 인원</span>
                <span className="font-medium">
                  {campaign.recruitmentCount}명
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {canApply ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-700">신청 가능</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-700">
                      {isFull ? '모집 완료' : '신청 마감'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Important Dates */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              일정 안내
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    신청 마감
                  </p>
                  <p className="text-sm text-slate-600">
                    {formatDate(campaign.recruitmentEndDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    모집 기간
                  </p>
                  <p className="text-sm text-slate-600">
                    {formatDate(campaign.recruitmentStartDate)} ~ {formatDate(campaign.recruitmentEndDate)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Benefits */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              혜택 안내
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {campaign.benefits}
            </p>
          </Card>

          {/* Action Button */}
          <div className="sticky top-6">
            <Button
              size="lg"
              className="w-full"
              disabled={!canApply}
              onClick={() => {
                router.push(`/campaigns/${campaign.id}/apply`);
              }}
            >
              {canApply ? '체험단 신청하기' : isFull ? '모집 완료' : '신청 마감'}
            </Button>
            {!canApply && (
              <p className="text-xs text-slate-500 text-center mt-2">
                {isFull ? '모집 인원이 마감되었습니다' : '신청 기간이 종료되었습니다'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
