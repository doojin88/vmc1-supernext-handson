'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateApplicationMutation } from '../hooks/useCreateApplicationMutation';
import type { CreateApplicationRequest } from '../lib/dto';

type ApplicationFormProps = {
  campaignId: string;
  campaignTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export const ApplicationForm = ({
  campaignId,
  campaignTitle,
  onSuccess,
  onCancel,
}: ApplicationFormProps) => {
  const createApplicationMutation = useCreateApplicationMutation();
  const [formData, setFormData] = useState({
    motivation: '',
    experience: '',
    expectedOutcome: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.motivation.length < 10) {
      newErrors.motivation = '지원 동기는 최소 10자 이상 입력해주세요';
    }
    if (formData.experience.length < 10) {
      newErrors.experience = '관련 경험은 최소 10자 이상 입력해주세요';
    }
    if (formData.expectedOutcome.length < 10) {
      newErrors.expectedOutcome = '기대 효과는 최소 10자 이상 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createApplicationMutation.mutateAsync({
        campaignId,
        motivation: formData.motivation,
        experience: formData.experience,
        expectedOutcome: formData.expectedOutcome,
      });

      onSuccess();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const isSubmitDisabled =
    !formData.motivation ||
    !formData.experience ||
    !formData.expectedOutcome ||
    createApplicationMutation.isPending;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          체험단 신청
        </h2>
        <p className="text-slate-600">
          <span className="font-medium">{campaignTitle}</span>에 신청합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="motivation" className="text-sm font-medium text-slate-700">
            지원 동기 *
          </Label>
          <Textarea
            id="motivation"
            value={formData.motivation}
            onChange={(e) => handleInputChange('motivation', e.target.value)}
            placeholder="이 체험단에 지원하는 이유를 자세히 설명해주세요"
            rows={4}
            className={`mt-1 ${errors.motivation ? 'border-red-500' : ''}`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.motivation && (
              <p className="text-sm text-red-500">{errors.motivation}</p>
            )}
            <p className="text-xs text-slate-500 ml-auto">
              {formData.motivation.length}/1000자
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="experience" className="text-sm font-medium text-slate-700">
            관련 경험 *
          </Label>
          <Textarea
            id="experience"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="관련 제품이나 서비스에 대한 경험을 자세히 설명해주세요"
            rows={4}
            className={`mt-1 ${errors.experience ? 'border-red-500' : ''}`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.experience && (
              <p className="text-sm text-red-500">{errors.experience}</p>
            )}
            <p className="text-xs text-slate-500 ml-auto">
              {formData.experience.length}/1000자
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="expectedOutcome" className="text-sm font-medium text-slate-700">
            기대 효과 *
          </Label>
          <Textarea
            id="expectedOutcome"
            value={formData.expectedOutcome}
            onChange={(e) => handleInputChange('expectedOutcome', e.target.value)}
            placeholder="체험 후 어떤 결과를 기대하는지 설명해주세요"
            rows={4}
            className={`mt-1 ${errors.expectedOutcome ? 'border-red-500' : ''}`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.expectedOutcome && (
              <p className="text-sm text-red-500">{errors.expectedOutcome}</p>
            )}
            <p className="text-xs text-slate-500 ml-auto">
              {formData.expectedOutcome.length}/1000자
            </p>
          </div>
        </div>

        {createApplicationMutation.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              {createApplicationMutation.error.message}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="flex-1"
          >
            {createApplicationMutation.isPending ? '신청 중...' : '신청하기'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
