'use client';

import { useState } from 'react';
import { usePresets } from '@/hooks/usePresets';
import { useDeletePreset } from '@/hooks/useDeletePreset';
import { PresetGrid } from '@/components/presets/PresetGrid';
import { PresetFilters } from '@/components/presets/PresetFilters';
import { PresetPagination } from '@/components/presets/PresetPagination';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const LIMIT = 12;

export default function PresetsPage() {
  const [skip, setSkip] = useState(0);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  const { data, isLoading, error } = usePresets({
    skip,
    limit: LIMIT,
    category: category || undefined,
    tags: tags || undefined,
  });

  const deletePreset = useDeletePreset();

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSkip(0);
  };

  const handleTagsChange = (newTags: string) => {
    setTags(newTags);
    setSkip(0);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this preset?')) {
      deletePreset.mutate(id);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error loading presets</h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <p className="text-sm text-muted-foreground">
            Make sure the Studio API is running at localhost:8000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Preset Gallery</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage curated design token presets
          </p>
        </div>
        <Button asChild>
          <Link href="/presets/new">Create Preset</Link>
        </Button>
      </div>

      <div className="space-y-6">
        <PresetFilters
          category={category}
          tags={tags}
          onCategoryChange={handleCategoryChange}
          onTagsChange={handleTagsChange}
        />

        <PresetGrid
          presets={data?.items ?? []}
          isLoading={isLoading}
          onDelete={handleDelete}
        />

        {data && (
          <PresetPagination
            total={data.total}
            skip={data.skip}
            limit={data.limit}
            onPageChange={setSkip}
          />
        )}
      </div>
    </div>
  );
}
