/**
 * DashboardLayout
 * SPEC-PLAYGROUND-001 Milestone 4: Production Layouts
 *
 * Layout: Header + Sidebar + Main content
 */

import styles from './layouts.module.css';

export interface DashboardLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  main: React.ReactNode;
}

export function DashboardLayout({ header, sidebar, main }: DashboardLayoutProps) {
  return (
    <div className={styles.dashboard}>
      {header && <header className={styles.dashboardHeader}>{header}</header>}
      {sidebar && <aside className={styles.dashboardSidebar}>{sidebar}</aside>}
      <main className={styles.dashboardMain}>{main}</main>
    </div>
  );
}
