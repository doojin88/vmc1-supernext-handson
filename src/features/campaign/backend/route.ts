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
import { ListCampaignsRequestSchema } from './schema';
import { listCampaigns } from './service';
import { campaignErrorCodes, type CampaignServiceError } from './error';

export const registerCampaignRoutes = (app: Hono<AppEnv>) => {
  app.get('/campaigns', async (c) => {
    const url = new URL(c.req.url);
    const params = {
      page: Number(url.searchParams.get('page')) || 1,
      limit: Number(url.searchParams.get('limit')) || 20,
      category: url.searchParams.get('category') || undefined,
      status: url.searchParams.get('status') || 'active',
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
};
