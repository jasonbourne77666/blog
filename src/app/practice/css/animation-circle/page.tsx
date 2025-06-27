'use client';
import Image from 'next/image';
import React from 'react';
import styles from './index.module.scss';
import img1 from './avatar/1.jpeg';
import img2 from './avatar/2.jpeg';
import img3 from './avatar/3.jpeg';
import img4 from './avatar/4.jpeg';
import img5 from './avatar/5.jpeg';

const avatarList = [img1, img2, img3, img4, img5];

export default function page() {
  return (
    <div className={styles.component}>
      <div className={`${styles.circle}`}>
        {avatarList.map((item, index) => (
          <div key={index} className={`${styles.item}`}>
            <Image src={item} alt='avatar' />
          </div>
        ))}
      </div>
    </div>
  );
}
