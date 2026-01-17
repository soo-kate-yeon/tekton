import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePreset } from '@/lib/api/presets';
import { PRESETS_QUERY_KEY } from './usePresets';

export function useDeletePreset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePreset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
    },
  });
}
