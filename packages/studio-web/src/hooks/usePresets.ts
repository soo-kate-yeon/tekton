import { useQuery } from '@tanstack/react-query';
import { fetchPresets } from '@/lib/api/presets';
import type { PresetListParams } from '@/lib/api/types';

export const PRESETS_QUERY_KEY = 'presets';

export function usePresets(params: PresetListParams = {}) {
  return useQuery({
    queryKey: [PRESETS_QUERY_KEY, params],
    queryFn: () => fetchPresets(params),
  });
}
