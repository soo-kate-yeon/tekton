'use client';

import { useState, useMemo } from 'react';
import { loadPreset, type PresetName } from '@tekton/token-contract';
import { useExport } from '@/hooks/useExport';
import {
  ExportFormatSelector,
  ExportPreview,
  ExportActions,
  ExportOptionsPanel,
  PresetSelector,
} from '@/components/export';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

export default function ExportPage() {
  const [selectedPreset, setSelectedPreset] = useState<PresetName>('professional');

  // Load the selected preset
  const preset = useMemo(() => {
    try {
      return loadPreset(selectedPreset);
    } catch {
      return null;
    }
  }, [selectedPreset]);

  // Use export hook with preset data
  const {
    format,
    setFormat,
    options,
    setOption,
    content,
    filename,
  } = useExport({
    semantic: preset?.tokens ?? {},
    composition: preset?.composition,
    presetName: selectedPreset,
  });

  // Get language for preview syntax highlighting
  const language = format === 'css' ? 'css' : format === 'json' ? 'json' : 'typescript';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Export Tokens</h1>
        <p className="text-muted-foreground mt-1">
          Export design tokens as CSS, JSON, or React Native StyleSheet
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Controls */}
        <div className="space-y-6 lg:col-span-1">
          {/* Preset Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Source</CardTitle>
              <CardDescription>
                Select a preset to export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PresetSelector
                value={selectedPreset}
                onChange={setSelectedPreset}
              />
            </CardContent>
          </Card>

          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Format</CardTitle>
              <CardDescription>
                Choose export format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportFormatSelector value={format} onChange={setFormat} />
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
              <CardDescription>
                Configure export settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportOptionsPanel
                format={format}
                includeDarkMode={options.includeDarkMode}
                onIncludeDarkModeChange={(v) => setOption('includeDarkMode', v)}
                minify={options.minify}
                onMinifyChange={(v) => setOption('minify', v)}
                includeTypes={options.includeTypes}
                onIncludeTypesChange={(v) => setOption('includeTypes', v)}
                prettyPrint={options.prettyPrint}
                onPrettyPrintChange={(v) => setOption('prettyPrint', v)}
                className="border-0 p-0"
              />
            </CardContent>
          </Card>

          {/* Export Actions */}
          <ExportActions
            content={content}
            filename={filename}
            format={format}
          />
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                {preset?.description ?? 'Generated output preview'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportPreview
                content={content}
                language={language}
                className="h-[600px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
