import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPreset } from '@/lib/api/presets';
import type { PresetCreate } from '@/lib/api/types';
import { PRESETS_QUERY_KEY } from './usePresets';

export function useCreatePreset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PresetCreate) => createPreset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
    },
  });
}
