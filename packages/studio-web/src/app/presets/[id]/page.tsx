'use client';

import { use } from 'react';
import Link from 'next/link';
import { usePreset } from '@/hooks/usePreset';
import { useDeletePreset } from '@/hooks/useDeletePreset';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

interface PresetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PresetDetailPage({ params }: PresetDetailPageProps) {
  const { id } = use(params);
  const presetId = parseInt(id, 10);
  const router = useRouter();

  const { data: preset, isLoading, error } = usePreset(presetId);
  const deletePreset = useDeletePreset();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this preset?')) {
      await deletePreset.mutateAsync(presetId);
      router.push('/presets');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !preset) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Preset not found</h2>
          <p className="text-muted-foreground mb-6">
            The preset you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <Button asChild>
            <Link href="/presets">Back to Gallery</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/presets"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Gallery
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{preset.name}</h1>
          <p className="text-muted-foreground">{preset.category}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {preset.description && (
        <p className="text-lg mb-6">{preset.description}</p>
      )}

      {preset.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {preset.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-muted p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(preset.config, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">ID</p>
              <p className="font-mono">{preset.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={preset.is_active ? 'default' : 'secondary'}>
                {preset.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p>{new Date(preset.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Updated</p>
              <p>{new Date(preset.updated_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
