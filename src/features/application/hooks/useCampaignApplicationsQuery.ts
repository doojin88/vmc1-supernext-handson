'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import {
  ListCampaignApplicationsRequestSchema,
  ListCampaignApplicationsResponseSchema,
  type ListCampaignApplicationsRequest,
  type ListCampaignApplicationsResponse,
} from '../lib/dto';

const fetchCampaignApplications = async (
  params: ListCampaignApplicationsRequest,
): Promise<ListCampaignApplicationsResponse> => {
  try {
    const validated = ListCampaignApplicationsRequestSchema.parse(params);
    const { data } = await apiClient.get(
      `/api/campaigns/${validated.campaignId}/applications`,
      {
        params: {
          page: validated.page,
          limit: validated.limit,
          status: validated.status,
        },
      },
    );
    return ListCampaignApplicationsResponseSchema.parse(data);
  } catch (error) {
    const message = extractApiErrorMessage(
      error,
      '캠페인 신청 목록을 불러오는데 실패했습니다',
    );
    throw new Error(message);
  }
};

export const useCampaignApplicationsQuery = (params: ListCampaignApplicationsRequest) => {
  return useQuery({
    queryKey: ['campaignApplications', params],
    queryFn: () => fetchCampaignApplications(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
