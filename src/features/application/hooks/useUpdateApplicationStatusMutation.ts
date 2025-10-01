'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import {
  UpdateApplicationStatusRequestSchema,
  UpdateApplicationStatusResponseSchema,
  type UpdateApplicationStatusRequest,
  type UpdateApplicationStatusResponse,
} from '../lib/dto';

const updateApplicationStatus = async (
  data: UpdateApplicationStatusRequest,
): Promise<UpdateApplicationStatusResponse> => {
  try {
    const validated = UpdateApplicationStatusRequestSchema.parse(data);
    const { data: responseData } = await apiClient.put(
      `/api/applications/${validated.applicationId}/status`,
      {
        status: validated.status,
        feedback: validated.feedback,
      },
    );
    return UpdateApplicationStatusResponseSchema.parse(responseData);
  } catch (error) {
    const message = extractApiErrorMessage(
      error,
      '신청 상태 업데이트에 실패했습니다',
    );
    throw new Error(message);
  }
};

export const useUpdateApplicationStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['campaignApplications'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};
