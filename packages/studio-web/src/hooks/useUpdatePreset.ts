import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePreset } from '@/lib/api/presets';
import type { PresetUpdate } from '@/lib/api/types';
import { PRESETS_QUERY_KEY } from './usePresets';

export function useUpdatePreset(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PresetUpdate) => updatePreset(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY, id] });
    },
  });
}
