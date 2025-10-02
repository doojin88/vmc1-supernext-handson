'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateCampaignMutation } from '../hooks/useCreateCampaignMutation';
import type { CreateCampaignRequest } from '../lib/dto';

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
    recruitmentStartDate: '',
    recruitmentEndDate: '',
    recruitmentCount: 10,
    benefits: '',
    mission: '',
    storeName: '',
    storeAddress: '',
    storePhone: '',
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
          <Label htmlFor="benefits" className="text-sm font-medium text-slate-700">
            혜택 *
          </Label>
          <Textarea
            id="benefits"
            value={formData.benefits}
            onChange={(e) => handleInputChange('benefits', e.target.value)}
            placeholder="인플루언서에게 제공할 혜택을 입력해주세요"
            rows={3}
            className={`mt-1 ${errors.benefits ? 'border-red-500' : ''}`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.benefits && (
              <p className="text-sm text-red-500">{errors.benefits}</p>
            )}
            <p className="text-xs text-slate-500 ml-auto">
              {formData.benefits.length}/1000자
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="mission" className="text-sm font-medium text-slate-700">
            미션 *
          </Label>
          <Textarea
            id="mission"
            value={formData.mission}
            onChange={(e) => handleInputChange('mission', e.target.value)}
            placeholder="인플루언서가 수행해야 할 미션을 입력해주세요"
            rows={3}
            className={`mt-1 ${errors.mission ? 'border-red-500' : ''}`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.mission && (
              <p className="text-sm text-red-500">{errors.mission}</p>
            )}
            <p className="text-xs text-slate-500 ml-auto">
              {formData.mission.length}/1000자
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="recruitmentCount" className="text-sm font-medium text-slate-700">
            모집 인원 *
          </Label>
          <Input
            id="recruitmentCount"
            type="number"
            value={formData.recruitmentCount}
            onChange={(e) => handleInputChange('recruitmentCount', Number(e.target.value))}
            min="1"
            max="1000"
            className={`mt-1 ${errors.recruitmentCount ? 'border-red-500' : ''}`}
          />
          {errors.recruitmentCount && (
            <p className="text-sm text-red-500 mt-1">{errors.recruitmentCount}</p>
          )}
        </div>

        <div>
          <Label htmlFor="storeName" className="text-sm font-medium text-slate-700">
            매장명 *
          </Label>
          <Input
            id="storeName"
            value={formData.storeName}
            onChange={(e) => handleInputChange('storeName', e.target.value)}
            placeholder="매장명을 입력하세요"
            className={`mt-1 ${errors.storeName ? 'border-red-500' : ''}`}
          />
          {errors.storeName && (
            <p className="text-sm text-red-500 mt-1">{errors.storeName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="storeAddress" className="text-sm font-medium text-slate-700">
            매장 주소 *
          </Label>
          <Input
            id="storeAddress"
            value={formData.storeAddress}
            onChange={(e) => handleInputChange('storeAddress', e.target.value)}
            placeholder="매장 주소를 입력하세요"
            className={`mt-1 ${errors.storeAddress ? 'border-red-500' : ''}`}
          />
          {errors.storeAddress && (
            <p className="text-sm text-red-500 mt-1">{errors.storeAddress}</p>
          )}
        </div>

        <div>
          <Label htmlFor="storePhone" className="text-sm font-medium text-slate-700">
            매장 전화번호
          </Label>
          <Input
            id="storePhone"
            value={formData.storePhone}
            onChange={(e) => handleInputChange('storePhone', e.target.value)}
            placeholder="매장 전화번호를 입력하세요 (선택사항)"
            className={`mt-1 ${errors.storePhone ? 'border-red-500' : ''}`}
          />
          {errors.storePhone && (
            <p className="text-sm text-red-500 mt-1">{errors.storePhone}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recruitmentStartDate" className="text-sm font-medium text-slate-700">
              모집 시작일 *
            </Label>
            <Input
              id="recruitmentStartDate"
              type="date"
              value={formData.recruitmentStartDate}
              onChange={(e) => handleInputChange('recruitmentStartDate', e.target.value)}
              className={`mt-1 ${errors.recruitmentStartDate ? 'border-red-500' : ''}`}
            />
            {errors.recruitmentStartDate && (
              <p className="text-sm text-red-500 mt-1">{errors.recruitmentStartDate}</p>
            )}
          </div>

          <div>
            <Label htmlFor="recruitmentEndDate" className="text-sm font-medium text-slate-700">
              모집 마감일 *
            </Label>
            <Input
              id="recruitmentEndDate"
              type="date"
              value={formData.recruitmentEndDate}
              onChange={(e) => handleInputChange('recruitmentEndDate', e.target.value)}
              className={`mt-1 ${errors.recruitmentEndDate ? 'border-red-500' : ''}`}
            />
            {errors.recruitmentEndDate && (
              <p className="text-sm text-red-500 mt-1">{errors.recruitmentEndDate}</p>
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
