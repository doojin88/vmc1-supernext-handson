'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCampaignQuery } from '@/features/campaign/hooks/useCampaignQuery';
import { ApplicationForm } from '@/features/application/components/application-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function CampaignApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const { data: campaign, isLoading, error } = useCampaignQuery(campaignId);

  const handleApplicationSuccess = () => {
    router.push('/applications');
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
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
  const canApply = isApplicationOpen && campaign.status === 'recruiting';

  if (!canApply) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            신청이 불가능합니다
          </h2>
          <p className="text-slate-600 mb-6">
            {isFull 
              ? '모집 인원이 마감되었습니다.' 
              : '신청 기간이 종료되었습니다.'
            }
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            캠페인 상세로 돌아가기
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          캠페인 상세로 돌아가기
        </Button>

        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h1 className="text-2xl font-bold text-slate-900">
            체험단 신청
          </h1>
        </div>
        <p className="text-slate-600">
          신청 전에 모든 정보를 정확히 입력해주세요.
        </p>
      </div>

      <ApplicationForm
        campaignId={campaignId}
        campaignTitle={campaign.title}
        onSuccess={handleApplicationSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
