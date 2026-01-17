'use client';

import { PresetCard } from './PresetCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Preset } from '@/lib/api/types';

interface PresetGridProps {
  presets: Preset[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
}

export function PresetGrid({ presets, isLoading, onDelete }: PresetGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24 mb-4" />
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="w-8 h-8 rounded-md" />
              ))}
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (presets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No presets found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {presets.map((preset) => (
        <PresetCard key={preset.id} preset={preset} onDelete={onDelete} />
      ))}
    </div>
  );
}
