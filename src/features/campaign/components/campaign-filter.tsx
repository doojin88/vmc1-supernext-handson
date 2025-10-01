'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import type { CampaignCategory } from '../types';
import { CAMPAIGN_CATEGORY_LABELS, CAMPAIGN_CATEGORY_ICONS } from '../types';

type CampaignFilterProps = {
  selectedCategory: CampaignCategory | null;
  onCategoryChange: (category: CampaignCategory | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export const CampaignFilter = ({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: CampaignFilterProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearchQuery);
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    onSearchChange('');
  };

  const clearCategory = () => {
    onCategoryChange(null);
  };

  const categories: CampaignCategory[] = ['food', 'beauty', 'fashion', 'tech', 'lifestyle', 'other'];

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          placeholder="캠페인 제목이나 내용을 검색하세요"
          className="pl-10 pr-10"
        />
        {localSearchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Category Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-700">카테고리</h3>
          {selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCategory}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              전체보기
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => onCategoryChange(selectedCategory === category ? null : category)}
            >
              <span className="mr-1">{CAMPAIGN_CATEGORY_ICONS[category]}</span>
              {CAMPAIGN_CATEGORY_LABELS[category]}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory || searchQuery) && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>적용된 필터:</span>
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>{CAMPAIGN_CATEGORY_ICONS[selectedCategory]}</span>
              {CAMPAIGN_CATEGORY_LABELS[selectedCategory]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={clearCategory}
              />
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              검색: {searchQuery}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={clearSearch}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
