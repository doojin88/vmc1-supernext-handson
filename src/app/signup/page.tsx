'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useSignupMutation } from '@/features/auth/hooks/useSignupMutation';
import { ROLE_LABELS, ROLE_DESCRIPTIONS, type UserRole } from '@/features/auth/types';
import { CURRENT_TERMS_VERSION } from '@/constants/terms';

const defaultFormState = {
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  phoneNumber: '',
  role: '' as UserRole | '',
  agreeToTerms: false,
};

type SignupPageProps = {
  params: Promise<Record<string, never>>;
};

export default function SignupPage({ params }: SignupPageProps) {
  void params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useCurrentUser();
  const signupMutation = useSignupMutation();
  const [formState, setFormState] = useState(defaultFormState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectedFrom = searchParams.get('redirectedFrom') ?? '/';
      router.replace(redirectedFrom);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = event.target;
      setFormState((previous) => ({
        ...previous,
        [name]: type === 'checkbox' ? checked : value,
      }));
    },
    [],
  );

  const handleRoleChange = useCallback((role: UserRole) => {
    setFormState((previous) => ({ ...previous, role }));
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrorMessage(null);

      if (formState.password !== formState.confirmPassword) {
        setErrorMessage('비밀번호가 일치하지 않습니다.');
        return;
      }

      if (!formState.role) {
        setErrorMessage('역할을 선택해주세요.');
        return;
      }

      if (!formState.agreeToTerms) {
        setErrorMessage('이용약관에 동의해주세요.');
        return;
      }

      try {
        const result = await signupMutation.mutateAsync({
          email: formState.email,
          password: formState.password,
          fullName: formState.fullName,
          phoneNumber: formState.phoneNumber,
          role: formState.role,
          termsVersion: CURRENT_TERMS_VERSION,
        });

        if (formState.role === 'influencer') {
          router.push('/onboarding/influencer');
        } else {
          router.push('/onboarding/advertiser');
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : '회원가입 처리 중 문제가 발생했습니다.';
        setErrorMessage(message);
      }
    },
    [
      formState.agreeToTerms,
      formState.confirmPassword,
      formState.email,
      formState.fullName,
      formState.password,
      formState.phoneNumber,
      formState.role,
      router,
      signupMutation,
    ],
  );

  const isSubmitDisabled =
    !formState.email.trim() ||
    !formState.password.trim() ||
    !formState.fullName.trim() ||
    !formState.phoneNumber.trim() ||
    !formState.role ||
    !formState.agreeToTerms ||
    formState.password !== formState.confirmPassword ||
    signupMutation.isPending;

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-10 px-6 py-16">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-semibold">회원가입</h1>
        <p className="text-slate-500">
          블로그 체험단 플랫폼에 가입하고 다양한 기회를 만나보세요.
        </p>
      </header>
      <div className="grid w-full gap-8 md:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            이름
            <input
              type="text"
              name="fullName"
              autoComplete="name"
              required
              value={formState.fullName}
              onChange={handleChange}
              placeholder="홍길동"
              className="rounded-md border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            휴대폰 번호
            <input
              type="tel"
              name="phoneNumber"
              autoComplete="tel"
              required
              value={formState.phoneNumber}
              onChange={handleChange}
              placeholder="01012345678"
              className="rounded-md border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
            />
            <span className="text-xs text-slate-500">
              숫자만 입력 (예: 01012345678)
            </span>
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            이메일
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={formState.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="rounded-md border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            비밀번호
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              required
              value={formState.password}
              onChange={handleChange}
              placeholder="최소 8자 이상"
              className="rounded-md border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            비밀번호 확인
            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              required
              value={formState.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 재입력"
              className="rounded-md border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
            />
          </label>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">역할 선택</label>
            <div className="grid gap-3">
              {(['influencer', 'advertiser'] as const).map((role) => (
                <label
                  key={role}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition ${
                    formState.role === role
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formState.role === role}
                    onChange={() => handleRoleChange(role)}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 h-5 w-5 rounded-full border-2 ${
                        formState.role === role
                          ? 'border-slate-900 bg-slate-900'
                          : 'border-slate-300'
                      } flex items-center justify-center`}
                    >
                      {formState.role === role && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">
                        {ROLE_LABELS[role]}
                      </div>
                      <div className="text-sm text-slate-500">
                        {ROLE_DESCRIPTIONS[role]}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formState.agreeToTerms}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
            />
            <span>
              <Link
                href="/terms"
                target="_blank"
                className="font-medium text-slate-900 underline hover:text-slate-700"
              >
                이용약관
              </Link>
              에 동의합니다
            </span>
          </label>

          {errorMessage && (
            <p className="text-sm text-rose-500">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {signupMutation.isPending ? '등록 중...' : '회원가입'}
          </button>

          <p className="text-xs text-slate-500">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-medium text-slate-700 underline hover:text-slate-900"
            >
              로그인으로 이동
            </Link>
          </p>
        </form>
        <figure className="overflow-hidden rounded-xl border border-slate-200">
          <Image
            src="https://picsum.photos/seed/signup/640/640"
            alt="회원가입"
            width={640}
            height={640}
            className="h-full w-full object-cover"
            priority
          />
        </figure>
      </div>
    </div>
  );
}
