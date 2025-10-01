'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Eye, Edit, BarChart3 } from 'lucide-react';
import { useAdvertiserCampaignsQuery } from '@/features/campaign/hooks/useAdvertiserCampaignsQuery';
import { CampaignCreationForm } from '@/features/campaign/components/campaign-creation-form';
import { CAMPAIGN_STATUS_LABELS, CAMPAIGN_CATEGORY_LABELS, CAMPAIGN_CATEGORY_ICONS } from '@/features/campaign/types';
import type { CampaignStatus } from '@/features/campaign/types';

export default function AdvertiserCampaignsPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<CampaignStatus | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: campaignsData, isLoading, error } = useAdvertiserCampaignsQuery({
    page: currentPage,
    limit: 12,
    status: selectedStatus || undefined,
  });

  const handleViewDetails = (campaignId: string) => {
    router.push(`/advertiser/campaigns/${campaignId}`);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    // Refresh the campaigns list
    window.location.reload();
  };

  const statusCounts = {
    draft: campaignsData?.campaigns.filter(campaign => campaign.status === 'draft').length || 0,
    active: campaignsData?.campaigns.filter(campaign => campaign.status === 'active').length || 0,
    paused: campaignsData?.campaigns.filter(campaign => campaign.status === 'paused').length || 0,
    completed: campaignsData?.campaigns.filter(campaign => campaign.status === 'completed').length || 0,
    cancelled: campaignsData?.campaigns.filter(campaign => campaign.status === 'cancelled').length || 0,
  };

  if (showCreateForm) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setShowCreateForm(false)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            캠페인 목록으로
          </Button>
        </div>
        <CampaignCreationForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

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
          이전 페이지로
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              내 캠페인 관리
            </h1>
            <p className="text-slate-600">
              생성한 캠페인을 관리하고 신청자를 확인하세요.
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            새 캠페인 생성
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-700">
                  상태별 필터
                </h3>
                {selectedStatus && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStatus(null)}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    전체보기
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {(['draft', 'active', 'paused', 'completed', 'cancelled'] as CampaignStatus[]).map((status) => (
                  <div
                    key={status}
                    className={`p-2 rounded-md cursor-pointer transition-colors ${
                      selectedStatus === status ? 'bg-slate-100' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">
                        {CAMPAIGN_STATUS_LABELS[status]}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {statusCounts[status]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Status Summary */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              캠페인 현황
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">임시저장</span>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  {statusCounts.draft}건
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">진행중</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {statusCounts.active}건
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">일시정지</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {statusCounts.paused}건
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">완료</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {statusCounts.completed}건
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">취소</span>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {statusCounts.cancelled}건
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Campaigns Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="p-12 text-center">
              <p className="text-slate-600">캠페인 목록을 불러오는데 실패했습니다.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                다시 시도
              </Button>
            </Card>
          ) : campaignsData?.campaigns.length === 0 ? (
            <Card className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                캠페인이 없습니다
              </h3>
              <p className="text-slate-600 mb-6">
                {selectedStatus 
                  ? `${CAMPAIGN_STATUS_LABELS[selectedStatus]} 상태의 캠페인이 없습니다.`
                  : '아직 생성한 캠페인이 없습니다.'
                }
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                첫 캠페인 생성하기
              </Button>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaignsData?.campaigns.map((campaign) => (
                  <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={campaign.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {CAMPAIGN_STATUS_LABELS[campaign.status]}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {CAMPAIGN_CATEGORY_ICONS[campaign.category]} {CAMPAIGN_CATEGORY_LABELS[campaign.category]}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          {campaign.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {campaign.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">모집 인원</span>
                        <span className="font-medium">
                          {campaign.currentParticipants}/{campaign.maxParticipants}명
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">신청 마감</span>
                        <span className="font-medium">
                          {new Date(campaign.applicationDeadline).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(campaign.id)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        상세보기
                      </Button>
                      {campaign.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          수정
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {campaignsData && campaignsData.pagination.totalPages > 1 && (
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
                      {currentPage} / {campaignsData.pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === campaignsData.pagination.totalPages}
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
