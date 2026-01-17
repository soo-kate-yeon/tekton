import { apiClient } from './client';
import type {
  Preset,
  PresetList,
  PresetCreate,
  PresetUpdate,
  PresetListParams,
} from './types';

const PRESETS_ENDPOINT = '/api/v2/presets';

export async function fetchPresets(params: PresetListParams = {}): Promise<PresetList> {
  const queryParams: Record<string, string | number | undefined> = {
    skip: params.skip,
    limit: params.limit,
    category: params.category,
    tags: params.tags,
  };
  return apiClient.get<PresetList>(PRESETS_ENDPOINT, { params: queryParams });
}

export async function fetchPreset(id: number): Promise<Preset> {
  return apiClient.get<Preset>(`${PRESETS_ENDPOINT}/${id}`);
}

export async function createPreset(data: PresetCreate): Promise<Preset> {
  return apiClient.post<Preset>(PRESETS_ENDPOINT, data);
}

export async function updatePreset(
  id: number,
  data: PresetUpdate
): Promise<Preset> {
  return apiClient.patch<Preset>(`${PRESETS_ENDPOINT}/${id}`, data);
}

export async function deletePreset(id: number): Promise<void> {
  return apiClient.delete(`${PRESETS_ENDPOINT}/${id}`);
}

export async function fetchPresetSuggestions(
  context?: string
): Promise<Preset[]> {
  const params: Record<string, string | undefined> = context ? { context } : {};
  return apiClient.get<Preset[]>(`${PRESETS_ENDPOINT}/suggestions`, { params });
}
