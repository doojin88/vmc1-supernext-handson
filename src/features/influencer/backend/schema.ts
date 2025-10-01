import { z } from 'zod';

export const ChannelSchema = z.object({
  platform: z.enum(['naver', 'youtube', 'instagram', 'threads'], {
    errorMap: () => ({ message: '지원하는 플랫폼을 선택해주세요' }),
  }),
  channelName: z.string().min(1, '채널명을 입력해주세요').max(100),
  channelUrl: z.string().url('올바른 URL 형식이 아닙니다'),
  followerCount: z.number().int().min(0).optional(),
});

export type Channel = z.infer<typeof ChannelSchema>;

export const CreateProfileRequestSchema = z.object({
  birthDate: z.string().refine(
    (date) => {
      const age = calculateAge(new Date(date));
      return age >= 18;
    },
    '만 18세 이상만 가입 가능합니다',
  ),
  channels: z
    .array(ChannelSchema)
    .min(1, '최소 1개 이상의 채널을 등록해주세요'),
});

export type CreateProfileRequest = z.infer<typeof CreateProfileRequestSchema>;

export const CreateProfileResponseSchema = z.object({
  profileId: z.string().uuid(),
  channels: z.array(
    z.object({
      id: z.string().uuid(),
      platform: z.string(),
      verificationStatus: z.string(),
    }),
  ),
});

export type CreateProfileResponse = z.infer<typeof CreateProfileResponseSchema>;

// Helper function to calculate age
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
