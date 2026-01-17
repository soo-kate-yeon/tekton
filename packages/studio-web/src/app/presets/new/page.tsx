'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreatePreset } from '@/hooks/useCreatePreset';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

export default function CreatePresetPage() {
  const router = useRouter();
  const createPreset = useCreatePreset();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [config, setConfig] = useState('{}');
  const [configError, setConfigError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let parsedConfig = {};
    try {
      parsedConfig = JSON.parse(config);
      setConfigError('');
    } catch {
      setConfigError('Invalid JSON configuration');
      return;
    }

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const preset = await createPreset.mutateAsync({
        name,
        category,
        description: description || null,
        tags: tagList,
        config: parsedConfig,
      });
      router.push(`/presets/${preset.id}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to create preset:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/presets"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Gallery
        </Link>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Create New Preset</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Preset"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="professional"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of this preset"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags
              </label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="modern, dark, accessible (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="config" className="text-sm font-medium">
                Configuration (JSON)
              </label>
              <textarea
                id="config"
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                placeholder="{}"
                className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              />
              {configError && (
                <p className="text-sm text-destructive">{configError}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/presets">Cancel</Link>
            </Button>
            <Button type="submit" disabled={createPreset.isPending}>
              {createPreset.isPending ? 'Creating...' : 'Create Preset'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
