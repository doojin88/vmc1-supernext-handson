'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCreateProfileMutation } from '@/features/advertiser/hooks/useCreateProfileMutation';
import { BUSINESS_TYPE_LABELS, BUSINESS_TYPE_DESCRIPTIONS } from '@/features/advertiser/types';
import type { BusinessType } from '@/features/advertiser/types';

export default function AdvertiserOnboardingPage() {
  const router = useRouter();
  const createProfileMutation = useCreateProfileMutation();
  const [formData, setFormData] = useState({
    companyName: '',
    businessNumber: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    businessType: '' as BusinessType | '',
    companyDescription: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const formatBusinessNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleBusinessNumberChange = (value: string) => {
    const formatted = formatBusinessNumber(value);
    handleInputChange('businessNumber', formatted);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('contactPhone', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.businessType) {
      setErrorMessage('업종을 선택해주세요');
      return;
    }

    try {
      await createProfileMutation.mutateAsync({
        ...formData,
        businessType: formData.businessType as BusinessType,
      });

      router.push('/');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '프로필 생성 중 문제가 발생했습니다';
      setErrorMessage(message);
    }
  };

  const isSubmitDisabled =
    !formData.companyName ||
    !formData.businessNumber ||
    !formData.contactName ||
    !formData.contactPhone ||
    !formData.contactEmail ||
    !formData.businessType ||
    !formData.companyDescription ||
    createProfileMutation.isPending;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-10 px-6 py-16">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-semibold">광고주 프로필 등록</h1>
        <p className="text-slate-500">
          회사 정보를 등록하고 체험단을 운영해보세요.
        </p>
      </header>

      <div className="grid w-full gap-8 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              회사명 *
            </label>
            <Input
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="회사명을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              사업자등록번호 *
            </label>
            <Input
              value={formData.businessNumber}
              onChange={(e) => handleBusinessNumberChange(e.target.value)}
              placeholder="000-00-00000"
              maxLength={12}
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              사업자등록증에 기재된 번호를 정확히 입력해주세요
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              담당자명 *
            </label>
            <Input
              value={formData.contactName}
              onChange={(e) => handleInputChange('contactName', e.target.value)}
              placeholder="담당자명을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              연락처 *
            </label>
            <Input
              value={formData.contactPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="010-0000-0000"
              maxLength={13}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              이메일 *
            </label>
            <Input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="contact@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              업종 *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(BUSINESS_TYPE_LABELS).map(([key, label]) => (
                <Card
                  key={key}
                  className={`p-4 cursor-pointer transition-colors ${
                    formData.businessType === key
                      ? 'border-slate-500 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => handleInputChange('businessType', key)}
                >
                  <div className="text-sm font-medium text-slate-900">
                    {label}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {BUSINESS_TYPE_DESCRIPTIONS[key as BusinessType]}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              회사 소개 *
            </label>
            <Textarea
              value={formData.companyDescription}
              onChange={(e) => handleInputChange('companyDescription', e.target.value)}
              placeholder="회사에 대해 간단히 소개해주세요 (최소 10자 이상)"
              rows={4}
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              {formData.companyDescription.length}/1000자
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              이전
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="flex-1"
            >
              {createProfileMutation.isPending ? '등록 중...' : '프로필 등록'}
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 p-6">
            <h3 className="font-medium text-slate-900 mb-4">등록 가이드</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>사업자등록증에 기재된 정보를 정확히 입력해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>사업자등록번호는 자동으로 검증됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>담당자 정보는 체험단 운영 시 연락용으로 사용됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>회사 소개는 인플루언서들이 참고하는 정보입니다</span>
              </li>
            </ul>
          </div>

          <figure className="overflow-hidden rounded-xl border border-slate-200">
            <Image
              src="https://picsum.photos/seed/advertiser/640/480"
              alt="광고주"
              width={640}
              height={480}
              className="h-full w-full object-cover"
              priority
            />
          </figure>
        </div>
      </div>
    </div>
  );
}
