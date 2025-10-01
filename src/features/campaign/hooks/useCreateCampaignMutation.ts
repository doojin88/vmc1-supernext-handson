'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import {
  CreateCampaignRequestSchema,
  CreateCampaignResponseSchema,
  type CreateCampaignRequest,
  type CreateCampaignResponse,
} from '../lib/dto';

const createCampaign = async (
  data: CreateCampaignRequest,
): Promise<CreateCampaignResponse> => {
  try {
    const validated = CreateCampaignRequestSchema.parse(data);
    const { data: responseData } = await apiClient.post(
      '/api/campaigns',
      validated,
    );
    return CreateCampaignResponseSchema.parse(responseData);
  } catch (error) {
    const message = extractApiErrorMessage(
      error,
      '캠페인 생성에 실패했습니다',
    );
    throw new Error(message);
  }
};

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['advertiserCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};
