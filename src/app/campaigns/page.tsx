'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useCampaignsQuery } from '@/features/campaign/hooks/useCampaignsQuery';
import { CampaignCard } from '@/features/campaign/components/campaign-card';
import { CampaignFilter } from '@/features/campaign/components/campaign-filter';

export default function CampaignsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: campaignsData, isLoading, error } = useCampaignsQuery({
    page: currentPage,
    limit: 12,
    search: searchQuery || undefined,
  });

  // Debug logging
  console.log('Campaigns Page Debug:', {
    isLoading,
    error: error?.message,
    errorDetails: error,
    campaignsData,
    campaignsLength: campaignsData?.campaigns?.length,
  });

  const handleViewDetails = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              체험단 둘러보기
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              다양한 브랜드의 체험단에 참여해보세요. 
              새로운 경험과 함께 특별한 혜택을 받을 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Campaign Browsing Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  필터
                </h3>
                <CampaignFilter
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </Card>
            </div>

            {/* Campaign Grid */}
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
                  <p className="text-slate-600">체험단을 불러오는데 실패했습니다.</p>
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
                  <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    체험단이 없습니다
                  </h3>
                  <p className="text-slate-600">
                    {searchQuery 
                      ? `"${searchQuery}"에 대한 검색 결과가 없습니다.`
                      : '현재 진행 중인 체험단이 없습니다.'
                    }
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setSearchQuery('')}
                    >
                      검색 초기화
                    </Button>
                  )}
                </Card>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-sm text-slate-600">
                      총 {campaignsData?.pagination.total || 0}개의 체험단이 있습니다.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {campaignsData?.campaigns.map((campaign) => (
                      <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        onViewDetails={handleViewDetails}
                      />
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
      </section>
    </div>
  );
}
