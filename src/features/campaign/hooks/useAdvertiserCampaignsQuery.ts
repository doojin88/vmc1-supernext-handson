'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import {
  ListAdvertiserCampaignsRequestSchema,
  ListAdvertiserCampaignsResponseSchema,
  type ListAdvertiserCampaignsRequest,
  type ListAdvertiserCampaignsResponse,
} from '../lib/dto';

const fetchAdvertiserCampaigns = async (
  params: ListAdvertiserCampaignsRequest,
): Promise<ListAdvertiserCampaignsResponse> => {
  try {
    const validated = ListAdvertiserCampaignsRequestSchema.parse(params);
    const { data } = await apiClient.get('/api/advertiser/campaigns', {
      params: validated,
    });
    return ListAdvertiserCampaignsResponseSchema.parse(data);
  } catch (error) {
    const message = extractApiErrorMessage(
      error,
      '캠페인 목록을 불러오는데 실패했습니다',
    );
    throw new Error(message);
  }
};

export const useAdvertiserCampaignsQuery = (params: ListAdvertiserCampaignsRequest) => {
  return useQuery({
    queryKey: ['advertiserCampaigns', params],
    queryFn: () => fetchAdvertiserCampaigns(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
