import { loadTheme } from '@tekton/core';
import { ThemeProvider } from '../../components/theme/theme-provider';

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  const theme = loadTheme('atlantic-magazine-v1');

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-[--atomic-semantic-background-canvas] text-[--atomic-color-neutral-900] font-serif">
        {children}
      </div>
    </ThemeProvider>
  );
}
