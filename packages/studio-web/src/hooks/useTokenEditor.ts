/**
 * useTokenEditor Hook
 * Manages token editing state
 */

import { useState, useCallback, useMemo } from 'react';
import type { SemanticToken, CompositionToken, ColorToken, Preset } from '@tekton/token-contract';
import {
  createDefaultSemanticTokens,
  DEFAULT_COMPOSITION_TOKENS,
  type ColorScaleStep,
  type SemanticTokenName,
} from '@/lib/token-editor';

export interface TokenEditorState {
  semantic: SemanticToken;
  composition: CompositionToken;
  activeToken: SemanticTokenName | null;
  activeStep: ColorScaleStep | null;
}

interface UseTokenEditorReturn {
  state: TokenEditorState;
  // Semantic token actions
  updateColorScale: (tokenName: SemanticTokenName, step: ColorScaleStep, color: ColorToken) => void;
  updateEntireScale: (tokenName: SemanticTokenName, scale: Record<ColorScaleStep, ColorToken>) => void;
  addSemanticToken: (tokenName: SemanticTokenName) => void;
  removeSemanticToken: (tokenName: SemanticTokenName) => void;
  // Composition token actions
  updateComposition: (key: keyof CompositionToken, value: CompositionToken[keyof CompositionToken]) => void;
  // Selection
  setActiveToken: (tokenName: SemanticTokenName | null) => void;
  setActiveStep: (step: ColorScaleStep | null) => void;
  // Load/Reset
  loadTheme: (preset: Preset) => void;
  loadTokens: (semantic: SemanticToken, composition?: CompositionToken) => void;
  reset: () => void;
}

export function useTokenEditor(
  initialSemantic?: SemanticToken,
  initialComposition?: CompositionToken
): UseTokenEditorReturn {
  const [state, setState] = useState<TokenEditorState>({
    semantic: initialSemantic ?? createDefaultSemanticTokens(),
    composition: initialComposition ?? DEFAULT_COMPOSITION_TOKENS,
    activeToken: 'primary',
    activeStep: '500',
  });

  // Update a single color in a scale
  const updateColorScale = useCallback(
    (tokenName: SemanticTokenName, step: ColorScaleStep, color: ColorToken) => {
      setState((prev) => ({
        ...prev,
        semantic: {
          ...prev.semantic,
          [tokenName]: {
            ...(prev.semantic[tokenName] ?? {}),
            [step]: color,
          },
        },
      }));
    },
    []
  );

  // Update an entire color scale
  const updateEntireScale = useCallback(
    (tokenName: SemanticTokenName, scale: Record<ColorScaleStep, ColorToken>) => {
      setState((prev) => ({
        ...prev,
        semantic: {
          ...prev.semantic,
          [tokenName]: scale,
        },
      }));
    },
    []
  );

  // Add a new semantic token
  const addSemanticToken = useCallback((tokenName: SemanticTokenName) => {
    setState((prev) => {
      if (prev.semantic[tokenName]) {
        return prev;
      }

      const defaultHues: Record<string, number> = {
        secondary: 280,
        accent: 180,
        info: 200,
      };

      const hue = defaultHues[tokenName] ?? 220;
      const newScale: Record<string, ColorToken> = {};

      const steps: ColorScaleStep[] = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
      const lightnesses = [0.97, 0.94, 0.86, 0.76, 0.64, 0.53, 0.45, 0.38, 0.30, 0.22, 0.15];

      steps.forEach((step, i) => {
        newScale[step] = { l: lightnesses[i], c: 0.15, h: hue };
      });

      return {
        ...prev,
        semantic: {
          ...prev.semantic,
          [tokenName]: newScale,
        },
        activeToken: tokenName,
      };
    });
  }, []);

  // Remove a semantic token (only removes optional tokens - required ones are preserved)
  const removeSemanticToken = useCallback((tokenName: SemanticTokenName) => {
    // Don't allow removing required tokens
    const requiredTokens = ['primary', 'neutral', 'success', 'warning', 'error'];
    if (requiredTokens.includes(tokenName)) {
      return;
    }

    setState((prev) => {
      const { [tokenName]: _, ...rest } = prev.semantic;
      return {
        ...prev,
        semantic: rest as SemanticToken,
        activeToken: prev.activeToken === tokenName ? 'primary' : prev.activeToken,
      };
    });
  }, []);

  // Update composition tokens
  const updateComposition = useCallback(
    (key: keyof CompositionToken, value: CompositionToken[keyof CompositionToken]) => {
      setState((prev) => ({
        ...prev,
        composition: {
          ...prev.composition,
          [key]: value,
        },
      }));
    },
    []
  );

  // Set active token for editing
  const setActiveToken = useCallback((tokenName: SemanticTokenName | null) => {
    setState((prev) => ({
      ...prev,
      activeToken: tokenName,
    }));
  }, []);

  // Set active step for editing
  const setActiveStep = useCallback((step: ColorScaleStep | null) => {
    setState((prev) => ({
      ...prev,
      activeStep: step,
    }));
  }, []);

  // Load from a preset
  const loadTheme = useCallback((preset: Preset) => {
    setState((prev) => ({
      ...prev,
      semantic: preset.tokens,
      composition: preset.composition,
    }));
  }, []);

  // Load tokens directly
  const loadTokens = useCallback(
    (semantic: SemanticToken, composition?: CompositionToken) => {
      setState((prev) => ({
        ...prev,
        semantic,
        composition: composition ?? prev.composition,
      }));
    },
    []
  );

  // Reset to defaults
  const reset = useCallback(() => {
    setState({
      semantic: createDefaultSemanticTokens(),
      composition: DEFAULT_COMPOSITION_TOKENS,
      activeToken: 'primary',
      activeStep: '500',
    });
  }, []);

  return {
    state,
    updateColorScale,
    updateEntireScale,
    addSemanticToken,
    removeSemanticToken,
    updateComposition,
    setActiveToken,
    setActiveStep,
    loadTheme,
    loadTokens,
    reset,
  };
}

/**
 * Get the currently active color
 */
export function useActiveColor(state: TokenEditorState): ColorToken | null {
  return useMemo(() => {
    if (!state.activeToken || !state.activeStep) {
      return null;
    }
    const scale = state.semantic[state.activeToken];
    if (!scale) {
      return null;
    }
    return scale[state.activeStep] ?? null;
  }, [state.semantic, state.activeToken, state.activeStep]);
}
