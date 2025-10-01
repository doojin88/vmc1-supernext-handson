'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Eye, MessageSquare } from 'lucide-react';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from '../types';
import type { Application } from '../lib/dto';

type ApplicationCardProps = {
  application: Application;
  onViewDetails: (applicationId: string) => void;
};

export const ApplicationCard = ({ application, onViewDetails }: ApplicationCardProps) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className={`${getStatusColor(application.status)} flex items-center gap-1`}
            >
              {getStatusIcon(application.status)}
              {APPLICATION_STATUS_LABELS[application.status as keyof typeof APPLICATION_STATUS_LABELS]}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {application.campaignTitle}
          </h3>
          <p className="text-sm text-slate-600">
            신청일: {formatDate(application.submittedAt)}
          </p>
          {application.reviewedAt && (
            <p className="text-sm text-slate-600">
              심사완료: {formatDate(application.reviewedAt)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-1">지원 동기</h4>
          <p className="text-sm text-slate-600 line-clamp-2">
            {application.motivation}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-1">관련 경험</h4>
          <p className="text-sm text-slate-600 line-clamp-2">
            {application.experience}
          </p>
        </div>

        {application.feedback && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              피드백
            </h4>
            <p className="text-sm text-slate-600 line-clamp-2">
              {application.feedback}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          {application.status === 'pending' && '심사 중입니다'}
          {application.status === 'approved' && '승인되었습니다!'}
          {application.status === 'rejected' && '거절되었습니다'}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(application.id)}
        >
          <Eye className="h-4 w-4 mr-2" />
          자세히 보기
        </Button>
      </div>
    </Card>
  );
};
