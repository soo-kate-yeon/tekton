/**
 * Screen Contract Definitions
 *
 * @remarks
 * This module provides a 4-layer screen contract architecture for AI-driven adaptive UI generation:
 * - Environment Layer: Platform-specific configurations (Web, Mobile, Tablet, etc.)
 * - Skeleton Layer: Layout structure presets (FullScreen, WithHeader, Dashboard, etc.)
 * - Intent Layer: Screen purpose and recommended patterns (DataList, Form, Dashboard, etc.)
 * - Token Layer: Design tokens and styling system (handled separately in token module)
 */

// Environment Layer
export {
  Environment,
  environmentContractSchema,
  type Environment as EnvironmentType,
  type GridSystem,
  type LayoutBehavior,
  type EnvironmentContract,
  type EnvironmentContractSchema,
} from './environment.js';

// Skeleton Layer
export {
  SkeletonPreset,
  skeletonContractSchema,
  type SkeletonPreset as SkeletonPresetType,
  type ContentArea,
  type SkeletonContract,
  type SkeletonContractSchema,
} from './skeleton.js';

// Intent Layer
export {
  ScreenIntent,
  intentContractSchema,
  INTENT_TO_COMPOUND_PATTERNS,
  type ScreenIntent as ScreenIntentType,
  type CompoundPatternMapping,
  type IntentContract,
  type IntentContractSchema,
} from './intent.js';
