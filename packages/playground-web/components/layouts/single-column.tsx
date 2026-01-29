/**
 * SingleColumnLayout
 * SPEC-PLAYGROUND-001 Milestone 4: Production Layouts
 *
 * Layout: Single centered column
 */

import styles from './layouts.module.css';

export interface SingleColumnLayoutProps {
  main: React.ReactNode;
}

export function SingleColumnLayout({ main }: SingleColumnLayoutProps) {
  return (
    <div className={styles.singleColumn}>
      <main className={styles.singleColumnMain}>{main}</main>
    </div>
  );
}
