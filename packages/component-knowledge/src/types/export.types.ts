/**
 * Export Type Definitions
 * TAG: SPEC-LAYER2-001
 *
 * Types for export formats (JSON, Markdown) and Layer 3 integration
 */

import type { ComponentKnowledge, ComponentState } from './knowledge.types.js';
import type { z } from 'zod';

/**
 * JSON Export Format
 */
export interface JSONExportFormat {
  schemaVersion: '2.0.0';
  generatedAt: string;
  components: Record<string, ComponentKnowledge>;
}

/**
 * Layer 2 → Layer 3 Contract
 */
export interface Layer2Output {
  /** Schema version for compatibility checking */
  schemaVersion: '2.0.0';

  /** Generated timestamp for cache invalidation */
  generatedAt: string;

  /** Complete component knowledge catalog */
  components: {
    [componentName: string]: {
      /** Full ComponentKnowledge entry */
      knowledge: ComponentKnowledge;

      /** Generated Zod schema for props validation */
      zodSchema: z.ZodObject<any>;

      /** TypeScript type definition as string */
      propsType: string;

      /** CSS-in-JS bindings by library */
      cssBindings: {
        vanillaExtract?: {
          baseStyle: string;
          variants: Record<string, string>;
        };
      };

      /** All states covered in bindings */
      states: ComponentState[];

      /** Variant names if applicable */
      variants: string[];

      /** All token names referenced */
      tokenReferences: string[];
    };
  };

  /** Slot definitions for Layer 3 slot resolution */
  standardSlots: {
    name: string;
    role: string;
    allowedTypes: ('atom' | 'molecule' | 'organism' | 'template')[];
    allowedCategories: ('display' | 'input' | 'action' | 'container' | 'navigation')[];
  }[];
}
