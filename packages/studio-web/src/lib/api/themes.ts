import { apiClient } from './client';
import type {
  Theme,
  ThemeList,
  ThemeCreate,
  ThemeUpdate,
  ThemeListParams,
} from './types';

const THEMES_ENDPOINT = '/api/v2/themes';

export async function fetchThemes(params: ThemeListParams = {}): Promise<ThemeList> {
  const queryParams: Record<string, string | number | undefined> = {
    skip: params.skip,
    limit: params.limit,
    category: params.category,
    tags: params.tags,
  };
  return apiClient.get<ThemeList>(THEMES_ENDPOINT, { params: queryParams });
}

export async function fetchTheme(id: number): Promise<Theme> {
  return apiClient.get<Theme>(`${THEMES_ENDPOINT}/${id}`);
}

export async function createTheme(data: ThemeCreate): Promise<Theme> {
  return apiClient.post<Theme>(THEMES_ENDPOINT, data);
}

export async function updateTheme(
  id: number,
  data: ThemeUpdate
): Promise<Theme> {
  return apiClient.patch<Theme>(`${THEMES_ENDPOINT}/${id}`, data);
}

export async function deleteTheme(id: number): Promise<void> {
  return apiClient.delete(`${THEMES_ENDPOINT}/${id}`);
}

export async function fetchThemeSuggestions(
  context?: string
): Promise<Theme[]> {
  const params: Record<string, string | undefined> = context ? { context } : {};
  return apiClient.get<Theme[]>(`${THEMES_ENDPOINT}/suggestions`, { params });
}
