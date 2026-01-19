import { useQuery } from '@tanstack/react-query';
import { fetchThemes } from '@/lib/api/themes';
import type { ThemeListParams } from '@/lib/api/types';

export const THEMES_QUERY_KEY = 'themes';

export function useThemes(params: ThemeListParams = {}) {
  return useQuery({
    queryKey: [THEMES_QUERY_KEY, params],
    queryFn: () => fetchThemes(params),
  });
}
