'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import {
  ListCampaignsRequestSchema,
  ListCampaignsResponseSchema,
  type ListCampaignsRequest,
  type ListCampaignsResponse,
} from '../lib/dto';

const fetchCampaigns = async (
  params: ListCampaignsRequest,
): Promise<ListCampaignsResponse> => {
  try {
    const validated = ListCampaignsRequestSchema.parse(params);
    const { data } = await apiClient.get('/api/campaigns', {
      params: validated,
    });
    return ListCampaignsResponseSchema.parse(data);
  } catch (error) {
    const message = extractApiErrorMessage(
      error,
      '캠페인 목록을 불러오는데 실패했습니다',
    );
    throw new Error(message);
  }
};

export const useCampaignsQuery = (params: ListCampaignsRequest) => {
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: () => fetchCampaigns(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
