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
import { SignupRequestSchema } from './schema';
import { signupUser } from './service';
import { authErrorCodes, type AuthServiceError } from './error';

export const registerAuthRoutes = (app: Hono<AppEnv>) => {
  app.post('/auth/signup', async (c) => {
    const body = await c.req.json();
    const parsed = SignupRequestSchema.safeParse(body);

    if (!parsed.success) {
      return respond(
        c,
        failure(
          400,
          authErrorCodes.validationError,
          '입력 데이터가 유효하지 않습니다',
          parsed.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    const result = await signupUser(supabase, parsed.data);

    if (!result.ok) {
      const errorResult = result as ErrorResult<AuthServiceError, unknown>;
      logger.error('Signup failed', errorResult.error);
    }

    return respond(c, result);
  });
};

