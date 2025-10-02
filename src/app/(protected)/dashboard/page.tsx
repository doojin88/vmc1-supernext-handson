"use client";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Users, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Settings,
  FileText,
  Target
} from "lucide-react";
import Link from "next/link";

type DashboardPageProps = {
  params: Promise<Record<string, never>>;
};

export default function DashboardPage({ params }: DashboardPageProps) {
  void params;
  const { user } = useCurrentUser();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">광고주 대시보드</h1>
        <p className="text-slate-500">
          {user?.email ?? "알 수 없는 사용자"} 님, 체험단 관리에 오신 것을 환영합니다.
        </p>
      </header>

      {/* Quick Actions */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">새 체험단 등록</h3>
              <p className="text-sm text-slate-500">체험단을 새로 등록하세요</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">지원자 관리</h3>
              <p className="text-sm text-slate-500">체험단 지원자를 확인하세요</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">성과 분석</h3>
              <p className="text-sm text-slate-500">체험단 성과를 분석하세요</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Settings className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium">계정 설정</h3>
              <p className="text-sm text-slate-500">프로필을 관리하세요</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Campaign Overview */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">진행 중인 체험단</h2>
              <Button asChild>
                <Link href="/campaigns/manage">
                  <Plus className="h-4 w-4 mr-2" />
                  새 체험단 등록
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Sample campaign cards */}
              <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">맛있는 카페 체험단</h3>
                    <p className="text-sm text-slate-500">2024.01.15 - 2024.01.30</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">모집중</Badge>
                    <span className="text-sm text-slate-500">5/10명</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">뷰티 브랜드 체험단</h3>
                    <p className="text-sm text-slate-500">2024.01.10 - 2024.01.25</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">모집종료</Badge>
                    <span className="text-sm text-slate-500">8/8명</span>
                  </div>
                </div>
              </div>

              <div className="text-center py-8 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>아직 등록된 체험단이 없습니다</p>
                <p className="text-sm">새 체험단을 등록해보세요</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Statistics */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">통계</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">총 체험단</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm">총 지원자</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">완료된 체험단</span>
                </div>
                <span className="font-medium">0</span>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">최근 활동</h2>
            <div className="text-center py-8 text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">아직 활동이 없습니다</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
