'use client';

import { useState, useMemo } from 'react';
import { loadPreset, type PresetName } from '@tekton/token-contract';
import { useArchetypeData } from '@/hooks/useArchetypeData';
import { usePreviewState } from '@/hooks/usePreviewState';
import { useCodeGeneration } from '@/hooks/useCodeGeneration';
import { useLivePreview } from '@/hooks/useLivePreview';
import {
  HookSelector,
  StateVariantControls,
  PreviewCanvas,
  AccessibilityInfoPanel,
  CodeExportPanel,
} from '@/components/component-preview';
import { PresetSelector } from '@/components/export';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import type { HookName } from '@/lib/component-preview';

export default function ComponentPreviewPage() {
  const [selectedHook, setSelectedHook] = useState<HookName | null>('useButton');
  const [selectedPreset, setSelectedPreset] = useState<PresetName>('professional');

  // Load preset for styling
  const preset = useMemo(() => {
    try {
      return loadPreset(selectedPreset);
    } catch {
      return null;
    }
  }, [selectedPreset]);

  // Load archetype data for selected hook
  const { hookMeta, variantOptions, accessibility } = useArchetypeData(selectedHook);

  // Manage preview state
  const { state, setStateValue, resetState } = usePreviewState(
    selectedHook,
    variantOptions
  );

  // Generate code
  const generatedCode = useCodeGeneration({
    hookName: selectedHook,
    componentState: state.componentState,
    styles: state.styles,
  });

  // Apply live preview styles
  useLivePreview(preset?.tokens, preset?.composition);

  const handleHookChange = (hookName: HookName) => {
    setSelectedHook(hookName);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Component Preview</h1>
        <p className="text-muted-foreground mt-1">
          Preview headless components with archetype styling
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Sidebar: Hook Selection */}
        <div className="space-y-6 lg:col-span-1">
          {/* Preset Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Design Preset</CardTitle>
            </CardHeader>
            <CardContent>
              <PresetSelector
                value={selectedPreset}
                onChange={setSelectedPreset}
              />
            </CardContent>
          </Card>

          {/* Hook Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select Hook</CardTitle>
              <CardDescription>
                Choose a headless hook to preview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HookSelector
                value={selectedHook}
                onChange={handleHookChange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Center: Preview and Controls */}
        <div className="space-y-6 lg:col-span-2">
          {/* Preview Canvas */}
          <PreviewCanvas
            hookName={selectedHook}
            styles={state.styles}
            componentState={state.componentState}
            semantic={preset?.tokens}
            composition={preset?.composition}
          />

          {/* State Controls */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    {hookMeta?.label ?? 'Component'} Options
                  </CardTitle>
                  <CardDescription>
                    Configure component state and variants
                  </CardDescription>
                </div>
                <button
                  onClick={resetState}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Reset
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <StateVariantControls
                options={variantOptions}
                state={state.componentState}
                onChange={setStateValue}
              />
            </CardContent>
          </Card>

          {/* Code Export */}
          <CodeExportPanel code={generatedCode} />
        </div>

        {/* Right Sidebar: Accessibility Info */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Accessibility</CardTitle>
              <CardDescription>
                WCAG compliance information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccessibilityInfoPanel accessibility={accessibility} />
            </CardContent>
          </Card>

          {/* Hook Info */}
          {hookMeta && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">About {hookMeta.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {hookMeta.description}
                </p>
                <div className="text-xs">
                  <span className="font-medium">Category:</span>{' '}
                  <span className="capitalize text-muted-foreground">
                    {hookMeta.category}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="font-medium">Hook:</span>{' '}
                  <code className="bg-muted px-1 rounded">{hookMeta.name}</code>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
