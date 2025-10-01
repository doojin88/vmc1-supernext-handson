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

  // Development helper: Confirm email for existing users
  app.post('/auth/confirm-email', async (c) => {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return respond(
        c,
        failure(
          400,
          authErrorCodes.validationError,
          '이메일이 필요합니다',
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    try {
      // Update user email confirmation status
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

      const user = users.users.find(u => u.email === email);
      if (!user) {
        return respond(
          c,
          failure(
            404,
            authErrorCodes.authServiceError,
            '사용자를 찾을 수 없습니다',
          ),
        );
      }

      // Update user to confirm email
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      );

      if (updateError) {
        return respond(
          c,
          failure(
            500,
            authErrorCodes.authServiceError,
            `이메일 확인 실패: ${updateError.message}`,
          ),
        );
      }

      return respond(c, success({ message: '이메일이 확인되었습니다' }));
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      logger.error('Email confirmation failed', { error: message });
      return respond(
        c,
        failure(500, authErrorCodes.authServiceError, message),
      );
    }
  });
};

