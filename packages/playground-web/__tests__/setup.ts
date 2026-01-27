/**
 * Test setup file for Vitest
 * SPEC-PLAYGROUND-001 Milestone 7
 */

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.MCP_SERVER_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3001';
