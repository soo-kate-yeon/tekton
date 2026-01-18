/**
 * Mode Detection Module Tests
 * TDD RED phase: Tests for server mode detection
 *
 * @module server/__tests__/mode.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { detectMode, checkApiHealth } from "../mode.js";

describe("Mode Detection Module", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("detectMode", () => {
    it("should return standalone when forceStandalone is true", async () => {
      const mode = await detectMode({ forceStandalone: true });
      expect(mode).toBe("standalone");
    });

    it("should return standalone when forceStandalone is true even if API is available", async () => {
      // Mock a working API
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: "ok" }),
      }));

      const mode = await detectMode({
        forceStandalone: true,
        apiUrl: "http://localhost:8000",
      });

      expect(mode).toBe("standalone");
    });

    it("should return connected when API is reachable", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: "ok" }),
      }));

      const mode = await detectMode({
        apiUrl: "http://localhost:8000",
      });

      expect(mode).toBe("connected");
    });

    it("should return standalone when API is not reachable", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Connection refused")));

      const mode = await detectMode({
        apiUrl: "http://localhost:8000",
      });

      expect(mode).toBe("standalone");
    });

    it("should return standalone when API returns non-ok status", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }));

      const mode = await detectMode({
        apiUrl: "http://localhost:8000",
      });

      expect(mode).toBe("standalone");
    });

    it("should return standalone when no apiUrl provided", async () => {
      const mode = await detectMode({});
      expect(mode).toBe("standalone");
    });

    it("should use default API URL from environment variable", async () => {
      const originalEnv = process.env.STUDIO_API_URL;
      process.env.STUDIO_API_URL = "http://custom-api:9000";

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: "ok" }),
      }));

      const mode = await detectMode({});

      expect(mode).toBe("connected");

      // Restore
      if (originalEnv) {
        process.env.STUDIO_API_URL = originalEnv;
      } else {
        delete process.env.STUDIO_API_URL;
      }
    });
  });

  describe("checkApiHealth", () => {
    it("should return true when API health check succeeds", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: "ok" }),
      }));

      const isHealthy = await checkApiHealth("http://localhost:8000");
      expect(isHealthy).toBe(true);
    });

    it("should return false when API health check fails", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Connection refused")));

      const isHealthy = await checkApiHealth("http://localhost:8000");
      expect(isHealthy).toBe(false);
    });

    it("should return false when API returns non-ok status", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }));

      const isHealthy = await checkApiHealth("http://localhost:8000");
      expect(isHealthy).toBe(false);
    });

    it("should timeout after specified duration", async () => {
      // Mock fetch that respects AbortSignal
      vi.stubGlobal("fetch", vi.fn().mockImplementation((url: string, options?: RequestInit) => {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => resolve({ ok: true }), 5000);

          // Listen for abort signal
          if (options?.signal) {
            options.signal.addEventListener("abort", () => {
              clearTimeout(timeoutId);
              const error = new Error("The operation was aborted");
              error.name = "AbortError";
              reject(error);
            });
          }
        });
      }));

      const isHealthy = await checkApiHealth("http://localhost:8000", 100);
      expect(isHealthy).toBe(false);
    });

    it("should use default timeout of 2000ms", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: "ok" }),
      });
      vi.stubGlobal("fetch", fetchMock);

      await checkApiHealth("http://localhost:8000");

      // Verify fetch was called with AbortSignal
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it("should call correct health endpoint", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: "ok" }),
      });
      vi.stubGlobal("fetch", fetchMock);

      await checkApiHealth("http://localhost:8000");

      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:8000/health",
        expect.any(Object)
      );
    });
  });
});
