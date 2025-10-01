import { z } from 'zod';

export const CreateProfileRequestSchema = z.object({
  companyName: z.string().min(1, '회사명을 입력해주세요').max(100),
  businessNumber: z.string().regex(
    /^\d{3}-\d{2}-\d{5}$/,
    '사업자등록번호는 000-00-00000 형식이어야 합니다',
  ),
  contactName: z.string().min(1, '담당자명을 입력해주세요').max(50),
  contactPhone: z.string().regex(
    /^010-\d{4}-\d{4}$/,
    '연락처는 010-0000-0000 형식이어야 합니다',
  ),
  contactEmail: z.string().email('올바른 이메일 형식이 아닙니다'),
  businessType: z.enum(['food', 'beauty', 'fashion', 'tech', 'lifestyle', 'other'], {
    errorMap: () => ({ message: '업종을 선택해주세요' }),
  }),
  companyDescription: z.string().min(10, '회사 소개는 최소 10자 이상 입력해주세요').max(1000),
});

export type CreateProfileRequest = z.infer<typeof CreateProfileRequestSchema>;

export const CreateProfileResponseSchema = z.object({
  profileId: z.string().uuid(),
  verificationStatus: z.string(),
});

export type CreateProfileResponse = z.infer<typeof CreateProfileResponseSchema>;
