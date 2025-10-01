'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import {
  GetCampaignRequestSchema,
  GetCampaignResponseSchema,
  type GetCampaignRequest,
  type GetCampaignResponse,
} from '../lib/dto';

const fetchCampaign = async (
  params: GetCampaignRequest,
): Promise<GetCampaignResponse> => {
  try {
    const validated = GetCampaignRequestSchema.parse(params);
    const { data } = await apiClient.get(`/api/campaigns/${validated.id}`);
    return GetCampaignResponseSchema.parse(data);
  } catch (error) {
    const message = extractApiErrorMessage(
      error,
      '캠페인 정보를 불러오는데 실패했습니다',
    );
    throw new Error(message);
  }
};

export const useCampaignQuery = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => fetchCampaign({ id: campaignId }),
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
