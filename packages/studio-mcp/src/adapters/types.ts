/**
 * Shared types for adapters
 * Provides stable interfaces independent of external packages
 */

export interface AdapterResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

export type { GenerateCodeOptions, GenerateCodeResult } from './component-adapter.js';
export type { ComponentInfo } from './catalog-adapter.js';
