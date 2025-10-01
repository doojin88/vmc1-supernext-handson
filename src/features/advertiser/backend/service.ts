import type { SupabaseClient } from '@supabase/supabase-js';
import {
  failure,
  success,
  type HandlerResult,
} from '@/backend/http/response';
import type { CreateProfileRequest, CreateProfileResponse } from './schema';
import { advertiserErrorCodes, type AdvertiserServiceError } from './error';

export const createAdvertiserProfile = async (
  client: SupabaseClient,
  userId: string,
  data: CreateProfileRequest,
): Promise<HandlerResult<CreateProfileResponse, AdvertiserServiceError, unknown>> => {
  try {
    // Check for duplicate business number
    const { data: existingProfile, error: checkError } = await client
      .from('advertiser_profiles')
      .select('id')
      .eq('business_number', data.businessNumber)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return failure(
        500,
        advertiserErrorCodes.profileCreationFailed,
        `사업자등록번호 확인 중 오류: ${checkError.message}`,
      );
    }

    if (existingProfile) {
      return failure(
        409,
        advertiserErrorCodes.duplicateBusinessNumber,
        '이미 등록된 사업자등록번호입니다',
      );
    }

    // Create advertiser profile
    const { error: profileError } = await client
      .from('advertiser_profiles')
      .insert({
        user_id: userId,
        company_name: data.companyName,
        business_number: data.businessNumber,
        contact_name: data.contactName,
        contact_phone: data.contactPhone,
        contact_email: data.contactEmail,
        business_type: data.businessType,
        company_description: data.companyDescription,
        verification_status: 'pending',
      });

    if (profileError) {
      return failure(
        500,
        advertiserErrorCodes.profileCreationFailed,
        `프로필 생성 실패: ${profileError.message}`,
      );
    }

    // TODO: Queue business number verification job
    // await queueBusinessNumberVerification(userId, data.businessNumber);

    return success({
      profileId: userId,
      verificationStatus: 'pending',
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    return failure(500, advertiserErrorCodes.profileCreationFailed, message);
  }
};
