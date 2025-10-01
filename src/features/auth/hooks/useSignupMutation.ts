'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import {
  SignupRequestSchema,
  SignupResponseSchema,
  type SignupRequest,
  type SignupResponse,
} from '../lib/dto';

const signupUser = async (data: SignupRequest): Promise<SignupResponse> => {
  try {
    const validated = SignupRequestSchema.parse(data);
    const { data: responseData } = await apiClient.post(
      '/api/auth/signup',
      validated,
    );
    return SignupResponseSchema.parse(responseData);
  } catch (error) {
    const message = extractApiErrorMessage(error, '회원가입에 실패했습니다');
    throw new Error(message);
  }
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: signupUser,
  });
};

