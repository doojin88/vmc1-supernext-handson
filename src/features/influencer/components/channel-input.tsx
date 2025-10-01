'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { Channel } from '../lib/dto';
import type { ChannelPlatform } from '../types';
import { PLATFORM_LABELS, PLATFORM_ICONS } from '../types';

type ChannelInputProps = {
  value: Channel;
  onChange: (channel: Channel) => void;
  onRemove: () => void;
  index: number;
};

export const ChannelInput = ({
  value,
  onChange,
  onRemove,
  index,
}: ChannelInputProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateUrl = (url: string, platform: ChannelPlatform) => {
    const patterns = {
      naver: /^https:\/\/(blog\.)?naver\.com\//,
      youtube: /^https:\/\/(www\.)?youtube\.com\//,
      instagram: /^https:\/\/(www\.)?instagram\.com\//,
      threads: /^https:\/\/(www\.)?threads\.net\//,
    };

    if (!patterns[platform].test(url)) {
      return `${PLATFORM_LABELS[platform]} URL 형식이 올바르지 않습니다`;
    }
    return null;
  };

  const handleChange = (field: keyof Channel, newValue: string | number) => {
    const updatedChannel = { ...value, [field]: newValue };
    onChange(updatedChannel);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }

    // Validate URL when it changes
    if (field === 'channelUrl' && typeof newValue === 'string') {
      const urlError = validateUrl(newValue, value.platform);
      if (urlError) {
        setErrors((prev) => ({ ...prev, channelUrl: urlError }));
      }
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-slate-900">
          채널 {index + 1}
          <Badge variant="secondary" className="ml-2">
            {PLATFORM_ICONS[value.platform]} {PLATFORM_LABELS[value.platform]}
          </Badge>
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-slate-500 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            플랫폼
          </label>
          <select
            value={value.platform}
            onChange={(e) =>
              handleChange('platform', e.target.value as ChannelPlatform)
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
          >
            <option value="naver">📝 네이버 블로그</option>
            <option value="youtube">📺 유튜브</option>
            <option value="instagram">📷 인스타그램</option>
            <option value="threads">🧵 스레드</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            채널명
          </label>
          <Input
            value={value.channelName}
            onChange={(e) => handleChange('channelName', e.target.value)}
            placeholder="채널명을 입력하세요"
            className={errors.channelName ? 'border-red-500' : ''}
          />
          {errors.channelName && (
            <p className="text-sm text-red-500 mt-1">{errors.channelName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            채널 URL
          </label>
          <Input
            value={value.channelUrl}
            onChange={(e) => handleChange('channelUrl', e.target.value)}
            placeholder={`${PLATFORM_LABELS[value.platform]} URL을 입력하세요`}
            className={errors.channelUrl ? 'border-red-500' : ''}
          />
          {errors.channelUrl && (
            <p className="text-sm text-red-500 mt-1">{errors.channelUrl}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            팔로워 수 (선택사항)
          </label>
          <Input
            type="number"
            value={value.followerCount || ''}
            onChange={(e) =>
              handleChange('followerCount', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="팔로워 수를 입력하세요"
            min="0"
          />
        </div>
      </div>
    </Card>
  );
};
