'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import {
  ListApplicationsRequestSchema,
  ListApplicationsResponseSchema,
  type ListApplicationsRequest,
  type ListApplicationsResponse,
} from '../lib/dto';

const fetchApplications = async (
  params: ListApplicationsRequest,
): Promise<ListApplicationsResponse> => {
  try {
    const validated = ListApplicationsRequestSchema.parse(params);
    const { data } = await apiClient.get('/api/applications', {
      params: validated,
    });
    return ListApplicationsResponseSchema.parse(data);
  } catch (error) {
    const message = extractApiErrorMessage(
      error,
      '신청 내역을 불러오는데 실패했습니다',
    );
    throw new Error(message);
  }
};

export const useApplicationsQuery = (params: ListApplicationsRequest) => {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => fetchApplications(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
