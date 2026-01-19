'use client';

interface ThemePaginationProps {
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
}: ThemePaginationProps) {
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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (showEllipsisStart) {
        pages.push('ellipsis');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (showEllipsisEnd) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-[color:var(--color-border)]">
      {/* Results info */}
      <p className="text-sm text-[color:var(--color-muted-foreground)] tracking-wide">
        Showing{' '}
        <span className="font-medium text-[color:var(--color-foreground)]">
          {skip + 1}
        </span>
        {' '}-{' '}
        <span className="font-medium text-[color:var(--color-foreground)]">
          {Math.min(skip + limit, total)}
        </span>
        {' '}of{' '}
        <span className="font-medium text-[color:var(--color-foreground)]">
          {total}
        </span>
        {' '}presets
      </p>

      {/* Pagination controls */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={skip === 0}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium
            text-[color:var(--color-muted-foreground)]
            hover:text-[color:var(--color-foreground)]
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors"
          aria-label="Previous page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-[color:var(--color-muted-foreground)]"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange((page - 1) * limit)}
                className={`
                  min-w-[2.5rem] h-10 text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-[color:var(--color-foreground)] text-[color:var(--color-background)]'
                    : 'text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] hover:bg-[color:var(--color-muted)]'
                  }
                `}
                aria-label={`Page ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={skip + limit >= total}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium
            text-[color:var(--color-muted-foreground)]
            hover:text-[color:var(--color-foreground)]
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
}
