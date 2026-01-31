import './styles/theme.css';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--rm-bg-canvas)] font-[family-name:var(--rm-font-sans)] text-[var(--rm-color-neutral-900)]">
      <div className="mx-auto max-w-[480px] min-h-screen relative bg-[var(--rm-bg-surface-subtle)] shadow-2xl">
        {children}
      </div>
    </div>
  );
}
