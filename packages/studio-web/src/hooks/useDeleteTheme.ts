import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTheme } from '@/lib/api/themes';
import { THEMES_QUERY_KEY } from './useThemes';

export function useDeleteTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTheme(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [THEMES_QUERY_KEY] });
    },
  });
}
