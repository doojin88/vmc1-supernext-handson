import type { Hono } from 'hono';
import {
  failure,
  success,
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

  // Development helper: Disable email confirmation for all users
  app.post('/auth/disable-email-confirmation', async (c) => {
    const supabase = getSupabase(c);
    const logger = getLogger(c);

    try {
      // Get all users
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        return respond(
          c,
          failure(
            500,
            authErrorCodes.authServiceError,
            `사용자 목록 조회 실패: ${listError.message}`,
          ),
        );
      }

      // Update all users to confirm email
      const updatePromises = users.users.map(user => 
        supabase.auth.admin.updateUserById(user.id, { 
          email_confirm: true,
          user_metadata: {
            ...user.user_metadata,
            email_confirmed: true
          }
        })
      );

      const results = await Promise.allSettled(updatePromises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info(`Email confirmation disabled for ${successful} users, ${failed} failed`);

      return respond(c, success({ 
        message: `이메일 확인이 ${successful}명의 사용자에 대해 비활성화되었습니다`,
        successful,
        failed
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      logger.error('Email confirmation disable failed', { error: message });
      return respond(
        c,
        failure(500, authErrorCodes.authServiceError, message),
      );
    }
  });
};

