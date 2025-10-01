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
  CreateApplicationRequestSchema,
  ListApplicationsRequestSchema,
} from './schema';
import { createApplication, listApplications } from './service';
import { applicationErrorCodes, type ApplicationServiceError } from './error';

export const registerApplicationRoutes = (app: Hono<AppEnv>) => {
  app.post('/applications', async (c) => {
    const body = await c.req.json();
    const parsed = CreateApplicationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return respond(
        c,
        failure(
          400,
          applicationErrorCodes.validationError,
          '입력 데이터가 유효하지 않습니다',
          parsed.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Get user ID from auth context (would need to be added to middleware)
    const userId = 'temp-user-id'; // TODO: Get from auth context

    const result = await createApplication(supabase, userId, parsed.data);

    if (!result.ok) {
      const errorResult = result as ErrorResult<ApplicationServiceError, unknown>;
      logger.error('Application creation failed', errorResult.error);
    }

    return respond(c, result);
  });

  app.get('/applications', async (c) => {
    const url = new URL(c.req.url);
    const params = {
      page: Number(url.searchParams.get('page')) || 1,
      limit: Number(url.searchParams.get('limit')) || 20,
      status: url.searchParams.get('status') || undefined,
    };

    const parsed = ListApplicationsRequestSchema.safeParse(params);

    if (!parsed.success) {
      return respond(
        c,
        failure(
          400,
          applicationErrorCodes.validationError,
          '잘못된 요청 파라미터입니다',
          parsed.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Get user ID from auth context (would need to be added to middleware)
    const userId = 'temp-user-id'; // TODO: Get from auth context

    const result = await listApplications(supabase, userId, parsed.data);

    if (!result.ok) {
      const errorResult = result as ErrorResult<ApplicationServiceError, unknown>;
      logger.error('Application listing failed', errorResult.error);
    }

    return respond(c, result);
  });
};
