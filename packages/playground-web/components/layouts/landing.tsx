/**
 * LandingLayout
 * SPEC-PLAYGROUND-001 Milestone 4: Production Layouts
 *
 * Layout: Header + Main + Footer
 */

import styles from './layouts.module.css';

export interface LandingLayoutProps {
  header?: React.ReactNode;
  main: React.ReactNode;
  footer?: React.ReactNode;
}

export function LandingLayout({ header, main, footer }: LandingLayoutProps) {
  return (
    <div className={styles.landing}>
      {header && <header className={styles.landingHeader}>{header}</header>}
      <main className={styles.landingMain}>{main}</main>
      {footer && <footer className={styles.landingFooter}>{footer}</footer>}
    </div>
  );
}
