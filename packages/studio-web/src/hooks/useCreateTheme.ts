import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTheme } from '@/lib/api/themes';
import type { ThemeCreate } from '@/lib/api/types';
import { THEMES_QUERY_KEY } from './useThemes';

export function useCreateTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ThemeCreate) => createTheme(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [THEMES_QUERY_KEY] });
    },
  });
}
