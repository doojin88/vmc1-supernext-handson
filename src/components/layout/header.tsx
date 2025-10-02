'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export const Header = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: userLoading, refresh } = useCurrentUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      // 사용자 상태를 즉시 업데이트
      await refresh();
      // 페이지를 메인으로 리다이렉트
      router.push('/');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-slate-900">
              체험단 플랫폼
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/campaigns" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              체험단 둘러보기
            </Link>
            {isAuthenticated && (
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                광고주 대시보드
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {!userLoading && (
              <>
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {user.email}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                      </span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">로그인</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/signup">가입하기</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
