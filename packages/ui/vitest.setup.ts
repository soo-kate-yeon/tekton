import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import * as axeMatchers from 'vitest-axe/matchers';

// Extend Vitest matchers with @testing-library/jest-dom
expect.extend(matchers);

// Extend Vitest matchers with vitest-axe
expect.extend(axeMatchers);

// Mock ResizeObserver for Radix UI components (Slider, etc.)
(global as any).ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});
