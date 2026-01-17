'use client';

import { Button } from '@/components/ui/Button';

interface PresetPaginationProps {
  total: number;
  skip: number;
  limit: number;
  onPageChange: (skip: number) => void;
}

export function PresetPagination({
  total,
  skip,
  limit,
  onPageChange,
}: PresetPaginationProps) {
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (skip >= limit) {
      onPageChange(skip - limit);
    }
  };

  const handleNext = () => {
    if (skip + limit < total) {
      onPageChange(skip + limit);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} presets
      </p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={skip === 0}
        >
          Previous
        </Button>

        <span className="flex items-center px-3 text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={skip + limit >= total}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
