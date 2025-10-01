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
import { CreateProfileRequestSchema } from './schema';
import { createAdvertiserProfile } from './service';
import { advertiserErrorCodes, type AdvertiserServiceError } from './error';

export const registerAdvertiserRoutes = (app: Hono<AppEnv>) => {
  app.post('/advertiser/profile', async (c) => {
    const body = await c.req.json();
    const parsed = CreateProfileRequestSchema.safeParse(body);

    if (!parsed.success) {
      return respond(
        c,
        failure(
          400,
          advertiserErrorCodes.validationError,
          '입력 데이터가 유효하지 않습니다',
          parsed.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Get user ID from auth context (would need to be added to middleware)
    const userId = 'temp-user-id'; // TODO: Get from auth context

    const result = await createAdvertiserProfile(supabase, userId, parsed.data);

    if (!result.ok) {
      const errorResult = result as ErrorResult<AdvertiserServiceError, unknown>;
      logger.error('Advertiser profile creation failed', errorResult.error);
    }

    return respond(c, result);
  });
};
