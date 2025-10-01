'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import {
  CreateProfileRequestSchema,
  CreateProfileResponseSchema,
  type CreateProfileRequest,
  type CreateProfileResponse,
} from '../lib/dto';

const createInfluencerProfile = async (
  data: CreateProfileRequest,
): Promise<CreateProfileResponse> => {
  try {
    const validated = CreateProfileRequestSchema.parse(data);
    const { data: responseData } = await apiClient.post(
      '/api/influencer/profile',
      validated,
    );
    return CreateProfileResponseSchema.parse(responseData);
  } catch (error) {
    const message = extractApiErrorMessage(
      error,
      '인플루언서 프로필 생성에 실패했습니다',
    );
    throw new Error(message);
  }
};

export const useCreateProfileMutation = () => {
  return useMutation({
    mutationFn: createInfluencerProfile,
  });
};
