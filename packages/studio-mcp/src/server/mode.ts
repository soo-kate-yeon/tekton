/**
 * Mode Detection Module
 * Detects whether to run in standalone or connected mode
 *
 * @module server/mode
 */

import type { ConnectionMode } from "../project/config-types.js";

/**
 * Default timeout for API health check (2 seconds)
 */
const DEFAULT_TIMEOUT = 2000;

/**
 * Default API URL
 */
const DEFAULT_API_URL = "http://localhost:8000";

/**
 * Options for mode detection
 */
export interface ModeOptions {
  /**
   * Force standalone mode regardless of API availability
   */
  forceStandalone?: boolean;

  /**
   * API URL to check for connected mode
   * Falls back to STUDIO_API_URL env var or default
   */
  apiUrl?: string;

  /**
   * Timeout for API health check in milliseconds
   * Default: 2000ms
   */
  timeout?: number;
}

/**
 * Detect the server operation mode
 *
 * Logic:
 * 1. If forceStandalone flag is set, return standalone
 * 2. If API health check succeeds, return connected
 * 3. Otherwise, return standalone
 *
 * @param options - Mode detection options
 * @returns Connection mode (standalone or connected)
 */
export async function detectMode(options: ModeOptions = {}): Promise<ConnectionMode> {
  const { forceStandalone, apiUrl, timeout } = options;

  // Force standalone mode if requested
  if (forceStandalone) {
    return "standalone";
  }

  // Get API URL from options, env, or default
  const effectiveApiUrl = apiUrl || process.env.STUDIO_API_URL || DEFAULT_API_URL;

  // If no API URL configured (empty string after checks), use standalone
  if (!effectiveApiUrl) {
    return "standalone";
  }

  // Check if API is healthy
  const isApiHealthy = await checkApiHealth(effectiveApiUrl, timeout);

  return isApiHealthy ? "connected" : "standalone";
}

/**
 * Check if the studio-api is healthy and reachable
 *
 * @param apiUrl - Base URL of the studio-api
 * @param timeout - Timeout in milliseconds (default: 2000ms)
 * @returns True if API is healthy, false otherwise
 */
export async function checkApiHealth(
  apiUrl: string,
  timeout: number = DEFAULT_TIMEOUT
): Promise<boolean> {
  try {
    const healthUrl = `${apiUrl}/health`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(healthUrl, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return response.ok;
    } catch {
      clearTimeout(timeoutId);
      return false;
    }
  } catch {
    return false;
  }
}
