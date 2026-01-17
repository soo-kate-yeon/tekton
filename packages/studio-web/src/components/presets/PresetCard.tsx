'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Preset } from '@/lib/api/types';

interface PresetCardProps {
  preset: Preset;
  onDelete?: (id: number) => void;
}

function extractColors(config: Record<string, unknown>): string[] {
  const colors: string[] = [];

  if (config.colors && typeof config.colors === 'object') {
    const colorsObj = config.colors as Record<string, unknown>;
    if (colorsObj.primary && typeof colorsObj.primary === 'string') {
      colors.push(colorsObj.primary);
    }
    if (colorsObj.secondary && typeof colorsObj.secondary === 'string') {
      colors.push(colorsObj.secondary);
    }
    if (colorsObj.accent && typeof colorsObj.accent === 'string') {
      colors.push(colorsObj.accent);
    }
    if (colorsObj.neutral && typeof colorsObj.neutral === 'string') {
      colors.push(colorsObj.neutral);
    }
  }

  return colors.slice(0, 5);
}

export function PresetCard({ preset, onDelete }: PresetCardProps) {
  const colors = extractColors(preset.config);

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{preset.name}</CardTitle>
            <CardDescription className="mt-1">{preset.category}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {colors.length > 0 && (
          <div className="flex gap-1 mb-4">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-md border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}

        {preset.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {preset.description}
          </p>
        )}

        {preset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {preset.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {preset.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{preset.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/presets/${preset.id}`}>View</Link>
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(preset.id)}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
