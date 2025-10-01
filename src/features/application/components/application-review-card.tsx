'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Clock, User, Mail } from 'lucide-react';
import { useUpdateApplicationStatusMutation } from '../hooks/useUpdateApplicationStatusMutation';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from '../types';
import type { Application } from '../lib/dto';

type ApplicationReviewCardProps = {
  application: Application & {
    applicantName: string;
    applicantEmail: string;
  };
};

export const ApplicationReviewCard = ({ application }: ApplicationReviewCardProps) => {
  const updateStatusMutation = useUpdateApplicationStatusMutation();
  const [selectedStatus, setSelectedStatus] = useState<'approved' | 'rejected' | null>(null);
  const [feedback, setFeedback] = useState('');

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
  };

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    try {
      await updateStatusMutation.mutateAsync({
        applicationId: application.id,
        status,
        feedback: feedback.trim() || undefined,
      });
      setSelectedStatus(null);
      setFeedback('');
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const isPending = application.status === 'pending';
  const isApproved = application.status === 'approved';
  const isRejected = application.status === 'rejected';

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className={`${APPLICATION_STATUS_COLORS[application.status]} flex items-center gap-1`}
            >
              {application.status === 'pending' && <Clock className="h-3 w-3" />}
              {application.status === 'approved' && <CheckCircle className="h-3 w-3" />}
              {application.status === 'rejected' && <XCircle className="h-3 w-3" />}
              {APPLICATION_STATUS_LABELS[application.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{application.applicantName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{application.applicantEmail}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            신청일: {formatDate(application.submittedAt)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">지원 동기</h4>
          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
            {application.motivation}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">관련 경험</h4>
          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
            {application.experience}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">기대 효과</h4>
          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
            {application.expectedOutcome}
          </p>
        </div>

        {application.feedback && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">피드백</h4>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
              {application.feedback}
            </p>
          </div>
        )}
      </div>

      {isPending && (
        <>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback" className="text-sm font-medium text-slate-700">
                피드백 (선택사항)
              </Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="신청자에게 전달할 피드백을 입력하세요"
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('rejected')}
                disabled={updateStatusMutation.isPending}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                거절
              </Button>
              <Button
                onClick={() => handleStatusUpdate('approved')}
                disabled={updateStatusMutation.isPending}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                승인
              </Button>
            </div>
          </div>
        </>
      )}

      {updateStatusMutation.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            {updateStatusMutation.error.message}
          </p>
        </div>
      )}
    </Card>
  );
};
