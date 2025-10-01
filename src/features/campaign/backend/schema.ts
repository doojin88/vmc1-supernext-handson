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
