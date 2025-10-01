'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useCreateProfileMutation } from '@/features/influencer/hooks/useCreateProfileMutation';
import { ChannelInput } from '@/features/influencer/components/channel-input';
import type { Channel } from '@/features/influencer/lib/dto';

const defaultChannel: Channel = {
  platform: 'instagram',
  channelName: '',
  channelUrl: '',
  followerCount: undefined,
};

export default function InfluencerOnboardingPage() {
  const router = useRouter();
  const createProfileMutation = useCreateProfileMutation();
  const [birthDate, setBirthDate] = useState('');
  const [channels, setChannels] = useState<Channel[]>([defaultChannel]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addChannel = useCallback(() => {
    setChannels((prev) => [...prev, { ...defaultChannel }]);
  }, []);

  const removeChannel = useCallback((index: number) => {
    setChannels((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateChannel = useCallback((index: number, channel: Channel) => {
    setChannels((prev) => prev.map((c, i) => (i === index ? channel : c)));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!birthDate) {
      setErrorMessage('생년월일을 입력해주세요');
      return;
    }

    const validChannels = channels.filter(
      (channel) => channel.channelName && channel.channelUrl,
    );

    if (validChannels.length === 0) {
      setErrorMessage('최소 1개 이상의 채널을 완성해주세요');
      return;
    }

    try {
      await createProfileMutation.mutateAsync({
        birthDate,
        channels: validChannels,
      });

      router.push('/');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '프로필 생성 중 문제가 발생했습니다';
      setErrorMessage(message);
    }
  };

  const isSubmitDisabled =
    !birthDate ||
    channels.every((c) => !c.channelName || !c.channelUrl) ||
    createProfileMutation.isPending;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-10 px-6 py-16">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-semibold">인플루언서 프로필 등록</h1>
        <p className="text-slate-500">
          SNS 채널 정보를 등록하고 다양한 체험단에 참여해보세요.
        </p>
      </header>

      <div className="grid w-full gap-8 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              생년월일
            </label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">
              만 18세 이상만 가입 가능합니다
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-900">SNS 채널</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChannel}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                채널 추가
              </Button>
            </div>

            <div className="space-y-4">
              {channels.map((channel, index) => (
                <ChannelInput
                  key={index}
                  value={channel}
                  onChange={(updatedChannel) => updateChannel(index, updatedChannel)}
                  onRemove={() => removeChannel(index)}
                  index={index}
                />
              ))}
            </div>

            {channels.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p>채널을 추가해주세요</p>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              이전
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="flex-1"
            >
              {createProfileMutation.isPending ? '등록 중...' : '프로필 등록'}
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 p-6">
            <h3 className="font-medium text-slate-900 mb-4">등록 가이드</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>정확한 채널 URL을 입력해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>여러 플랫폼의 채널을 등록할 수 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>팔로워 수는 선택사항입니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>채널 검증은 등록 후 진행됩니다</span>
              </li>
            </ul>
          </div>

          <figure className="overflow-hidden rounded-xl border border-slate-200">
            <Image
              src="https://picsum.photos/seed/influencer/640/480"
              alt="인플루언서"
              width={640}
              height={480}
              className="h-full w-full object-cover"
              priority
            />
          </figure>
        </div>
      </div>
    </div>
  );
}
