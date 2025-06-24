'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './index.module.scss';

const Progress: React.FC<any> = () => {
  const length: number = 2 * Math.PI * 100;
  const [lengthOffset, setLengthOffset] = useState<number>(2 * Math.PI * 100);
  const timer = useRef<any>(null);

  const rate = Number(((1 - lengthOffset / length) * 100).toFixed(0));

  useEffect(() => {
    timer.current = setInterval(() => {
      setLengthOffset((v) => {
        let left = v - 20;
        if (left < 0) {
          left = 0;
          clearInterval(timer.current);
        }
        return left;
      });
    }, 100);
  }, []);

  return (
    <div className={styles.component}>
      <p className={styles.tips}>inset: 0; margin: auto; 水平垂直居中</p>
      <svg width={300} height={300} className={styles.osvg}>
        <circle
          className={styles.ocircle}
          cx={150}
          cy={150}
          r={100}
          fill={'transparent'}
          strokeWidth={12}
          stroke={'#999'}
          style={{
            strokeDasharray: length,
            strokeDashoffset: lengthOffset,
          }}
        />
        <text
          x={150}
          y={150}
          fontSize={24}
          fill={'#999'}
          textAnchor={'middle'}
          alignmentBaseline={'middle'}
        >
          {`${rate} %`}
        </text>
      </svg>
    </div>
  );
};

export default Progress;
