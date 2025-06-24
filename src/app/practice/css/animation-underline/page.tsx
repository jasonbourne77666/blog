'use client';

import Image from 'next/image';
import styles from './AnimationUnderline.module.scss';
import bg from './img/bg.jpeg';
import title from './img/back1.png';
import hero from './img/back2.png';
import cardBg from './img/back3.jpg';

const AnimationUnderline: React.FC<any> = () => {
  return (
    <div className={styles.component} style={{ paddingTop: 20 }}>
      <div className='flex flex-col gap-4'>
        <div className='bg-card p-4 rounded-lg'>
          <h2 className={styles.title}>
            <span>
              背景色 hover移入：从左到右，hover移出：从左到右 直至结束
            </span>
          </h2>
        </div>
        <div className='bg-card p-4 rounded-lg'>
          <div className={styles.opacity}>
            <div>
              <h1>磨砂效果-磨砂效果-滤镜</h1>
              <div className={styles.cover}></div>
            </div>
            <div className={styles.img}>
              <Image width={384} height={240} src={bg} alt='' />
              <div className={styles.hover} />
            </div>
          </div>
        </div>
        <div className='bg-card p-4 rounded-lg'>
          <Image
            style={{ display: 'none' }}
            className={styles.cover1}
            width={384}
            height={240}
            src={cardBg}
            alt=''
          />
          <div className={styles.threed}>
            <Image
              className={styles.cover}
              width={200}
              height={240}
              src={cardBg}
              alt=''
            />

            <Image
              className={styles.hero}
              width={384}
              height={240}
              src={hero}
              alt=''
            />
            <Image
              className={styles.title}
              width={384}
              height={240}
              src={title}
              alt=''
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationUnderline;
