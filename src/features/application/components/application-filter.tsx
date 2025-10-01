'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { APPLICATION_STATUS_LABELS } from '../types';
import type { ApplicationStatus } from '../types';

type ApplicationFilterProps = {
  selectedStatus: ApplicationStatus | null;
  onStatusChange: (status: ApplicationStatus | null) => void;
};

export const ApplicationFilter = ({
  selectedStatus,
  onStatusChange,
}: ApplicationFilterProps) => {
  const statuses: ApplicationStatus[] = ['pending', 'approved', 'rejected'];

  const clearStatus = () => {
    onStatusChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          상태별 필터
        </h3>
        {selectedStatus && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearStatus}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            전체보기
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Badge
            key={status}
            variant={selectedStatus === status ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => onStatusChange(selectedStatus === status ? null : status)}
          >
            {APPLICATION_STATUS_LABELS[status]}
          </Badge>
        ))}
      </div>

      {selectedStatus && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>적용된 필터:</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            {APPLICATION_STATUS_LABELS[selectedStatus]}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={clearStatus}
            />
          </Badge>
        </div>
      )}
    </div>
  );
};
