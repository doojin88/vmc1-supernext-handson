import { z } from 'zod';

export const CampaignStatusSchema = z.enum(['recruiting', 'recruitment_closed', 'selection_completed']);
export type CampaignStatus = z.infer<typeof CampaignStatusSchema>;

export const ListCampaignsRequestSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
  status: z.enum(['recruiting', 'recruitment_closed', 'selection_completed']).optional(),
  search: z.string().optional(),
});

export type ListCampaignsRequest = z.infer<typeof ListCampaignsRequestSchema>;

export const CampaignSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  recruitmentStartDate: z.string(),
  recruitmentEndDate: z.string(),
  recruitmentCount: z.number().int().min(1),
  benefits: z.string(),
  mission: z.string(),
  storeName: z.string(),
  storeAddress: z.string(),
  storePhone: z.string().nullable(),
  status: CampaignStatusSchema,
  advertiserName: z.string(),
  advertiserBusinessType: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Campaign = z.infer<typeof CampaignSchema>;

export const ListCampaignsResponseSchema = z.object({
  campaigns: z.array(CampaignSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

export type ListCampaignsResponse = z.infer<typeof ListCampaignsResponseSchema>;

export const GetCampaignRequestSchema = z.object({
  id: z.string().uuid(),
});

export type GetCampaignRequest = z.infer<typeof GetCampaignRequestSchema>;

export const GetCampaignResponseSchema = CampaignSchema;

export type GetCampaignResponse = z.infer<typeof GetCampaignResponseSchema>;

export const CreateCampaignRequestSchema = z.object({
  title: z.string().min(1, '캠페인 제목을 입력해주세요').max(100),
  description: z.string().max(2000).optional(),
  recruitmentStartDate: z.string(),
  recruitmentEndDate: z.string(),
  recruitmentCount: z.number().int().min(1, '최소 1명 이상이어야 합니다').max(1000),
  benefits: z.string().min(1, '혜택을 입력해주세요').max(1000),
  mission: z.string().min(1, '미션을 입력해주세요').max(1000),
  storeName: z.string().min(1, '매장명을 입력해주세요').max(100),
  storeAddress: z.string().min(1, '매장 주소를 입력해주세요').max(200),
  storePhone: z.string().max(20).optional(),
}).refine(
  (data) => new Date(data.recruitmentStartDate) <= new Date(data.recruitmentEndDate),
  {
    message: '모집 시작일은 모집 마감일보다 이르거나 같아야 합니다',
    path: ['recruitmentStartDate'],
  }
);

export type CreateCampaignRequest = z.infer<typeof CreateCampaignRequestSchema>;

export const CreateCampaignResponseSchema = z.object({
  campaignId: z.string().uuid(),
  status: CampaignStatusSchema,
});

export type CreateCampaignResponse = z.infer<typeof CreateCampaignResponseSchema>;

export const ListAdvertiserCampaignsRequestSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
  status: CampaignStatusSchema.optional(),
});

export type ListAdvertiserCampaignsRequest = z.infer<typeof ListAdvertiserCampaignsRequestSchema>;

export const ListAdvertiserCampaignsResponseSchema = z.object({
  campaigns: z.array(CampaignSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

export type ListAdvertiserCampaignsResponse = z.infer<typeof ListAdvertiserCampaignsResponseSchema>;