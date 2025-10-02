'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { 
  CAMPAIGN_CATEGORIES, 
  CATEGORY_LABELS, 
  CATEGORY_COLORS,
  type CampaignCategory 
} from '../constants/categories';

type CampaignFilterProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CampaignCategory;
  onCategoryChange?: (category: CampaignCategory) => void;
};

export const CampaignFilter = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: CampaignFilterProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debug: Log props
  console.log('CampaignFilter selectedCategory:', selectedCategory, 'onCategoryChange:', onCategoryChange);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearchQuery);
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    onSearchChange('');
  };

  const clearAllFilters = () => {
    setLocalSearchQuery('');
    onSearchChange('');
    onCategoryChange?.('all' as CampaignCategory);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all';

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-3">검색</h3>
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
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-3">카테고리</h3>
        <div className="flex flex-wrap gap-2">
          {CAMPAIGN_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log('Category clicked:', category, 'Current selected:', selectedCategory);
                onCategoryChange?.(category as CampaignCategory);
              }}
              className={`${
                selectedCategory === category 
                  ? CATEGORY_COLORS[category]
                  : 'hover:bg-slate-50'
              } transition-colors`}
            >
              {CATEGORY_LABELS[category]}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">적용된 필터</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              모두 지우기
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                검색: {searchQuery}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={clearSearch}
                />
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                카테고리: {CATEGORY_LABELS[selectedCategory]}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => onCategoryChange?.('all' as CampaignCategory)}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
