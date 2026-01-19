/**
 * Preset API Client for Tekton CLI
 * Communicates with the studio-api server to fetch preset data
 */

// RequestInit type for fetch options (Node.js 18+ native fetch)
type FetchRequestInit = globalThis.RequestInit;

/**
 * Preset configuration containing design tokens
 */
export interface ThemeConfig {
  [key: string]: unknown;
}

/**
 * Curated Preset response (matches Studio API schema)
 */
export interface CuratedTheme {
  id: number;
  name: string;
  category: string;
  description: string | null;
  config: ThemeConfig;
  tags: string[];
  is_active: boolean;
  one_line_definition: string | null;
  reference_style: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Paginated preset list response
 */
export interface ThemeListResponse {
  items: CuratedTheme[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Preset list parameters
 */
export interface PresetListParams {
  skip?: number;
  limit?: number;
  category?: string;
  tags?: string;
}

/**
 * Preset API Client configuration
 */
export interface ThemeClientConfig {
  baseUrl: string;
  timeout: number;
}

/**
 * API Error class
 */
export class PresetApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `${status} ${statusText}`);
    this.name = 'PresetApiError';
  }
}

/**
 * Preset API Client for fetching preset data
 */
export class ThemeClient {
  private config: ThemeClientConfig;

  constructor(config?: Partial<ThemeClientConfig>) {
    this.config = {
      baseUrl: config?.baseUrl || process.env.API_URL || 'http://localhost:8000',
      timeout: config?.timeout || 5000,
    };
  }

  /**
   * Make HTTP request to Preset API
   */
  private async request<T>(
    endpoint: string,
    options: FetchRequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage: string | undefined;
        try {
          const errorBody = (await response.json()) as { detail?: string; message?: string };
          errorMessage = errorBody.detail || errorBody.message;
        } catch {
          // Ignore JSON parse errors
        }
        throw new PresetApiError(response.status, response.statusText, errorMessage);
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof PresetApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new PresetApiError(408, 'Request Timeout', 'Request timeout');
        }
        throw new PresetApiError(0, 'Network Error', error.message);
      }

      throw new PresetApiError(0, 'Unknown Error', 'Unknown error occurred');
    }
  }

  /**
   * Check if API is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * List all available presets with optional filtering
   */
  async listPresets(params: PresetListParams = {}): Promise<ThemeListResponse> {
    const queryParams = new URLSearchParams();

    if (params.skip !== undefined) {
      queryParams.set('skip', params.skip.toString());
    }
    if (params.limit !== undefined) {
      queryParams.set('limit', params.limit.toString());
    }
    if (params.category) {
      queryParams.set('category', params.category);
    }
    if (params.tags) {
      queryParams.set('tags', params.tags);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/v2/presets${queryString ? `?${queryString}` : ''}`;

    return this.request<ThemeListResponse>(endpoint, { method: 'GET' });
  }

  /**
   * Get a preset by ID
   */
  async getTheme(id: number): Promise<CuratedTheme> {
    return this.request<CuratedTheme>(`/api/v2/presets/${id}`, { method: 'GET' });
  }

  /**
   * Get a preset by name (searches through list)
   * Returns null if not found
   */
  async getPresetByName(name: string): Promise<CuratedTheme | null> {
    try {
      // Fetch all presets (with reasonable limit)
      const response = await this.listPresets({ limit: 100 });

      // Find by exact name match (case-insensitive)
      const preset = response.items.find(
        (p) => p.name.toLowerCase() === name.toLowerCase()
      );

      return preset || null;
    } catch (error) {
      // If API error, propagate it
      if (error instanceof PresetApiError) {
        throw error;
      }
      return null;
    }
  }

  /**
   * Get presets by category
   */
  async getPresetsByCategory(category: string): Promise<CuratedTheme[]> {
    const response = await this.listPresets({ category, limit: 100 });
    return response.items;
  }

  /**
   * Get preset suggestions (if AI-powered endpoint is available)
   */
  async getPresetSuggestions(context?: string): Promise<CuratedTheme[]> {
    try {
      const endpoint = context
        ? `/api/v2/presets/suggestions?context=${encodeURIComponent(context)}`
        : '/api/v2/themes/suggestions';

      return this.request<CuratedTheme[]>(endpoint, { method: 'GET' });
    } catch {
      // Fall back to empty array if suggestions endpoint not available
      return [];
    }
  }
}

/**
 * Default Preset client instance
 */
export const presetClient = new ThemeClient();
