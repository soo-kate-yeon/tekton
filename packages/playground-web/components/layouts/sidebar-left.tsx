/**
 * SidebarLeftLayout
 * SPEC-PLAYGROUND-001 Milestone 4: Production Layouts
 *
 * Layout: Sidebar on left + Main content
 */

import styles from './layouts.module.css';

export interface SidebarLeftLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
}

export function SidebarLeftLayout({ sidebar, main }: SidebarLeftLayoutProps) {
  return (
    <div className={styles.sidebarLeft}>
      <aside className={styles.sidebarLeftSidebar}>{sidebar}</aside>
      <main className={styles.sidebarLeftMain}>{main}</main>
    </div>
  );
}
