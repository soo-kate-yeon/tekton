import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTheme } from '@/lib/api/themes';
import type { ThemeUpdate } from '@/lib/api/types';
import { THEMES_QUERY_KEY } from './useThemes';

export function useUpdateTheme(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ThemeUpdate) => updateTheme(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [THEMES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [THEMES_QUERY_KEY, id] });
    },
  });
}
