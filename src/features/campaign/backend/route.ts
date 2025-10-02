import type { Hono } from 'hono';
import {
  failure,
  respond,
  type ErrorResult,
} from '@/backend/http/response';
import {
  getLogger,
  getSupabase,
  type AppEnv,
} from '@/backend/hono/context';
import { 
  ListCampaignsRequestSchema, 
  GetCampaignRequestSchema,
  CreateCampaignRequestSchema,
  ListAdvertiserCampaignsRequestSchema,
} from './schema';
import { listCampaigns, getCampaign, createCampaign, listAdvertiserCampaigns } from './service';
import { campaignErrorCodes, type CampaignServiceError } from './error';

export const registerCampaignRoutes = (app: Hono<AppEnv>) => {
  app.get('/campaigns', async (c) => {
    const url = new URL(c.req.url);
    const params = {
      page: Number(url.searchParams.get('page')) || 1,
      limit: Number(url.searchParams.get('limit')) || 20,
      status: url.searchParams.get('status') || 'recruiting',
      search: url.searchParams.get('search') || undefined,
    };

    const parsed = ListCampaignsRequestSchema.safeParse(params);

    if (!parsed.success) {
      return respond(
        c,
        failure(
          400,
          campaignErrorCodes.invalidPagination,
          '잘못된 요청 파라미터입니다',
          parsed.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    const result = await listCampaigns(supabase, parsed.data);

    if (!result.ok) {
      const errorResult = result as ErrorResult<CampaignServiceError, unknown>;
      logger.error('Campaign listing failed', errorResult.error);
    }

    return respond(c, result);
  });

  app.get('/campaigns/:id', async (c) => {
    const id = c.req.param('id');
    const parsed = GetCampaignRequestSchema.safeParse({ id });

    if (!parsed.success) {
      return respond(
        c,
        failure(
          400,
          campaignErrorCodes.invalidCampaignId,
          '잘못된 캠페인 ID입니다',
          parsed.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    const result = await getCampaign(supabase, parsed.data);

    if (!result.ok) {
      const errorResult = result as ErrorResult<CampaignServiceError, unknown>;
      logger.error('Campaign retrieval failed', errorResult.error);
    }

    return respond(c, result);
  });

  app.post('/campaigns', async (c) => {
    const body = await c.req.json();
    const parsed = CreateCampaignRequestSchema.safeParse(body);

    if (!parsed.success) {
      return respond(
        c,
        failure(
          400,
          campaignErrorCodes.invalidCampaignData,
          '입력 데이터가 유효하지 않습니다',
          parsed.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Get advertiser user ID from auth context (would need to be added to middleware)
    const advertiserUserId = crypto.randomUUID(); // TODO: Get from auth context

    const result = await createCampaign(supabase, advertiserUserId, parsed.data);

    if (!result.ok) {
      const errorResult = result as ErrorResult<CampaignServiceError, unknown>;
      logger.error('Campaign creation failed', errorResult.error);
    }

    return respond(c, result);
  });

  app.get('/advertiser/campaigns', async (c) => {
    const url = new URL(c.req.url);
    const params = {
      page: Number(url.searchParams.get('page')) || 1,
      limit: Number(url.searchParams.get('limit')) || 20,
      status: url.searchParams.get('status') || undefined,
    };

    const parsed = ListAdvertiserCampaignsRequestSchema.safeParse(params);

    if (!parsed.success) {
      return respond(
        c,
        failure(
          400,
          campaignErrorCodes.invalidPagination,
          '잘못된 요청 파라미터입니다',
          parsed.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Get advertiser user ID from auth context (would need to be added to middleware)
    const advertiserUserId = crypto.randomUUID(); // TODO: Get from auth context

    const result = await listAdvertiserCampaigns(supabase, advertiserUserId, parsed.data);

    if (!result.ok) {
      const errorResult = result as ErrorResult<CampaignServiceError, unknown>;
      logger.error('Advertiser campaigns listing failed', errorResult.error);
    }

    return respond(c, result);
  });
};
