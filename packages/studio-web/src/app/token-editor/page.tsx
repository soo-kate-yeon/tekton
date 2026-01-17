'use client';

import { useState, useMemo } from 'react';
import { loadPreset, type PresetName, type ColorToken } from '@tekton/token-contract';
import { useTokenEditor, useActiveColor } from '@/hooks/useTokenEditor';
import { useLivePreview } from '@/hooks/useLivePreview';
import { useSemanticTokensValidation, useWCAGSummary } from '@/hooks/useWCAGValidation';
import { useColorAccessibility } from '@/hooks/useWCAGValidation';
import {
  OKLCHColorPicker,
  ColorScaleEditor,
  SemanticTokenManager,
  WCAGComplianceIndicator,
  WCAGSummaryPanel,
  LivePreviewPanel,
} from '@/components/token-editor';
import { PresetSelector } from '@/components/export';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ColorScaleStep, SemanticTokenName } from '@/lib/token-editor';

export default function TokenEditorPage() {
  const [selectedPreset, setSelectedPreset] = useState<PresetName | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Token editor state
  const {
    state,
    updateColorScale,
    addSemanticToken,
    removeSemanticToken,
    setActiveToken,
    setActiveStep,
    loadPreset: loadPresetTokens,
    reset,
  } = useTokenEditor();

  // Get active color for editing
  const activeColor = useActiveColor(state);

  // Get active scale
  const activeScale = useMemo(() => {
    if (!state.activeToken) {
      return null;
    }
    return state.semantic[state.activeToken] ?? null;
  }, [state.semantic, state.activeToken]);

  // WCAG validation
  const validationResults = useSemanticTokensValidation(state.semantic);
  const wcagSummary = useWCAGSummary(validationResults);

  // Accessibility for active color
  const colorAccessibility = useColorAccessibility(activeColor);

  // Apply live preview
  useLivePreview(state.semantic, state.composition, showLivePreview);

  // Handle preset load
  const handlePresetChange = (presetName: PresetName) => {
    setSelectedPreset(presetName);
    try {
      const preset = loadPreset(presetName);
      loadPresetTokens(preset);
    } catch (error) {
      console.error('Failed to load preset:', error);
    }
  };

  // Handle color change from picker
  const handleColorChange = (color: { l: number; c: number; h: number }) => {
    if (state.activeToken && state.activeStep) {
      updateColorScale(
        state.activeToken as SemanticTokenName,
        state.activeStep as ColorScaleStep,
        color
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Token Editor</h1>
          <p className="text-muted-foreground mt-1">
            Create and customize your design token color scales
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowLivePreview(!showLivePreview)}
          >
            {showLivePreview ? 'Hide' : 'Show'} Preview
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Token Selection */}
        <div className="space-y-6 lg:col-span-1">
          {/* Load Preset */}
          <Card>
            <CardHeader>
              <CardTitle>Load Preset</CardTitle>
              <CardDescription>
                Start from a curated preset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PresetSelector
                value={selectedPreset}
                onChange={handlePresetChange}
              />
            </CardContent>
          </Card>

          {/* Semantic Tokens */}
          <Card>
            <CardHeader>
              <CardTitle>Semantic Tokens</CardTitle>
              <CardDescription>
                Select a token to edit its color scale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SemanticTokenManager
                tokens={state.semantic}
                activeToken={state.activeToken as SemanticTokenName | null}
                onSelectToken={setActiveToken}
                onAddToken={addSemanticToken}
                onRemoveToken={removeSemanticToken}
              />
            </CardContent>
          </Card>

          {/* WCAG Summary */}
          <WCAGSummaryPanel
            summary={wcagSummary}
            results={validationResults}
          />
        </div>

        {/* Center Column: Color Editor */}
        <div className="space-y-6 lg:col-span-1">
          {/* Scale Editor */}
          {activeScale && state.activeToken && (
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{state.activeToken} Scale</CardTitle>
                <CardDescription>
                  Click a step to edit its color
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ColorScaleEditor
                  scale={activeScale as Record<ColorScaleStep, ColorToken>}
                  activeStep={state.activeStep as ColorScaleStep | null}
                  onChange={setActiveStep}
                  semanticName={state.activeToken}
                />
              </CardContent>
            </Card>
          )}

          {/* Color Picker */}
          {activeColor && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {state.activeToken}-{state.activeStep}
                </CardTitle>
                <CardDescription>
                  Adjust OKLCH color values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OKLCHColorPicker
                  value={activeColor}
                  onChange={handleColorChange}
                />

                {/* Accessibility for this color */}
                <div className="mt-4 pt-4 border-t space-y-2">
                  <h4 className="text-sm font-medium">Accessibility</h4>
                  {colorAccessibility.onLight && (
                    <WCAGComplianceIndicator
                      result={colorAccessibility.onLight}
                      label="On light bg"
                    />
                  )}
                  {colorAccessibility.onDark && (
                    <WCAGComplianceIndicator
                      result={colorAccessibility.onDark}
                      label="On dark bg"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {!activeColor && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Select a token and color step to start editing
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-1">
          {showLivePreview && (
            <LivePreviewPanel
              semantic={state.semantic}
              composition={state.composition}
              className="sticky top-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}
