/**
 * @file state-style-mappings.ts
 * @description State-to-style mapping rules for all 20 headless hooks
 */

import type { StateStyleMapping } from '../schemas/state-style-mapping';
import stateStyleMappingsRaw from './state-style-mapping.json' assert { type: 'json' };

/**
 * State-style mappings data for all 20 hooks
 * Defines visual feedback rules for hook state values
 */
export const stateStyleMappingsData: StateStyleMapping[] = stateStyleMappingsRaw.mappings as StateStyleMapping[];
