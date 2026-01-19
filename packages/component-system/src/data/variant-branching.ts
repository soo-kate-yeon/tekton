/**
 * @file variant-branching.ts
 * @description Variant branching rules for all 20 headless hooks
 */

import type { VariantBranching } from '../schemas/variant-branching';
import variantBranchingRaw from './variant-branching.json' assert { type: 'json' };

/**
 * Variant branching data for all 20 hooks
 * Defines conditional styling logic based on hook configuration options
 */
export const variantBranchingData: VariantBranching[] =
  variantBranchingRaw as VariantBranching[];
