/**
 * @file hook-prop-rules.ts
 * @description Hook prop mapping rules for all 20 headless hooks
 */

import type { HookPropRule } from '../schemas/hook-prop-rule.js';
import hookPropRulesRaw from './hook-prop-rules.json' with { type: 'json' };

/**
 * Hook prop rules data for all 20 hooks
 * Defines prop objects and base styling for each hook
 */
export const hookPropRulesData: HookPropRule[] = hookPropRulesRaw.hooks as HookPropRule[];
