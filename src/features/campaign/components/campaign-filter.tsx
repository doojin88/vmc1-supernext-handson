'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

type CampaignFilterProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export const CampaignFilter = ({
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

      {/* Active Filters */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>적용된 필터:</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            검색: {searchQuery}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={clearSearch}
            />
          </Badge>
        </div>
      )}
    </div>
  );
};
