'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Star, Search, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCampaignsQuery } from '@/features/campaign/hooks/useCampaignsQuery';
import { CampaignCard } from '@/features/campaign/components/campaign-card';
import { CampaignFilter } from '@/features/campaign/components/campaign-filter';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { type CampaignCategory } from '@/features/campaign/constants/categories';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CampaignCategory>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated } = useCurrentUser();

  const { data: campaignsData, isLoading, error } = useCampaignsQuery({
    page: currentPage,
    limit: 12,
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
  });

  const handleViewDetails = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              체험단 플랫폼
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              인플루언서와 광고주를 연결하는 체험단 플랫폼입니다. 다양한
              제품을 체험하고 솔직한 리뷰를 작성해보세요.
            </p>
          </div>
        </div>
      </section>

      {/* Campaign Browsing Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              진행 중인 체험단
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              다양한 브랜드의 체험단에 참여해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <CampaignFilter
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
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
                    다른 검색어나 카테고리를 시도해보세요.
                  </p>
                </Card>
              ) : (
                <>
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

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              플랫폼 특징
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              체험단 플랫폼의 주요 특징을 소개합니다.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <Users className="h-5 w-5 flex-none text-slate-600" />
                  다양한 체험단
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    식품, 뷰티, 패션 등 다양한 카테고리의 체험단에 참여할 수
                    있습니다.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <TrendingUp className="h-5 w-5 flex-none text-slate-600" />
                  성장 기회
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    체험단 참여를 통해 인플루언서로서의 경험과 팔로워를 늘릴
                    수 있습니다.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <Star className="h-5 w-5 flex-none text-slate-600" />
                  신뢰할 수 있는 플랫폼
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    검증된 광고주와 투명한 프로세스로 안전하게 체험단에
                    참여할 수 있습니다.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              지금 시작하세요
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
              체험단 플랫폼에 가입하고 다양한 제품을 체험해보세요.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {!isAuthenticated ? (
                <Button asChild size="lg" variant="secondary">
                  <Link href="/signup">
                    가입하기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" variant="secondary">
                  <Link href="/dashboard">
                    대시보드로 이동
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}