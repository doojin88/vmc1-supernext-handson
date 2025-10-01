import type { SupabaseClient } from '@supabase/supabase-js';
import {
  failure,
  success,
  type HandlerResult,
} from '@/backend/http/response';
import type { CreateProfileRequest, CreateProfileResponse } from './schema';
import { influencerErrorCodes, type InfluencerServiceError } from './error';

export const createInfluencerProfile = async (
  client: SupabaseClient,
  userId: string,
  data: CreateProfileRequest,
): Promise<HandlerResult<CreateProfileResponse, InfluencerServiceError, unknown>> => {
  try {
    // 1. Check if user profile exists
    const { data: existingUser, error: userCheckError } = await client
      .from('user_profiles')
      .select('id, role')
      .eq('id', userId)
      .single();

    if (userCheckError) {
      return failure(
        404,
        influencerErrorCodes.profileCreationFailed,
        `사용자 프로필을 찾을 수 없습니다: ${userCheckError.message}`,
      );
    }

    if (existingUser.role !== 'influencer') {
      return failure(
        400,
        influencerErrorCodes.profileCreationFailed,
        '인플루언서 역할이 아닙니다',
      );
    }

    // 2. Insert influencer profile
    const { error: profileError } = await client
      .from('influencer_profiles')
      .insert({
        user_id: userId,
        birth_date: data.birthDate,
        is_verified: false,
      });

    if (profileError) {
      return failure(
        500,
        influencerErrorCodes.profileCreationFailed,
        `프로필 생성 실패: ${profileError.message}`,
      );
    }

    // 2. Insert channels
    const channelInserts = data.channels.map((channel) => ({
      user_id: userId,
      platform: channel.platform,
      channel_name: channel.channelName,
      channel_url: channel.channelUrl,
      follower_count: channel.followerCount,
      verification_status: 'pending',
    }));

    const { data: insertedChannels, error: channelsError } = await client
      .from('influencer_channels')
      .insert(channelInserts)
      .select();

    if (channelsError) {
      // Rollback: delete influencer profile
      await client.from('influencer_profiles').delete().eq('user_id', userId);
      return failure(
        500,
        influencerErrorCodes.channelCreationFailed,
        `채널 생성 실패: ${channelsError.message}`,
      );
    }

    // 3. Queue verification jobs (mock for now)
    // await queueChannelVerification(insertedChannels);

    return success({
      profileId: userId,
      channels: insertedChannels.map((channel) => ({
        id: channel.id,
        platform: channel.platform,
        verificationStatus: channel.verification_status,
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    return failure(500, influencerErrorCodes.profileCreationFailed, message);
  }
};
