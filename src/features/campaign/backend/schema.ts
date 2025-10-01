import { z } from 'zod';

export const CampaignStatusSchema = z.enum(['draft', 'active', 'paused', 'completed', 'cancelled']);
export type CampaignStatus = z.infer<typeof CampaignStatusSchema>;

export const CampaignCategorySchema = z.enum(['food', 'beauty', 'fashion', 'tech', 'lifestyle', 'other']);
export type CampaignCategory = z.infer<typeof CampaignCategorySchema>;

export const ListCampaignsRequestSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
  category: CampaignCategorySchema.optional(),
  status: z.enum(['active']).optional(), // Only show active campaigns to public
  search: z.string().optional(),
});

export type ListCampaignsRequest = z.infer<typeof ListCampaignsRequestSchema>;

export const CampaignSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  category: CampaignCategorySchema,
  targetAudience: z.string(),
  requirements: z.string(),
  compensation: z.string(),
  applicationDeadline: z.string().datetime(),
  campaignStartDate: z.string().datetime(),
  campaignEndDate: z.string().datetime(),
  maxParticipants: z.number().int().min(1),
  currentParticipants: z.number().int().min(0),
  status: CampaignStatusSchema,
  advertiserName: z.string(),
  advertiserBusinessType: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
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
  description: z.string().min(10, '캠페인 설명은 최소 10자 이상 입력해주세요').max(2000),
  category: CampaignCategorySchema,
  targetAudience: z.string().min(10, '대상 고객은 최소 10자 이상 입력해주세요').max(500),
  requirements: z.string().min(10, '참여 조건은 최소 10자 이상 입력해주세요').max(1000),
  compensation: z.string().min(1, '보상을 입력해주세요').max(200),
  applicationDeadline: z.string().datetime(),
  campaignStartDate: z.string().datetime(),
  campaignEndDate: z.string().datetime(),
  maxParticipants: z.number().int().min(1, '최소 1명 이상이어야 합니다').max(1000),
}).refine(
  (data) => new Date(data.applicationDeadline) > new Date(),
  {
    message: '신청 마감일은 현재 시간보다 늦어야 합니다',
    path: ['applicationDeadline'],
  }
).refine(
  (data) => new Date(data.campaignStartDate) > new Date(data.applicationDeadline),
  {
    message: '캠페인 시작일은 신청 마감일보다 늦어야 합니다',
    path: ['campaignStartDate'],
  }
).refine(
  (data) => new Date(data.campaignEndDate) > new Date(data.campaignStartDate),
  {
    message: '캠페인 종료일은 시작일보다 늦어야 합니다',
    path: ['campaignEndDate'],
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