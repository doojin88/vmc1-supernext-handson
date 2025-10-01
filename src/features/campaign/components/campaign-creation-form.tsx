'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateCampaignMutation } from '../hooks/useCreateCampaignMutation';
import { CAMPAIGN_CATEGORY_LABELS, CAMPAIGN_CATEGORY_ICONS } from '../types';
import type { CreateCampaignRequest, CampaignCategory } from '../lib/dto';

type CampaignCreationFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export const CampaignCreationForm = ({
  onSuccess,
  onCancel,
}: CampaignCreationFormProps) => {
  const createCampaignMutation = useCreateCampaignMutation();
  const [formData, setFormData] = useState<CreateCampaignRequest>({
    title: '',
    description: '',
    category: 'food',
    targetAudience: '',
    requirements: '',
    compensation: '',
    applicationDeadline: '',
    campaignStartDate: '',
    campaignEndDate: '',
    maxParticipants: 10,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CreateCampaignRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCampaignMutation.mutateAsync(formData);
      onSuccess();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const isSubmitDisabled = createCampaignMutation.isPending;

  const categories: CampaignCategory[] = ['food', 'beauty', 'fashion', 'tech', 'lifestyle', 'other'];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          새 캠페인 생성
        </h2>
        <p className="text-slate-600">
          체험단 캠페인 정보를 입력해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-slate-700">
            캠페인 제목 *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="캠페인 제목을 입력하세요"
            className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category" className="text-sm font-medium text-slate-700">
            카테고리 *
          </Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value as CampaignCategory)}
            className="w-full mt-1 rounded-md border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {CAMPAIGN_CATEGORY_ICONS[category]} {CAMPAIGN_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium text-slate-700">
            캠페인 설명 *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="캠페인에 대해 자세히 설명해주세요"
            rows={4}
            className={`mt-1 ${errors.description ? 'border-red-500' : ''}`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
            <p className="text-xs text-slate-500 ml-auto">
              {formData.description.length}/2000자
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="targetAudience" className="text-sm font-medium text-slate-700">
            대상 고객 *
          </Label>
          <Textarea
            id="targetAudience"
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            placeholder="타겟 고객층을 설명해주세요"
            rows={3}
            className={`mt-1 ${errors.targetAudience ? 'border-red-500' : ''}`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.targetAudience && (
              <p className="text-sm text-red-500">{errors.targetAudience}</p>
            )}
            <p className="text-xs text-slate-500 ml-auto">
              {formData.targetAudience.length}/500자
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="requirements" className="text-sm font-medium text-slate-700">
            참여 조건 *
          </Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => handleInputChange('requirements', e.target.value)}
            placeholder="인플루언서가 충족해야 할 조건을 입력해주세요"
            rows={3}
            className={`mt-1 ${errors.requirements ? 'border-red-500' : ''}`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.requirements && (
              <p className="text-sm text-red-500">{errors.requirements}</p>
            )}
            <p className="text-xs text-slate-500 ml-auto">
              {formData.requirements.length}/1000자
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="compensation" className="text-sm font-medium text-slate-700">
            보상 *
          </Label>
          <Input
            id="compensation"
            value={formData.compensation}
            onChange={(e) => handleInputChange('compensation', e.target.value)}
            placeholder="제공할 보상을 입력하세요 (예: 제품 무료 제공, 현금 지급 등)"
            className={`mt-1 ${errors.compensation ? 'border-red-500' : ''}`}
          />
          {errors.compensation && (
            <p className="text-sm text-red-500 mt-1">{errors.compensation}</p>
          )}
        </div>

        <div>
          <Label htmlFor="maxParticipants" className="text-sm font-medium text-slate-700">
            모집 인원 *
          </Label>
          <Input
            id="maxParticipants"
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => handleInputChange('maxParticipants', Number(e.target.value))}
            min="1"
            max="1000"
            className={`mt-1 ${errors.maxParticipants ? 'border-red-500' : ''}`}
          />
          {errors.maxParticipants && (
            <p className="text-sm text-red-500 mt-1">{errors.maxParticipants}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="applicationDeadline" className="text-sm font-medium text-slate-700">
              신청 마감일 *
            </Label>
            <Input
              id="applicationDeadline"
              type="datetime-local"
              value={formData.applicationDeadline}
              onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
              className={`mt-1 ${errors.applicationDeadline ? 'border-red-500' : ''}`}
            />
            {errors.applicationDeadline && (
              <p className="text-sm text-red-500 mt-1">{errors.applicationDeadline}</p>
            )}
          </div>

          <div>
            <Label htmlFor="campaignStartDate" className="text-sm font-medium text-slate-700">
              캠페인 시작일 *
            </Label>
            <Input
              id="campaignStartDate"
              type="datetime-local"
              value={formData.campaignStartDate}
              onChange={(e) => handleInputChange('campaignStartDate', e.target.value)}
              className={`mt-1 ${errors.campaignStartDate ? 'border-red-500' : ''}`}
            />
            {errors.campaignStartDate && (
              <p className="text-sm text-red-500 mt-1">{errors.campaignStartDate}</p>
            )}
          </div>

          <div>
            <Label htmlFor="campaignEndDate" className="text-sm font-medium text-slate-700">
              캠페인 종료일 *
            </Label>
            <Input
              id="campaignEndDate"
              type="datetime-local"
              value={formData.campaignEndDate}
              onChange={(e) => handleInputChange('campaignEndDate', e.target.value)}
              className={`mt-1 ${errors.campaignEndDate ? 'border-red-500' : ''}`}
            />
            {errors.campaignEndDate && (
              <p className="text-sm text-red-500 mt-1">{errors.campaignEndDate}</p>
            )}
          </div>
        </div>

        {createCampaignMutation.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              {createCampaignMutation.error.message}
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
            {createCampaignMutation.isPending ? '생성 중...' : '캠페인 생성'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
