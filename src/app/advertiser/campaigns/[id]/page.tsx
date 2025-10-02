'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Users, Calendar, Building2, Filter } from 'lucide-react';
import { useCampaignQuery } from '@/features/campaign/hooks/useCampaignQuery';
import { useCampaignApplicationsQuery } from '@/features/application/hooks/useCampaignApplicationsQuery';
import { ApplicationReviewCard } from '@/features/application/components/application-review-card';
import { APPLICATION_STATUS_LABELS } from '@/features/application/types';
import type { ApplicationStatus } from '@/features/application/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function AdvertiserCampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: campaign, isLoading: campaignLoading, error: campaignError } = useCampaignQuery(campaignId);
  const { data: applicationsData, isLoading: applicationsLoading, error: applicationsError } = useCampaignApplicationsQuery({
    campaignId,
    page: currentPage,
    limit: 10,
    status: statusFilter || undefined,
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy년 MM월 dd일 (EEE)', { locale: ko });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
  };

  if (campaignLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (campaignError || !campaign) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Card className="p-12 text-center">
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

  const statusCounts = {
    pending: applicationsData?.applications.filter(app => app.status === 'pending').length || 0,
    approved: applicationsData?.applications.filter(app => app.status === 'approved').length || 0,
    rejected: applicationsData?.applications.filter(app => app.status === 'rejected').length || 0,
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{campaign.advertiserName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{campaign.recruitmentCount}명</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              캠페인 정보
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700">신청 마감</p>
                <p className="text-sm text-slate-600">
                  {formatDate(campaign.recruitmentEndDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">캠페인 기간</p>
                <p className="text-sm text-slate-600">
                  {formatDate(campaign.recruitmentStartDate)} ~ {formatDate(campaign.recruitmentEndDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">보상</p>
                <p className="text-sm text-slate-600">{campaign.benefits}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              신청 현황
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">심사 중</span>
                <Badge variant="secondary">{statusCounts.pending}건</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">승인됨</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {statusCounts.approved}건
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">거절됨</span>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {statusCounts.rejected}건
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              신청자 목록
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={statusFilter || ''}
                onChange={(e) => {
                  setStatusFilter(e.target.value as ApplicationStatus || null);
                  setCurrentPage(1);
                }}
                className="text-sm border border-slate-300 rounded-md px-3 py-1"
              >
                <option value="">전체</option>
                <option value="pending">심사 중</option>
                <option value="approved">승인됨</option>
                <option value="rejected">거절됨</option>
              </select>
            </div>
          </div>

          {applicationsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </Card>
              ))}
            </div>
          ) : applicationsError ? (
            <Card className="p-12 text-center">
              <p className="text-slate-600">신청 목록을 불러오는데 실패했습니다.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                다시 시도
              </Button>
            </Card>
          ) : applicationsData?.applications.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                신청이 없습니다
              </h3>
              <p className="text-slate-600">
                {statusFilter 
                  ? `${APPLICATION_STATUS_LABELS[statusFilter]} 상태의 신청이 없습니다.`
                  : '아직 신청자가 없습니다.'
                }
              </p>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {applicationsData?.applications.map((application) => (
                  <ApplicationReviewCard
                    key={application.id}
                    application={application as any}
                  />
                ))}
              </div>

              {/* Pagination */}
              {applicationsData && applicationsData.pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      이전
                    </Button>
                    <span className="text-sm text-slate-600">
                      {currentPage} / {applicationsData.pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === applicationsData.pagination.totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      다음
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
