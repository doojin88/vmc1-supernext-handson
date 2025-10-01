import { z } from 'zod';

export const ApplicationStatusSchema = z.enum(['pending', 'approved', 'rejected', 'withdrawn']);
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

export const CreateApplicationRequestSchema = z.object({
  campaignId: z.string().uuid(),
  motivation: z.string().min(10, '지원 동기는 최소 10자 이상 입력해주세요').max(1000),
  experience: z.string().min(10, '관련 경험은 최소 10자 이상 입력해주세요').max(1000),
  expectedOutcome: z.string().min(10, '기대 효과는 최소 10자 이상 입력해주세요').max(1000),
});

export type CreateApplicationRequest = z.infer<typeof CreateApplicationRequestSchema>;

export const CreateApplicationResponseSchema = z.object({
  applicationId: z.string().uuid(),
  status: ApplicationStatusSchema,
  submittedAt: z.string().datetime(),
});

export type CreateApplicationResponse = z.infer<typeof CreateApplicationResponseSchema>;

export const ApplicationSchema = z.object({
  id: z.string().uuid(),
  campaignId: z.string().uuid(),
  campaignTitle: z.string(),
  motivation: z.string(),
  experience: z.string(),
  expectedOutcome: z.string(),
  status: ApplicationStatusSchema,
  submittedAt: z.string().datetime(),
  reviewedAt: z.string().datetime().nullable(),
  feedback: z.string().nullable(),
});

export type Application = z.infer<typeof ApplicationSchema>;

export const ListApplicationsRequestSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
  status: ApplicationStatusSchema.optional(),
});

export type ListApplicationsRequest = z.infer<typeof ListApplicationsRequestSchema>;

export const ListApplicationsResponseSchema = z.object({
  applications: z.array(ApplicationSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

export type ListApplicationsResponse = z.infer<typeof ListApplicationsResponseSchema>;
