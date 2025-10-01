'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import {
  CreateApplicationRequestSchema,
  CreateApplicationResponseSchema,
  type CreateApplicationRequest,
  type CreateApplicationResponse,
} from '../lib/dto';

const createApplication = async (
  data: CreateApplicationRequest,
): Promise<CreateApplicationResponse> => {
  try {
    const validated = CreateApplicationRequestSchema.parse(data);
    const { data: responseData } = await apiClient.post(
      '/api/applications',
      validated,
    );
    return CreateApplicationResponseSchema.parse(responseData);
  } catch (error) {
    const message = extractApiErrorMessage(
      error,
      '체험단 신청에 실패했습니다',
    );
    throw new Error(message);
  }
};

export const useCreateApplicationMutation = () => {
  return useMutation({
    mutationFn: createApplication,
  });
};
