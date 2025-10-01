'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Filter } from 'lucide-react';
import { useApplicationsQuery } from '@/features/application/hooks/useApplicationsQuery';
import { ApplicationCard } from '@/features/application/components/application-card';
import { ApplicationFilter } from '@/features/application/components/application-filter';
import { APPLICATION_STATUS_LABELS } from '@/features/application/types';
import type { ApplicationStatus } from '@/features/application/types';

export default function ApplicationsPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: applicationsData, isLoading, error } = useApplicationsQuery({
    page: currentPage,
    limit: 12,
    status: selectedStatus || undefined,
  });

  const handleViewDetails = (applicationId: string) => {
    // TODO: Navigate to application detail page
    console.log('View application details:', applicationId);
  };

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
          이전 페이지로
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              내 신청 내역
            </h1>
            <p className="text-slate-600">
              체험단 신청 현황과 결과를 확인하세요.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <ApplicationFilter
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </Card>

          {/* Status Summary */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              신청 현황
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">심사 중</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {statusCounts.pending}건
                </Badge>
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

        {/* Applications Grid */}
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
              <p className="text-slate-600">신청 내역을 불러오는데 실패했습니다.</p>
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
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                신청 내역이 없습니다
              </h3>
              <p className="text-slate-600 mb-6">
                {selectedStatus 
                  ? `${APPLICATION_STATUS_LABELS[selectedStatus]} 상태의 신청이 없습니다.`
                  : '아직 신청한 체험단이 없습니다.'
                }
              </p>
              <Button onClick={() => router.push('/')}>
                체험단 둘러보기
              </Button>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applicationsData?.applications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onViewDetails={handleViewDetails}
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
