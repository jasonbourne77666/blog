import React from 'react';
import { Nav } from '@/app/practice/Nav';
import styles from './layout.module.scss';

const PracticeLayout = (props: React.PropsWithChildren) => {
  return (
    <section className={styles.container}>
      <Nav />
      <main className={styles.main}>{props.children}</main>
      <footer className={styles.footer}>
        <span>Learning never stop</span>
      </footer>
    </section>
  );
};

export default PracticeLayout;
