import { useQuery } from '@tanstack/react-query';
import { fetchPreset } from '@/lib/api/presets';
import { PRESETS_QUERY_KEY } from './usePresets';

export function usePreset(id: number) {
  return useQuery({
    queryKey: [PRESETS_QUERY_KEY, id],
    queryFn: () => fetchPreset(id),
    enabled: id > 0,
  });
}
