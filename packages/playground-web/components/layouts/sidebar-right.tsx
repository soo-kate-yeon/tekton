/**
 * SidebarRightLayout
 * SPEC-PLAYGROUND-001 Milestone 4: Production Layouts
 *
 * Layout: Main content + Sidebar on right
 */

import styles from './layouts.module.css';

export interface SidebarRightLayoutProps {
  main: React.ReactNode;
  sidebar: React.ReactNode;
}

export function SidebarRightLayout({ main, sidebar }: SidebarRightLayoutProps) {
  return (
    <div className={styles.sidebarRight}>
      <main className={styles.sidebarRightMain}>{main}</main>
      <aside className={styles.sidebarRightSidebar}>{sidebar}</aside>
    </div>
  );
}
