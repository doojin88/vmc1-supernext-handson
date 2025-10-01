export type BusinessType = 'food' | 'beauty' | 'fashion' | 'tech' | 'lifestyle' | 'other';

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  food: '식품/음료',
  beauty: '뷰티/화장품',
  fashion: '패션/의류',
  tech: 'IT/테크',
  lifestyle: '라이프스타일',
  other: '기타',
};

export const BUSINESS_TYPE_DESCRIPTIONS: Record<BusinessType, string> = {
  food: '음식, 음료, 건강식품 등',
  beauty: '화장품, 스킨케어, 향수 등',
  fashion: '의류, 액세서리, 신발 등',
  tech: '전자제품, 앱, 서비스 등',
  lifestyle: '홈데코, 생활용품, 취미용품 등',
  other: '기타 상품 및 서비스',
};
