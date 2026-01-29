/**
 * TwoColumnLayout
 * SPEC-PLAYGROUND-001 Milestone 4: Production Layouts
 *
 * Layout: Two equal columns
 */

import styles from './layouts.module.css';

export interface TwoColumnLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function TwoColumnLayout({ left, right }: TwoColumnLayoutProps) {
  return (
    <div className={styles.twoColumn}>
      <div className={styles.twoColumnLeft}>{left}</div>
      <div className={styles.twoColumnRight}>{right}</div>
    </div>
  );
}
