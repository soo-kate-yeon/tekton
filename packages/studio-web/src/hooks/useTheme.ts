import { useQuery } from '@tanstack/react-query';
import { fetchTheme } from '@/lib/api/themes';
import { THEMES_QUERY_KEY } from './useThemes';

export function useTheme(id: number) {
  return useQuery({
    queryKey: [THEMES_QUERY_KEY, id],
    queryFn: () => fetchTheme(id),
    enabled: id > 0,
  });
}
