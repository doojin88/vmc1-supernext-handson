import type { SupabaseClient } from '@supabase/supabase-js';
import {
  failure,
  success,
  type HandlerResult,
} from '@/backend/http/response';
import type { SignupRequest, SignupResponse } from './schema';
import { authErrorCodes, type AuthServiceError } from './error';

export const signupUser = async (
  client: SupabaseClient,
  data: SignupRequest,
): Promise<HandlerResult<SignupResponse, AuthServiceError, unknown>> => {
  try {
    // 1. Create auth user via Supabase Admin API
    const { data: authData, error: authError } =
      await client.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true, // Force email confirmation to be true
        user_metadata: {
          email_confirmed: true, // Additional metadata to ensure confirmation
        },
      });

    if (authError || !authData.user) {
      return failure(
        400,
        authErrorCodes.authServiceError,
        authError?.message ?? '사용자 생성에 실패했습니다',
      );
    }

    const userId = authData.user.id;

    // 2. Create user profile
    const { error: profileError } = await client.from('user_profiles').insert({
      id: userId,
      role: data.role,
      full_name: data.fullName,
      phone_number: data.phoneNumber,
    });

    if (profileError) {
      // Rollback: delete auth user
      await client.auth.admin.deleteUser(userId);
      return failure(
        500,
        authErrorCodes.profileCreationFailed,
        `프로필 생성 실패: ${profileError.message}`,
      );
    }

    // 3. Create terms agreement
    const { error: termsError } = await client.from('terms_agreements').insert({
      user_id: userId,
      terms_version: data.termsVersion,
    });

    if (termsError) {
      // Rollback: delete user profile and auth user
      await client.from('user_profiles').delete().eq('id', userId);
      await client.auth.admin.deleteUser(userId);
      return failure(
        500,
        authErrorCodes.profileCreationFailed,
        `약관 동의 기록 실패: ${termsError.message}`,
      );
    }

    return success({
      userId,
      email: authData.user.email!,
      role: data.role,
      requiresEmailVerification: false,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    return failure(500, authErrorCodes.authServiceError, message);
  }
};

