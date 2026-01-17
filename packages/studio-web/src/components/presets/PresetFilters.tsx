'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface PresetFiltersProps {
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string) => void;
  category?: string;
  tags?: string;
}

const CATEGORIES = [
  'All',
  'Professional',
  'Creative',
  'Minimal',
  'Vibrant',
  'Custom',
];

export function PresetFilters({
  onCategoryChange,
  onTagsChange,
  category = '',
  tags = '',
}: PresetFiltersProps) {
  const [localTags, setLocalTags] = useState(tags);

  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onTagsChange(localTags);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const value = cat === 'All' ? '' : cat.toLowerCase();
          const isActive = category === value;
          return (
            <Button
              key={cat}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(value)}
            >
              {cat}
            </Button>
          );
        })}
      </div>

      <div className="flex gap-2 items-center">
        <Input
          type="text"
          placeholder="Filter by tag..."
          value={localTags}
          onChange={(e) => setLocalTags(e.target.value)}
          onKeyDown={handleTagsKeyDown}
          onBlur={() => onTagsChange(localTags)}
          className="w-48"
        />
      </div>
    </div>
  );
}
