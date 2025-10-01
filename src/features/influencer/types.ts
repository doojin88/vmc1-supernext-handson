export type ChannelPlatform = 'naver' | 'youtube' | 'instagram' | 'threads';

export const PLATFORM_LABELS: Record<ChannelPlatform, string> = {
  naver: '네이버 블로그',
  youtube: '유튜브',
  instagram: '인스타그램',
  threads: '스레드',
};

export const PLATFORM_URL_PATTERNS: Record<ChannelPlatform, RegExp> = {
  naver: /^https:\/\/(blog\.)?naver\.com\//,
  youtube: /^https:\/\/(www\.)?youtube\.com\//,
  instagram: /^https:\/\/(www\.)?instagram\.com\//,
  threads: /^https:\/\/(www\.)?threads\.net\//,
};

export const PLATFORM_ICONS: Record<ChannelPlatform, string> = {
  naver: '📝',
  youtube: '📺',
  instagram: '📷',
  threads: '🧵',
};
