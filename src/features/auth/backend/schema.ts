import { z } from 'zod';

export const SignupRequestSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  fullName: z.string().min(2, '이름은 최소 2자 이상이어야 합니다').max(100),
  phoneNumber: z
    .string()
    .regex(/^01[0-9]{8,9}$/, '올바른 휴대폰 번호 형식이 아닙니다 (01012345678)'),
  role: z.enum(['influencer', 'advertiser'], {
    errorMap: () => ({ message: '역할을 선택해주세요' }),
  }),
  termsVersion: z.string().min(1, '약관 버전이 필요합니다'),
});

export type SignupRequest = z.infer<typeof SignupRequestSchema>;

export const SignupResponseSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['influencer', 'advertiser']),
  requiresEmailVerification: z.boolean(),
});

export type SignupResponse = z.infer<typeof SignupResponseSchema>;

export const UserProfileRowSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['influencer', 'advertiser']),
  full_name: z.string(),
  phone_number: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserProfileRow = z.infer<typeof UserProfileRowSchema>;

