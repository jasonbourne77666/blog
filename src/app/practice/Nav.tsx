'use client';

/* Core */
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* Instruments */
import styles from '@/app/practice/layout.module.scss';

export const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link
        className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
        href='/'>
        home
      </Link>
      <Link
        className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
        href='/practice'>
        practice
      </Link>
      <Link
        className={`${styles.link} ${
          pathname === '/practice/hook' ? styles.active : ''
        }`}
        href='/practice/hook'>
        hook
      </Link>
      <Link
        className={`${styles.link} ${
          pathname === '/practice/css' ? styles.active : ''
        }`}
        href='/practice/css'>
        css
      </Link>
      <Link
        className={`${styles.link} ${
          pathname === '/practice/js' ? styles.active : ''
        }`}
        href='/practice/js'>
        js
      </Link>
      <Link
        className={`${styles.link} ${
          pathname === '/practice/svg' ? styles.active : ''
        }`}
        href='/practice/svg'>
        svg
      </Link>
    </nav>
  );
};
