'use client';

import { useState, useRef, useEffect } from 'react';
import useDebounceFn from '@/hooks/useDebounceFn';
import useDebounce from '@/hooks/useDebounce';
import useThrottleFn from '@/hooks/useThrottleFn';
import useLockFn from '@/hooks/useLockFn';
import useFullscreen from '@/hooks/useFullscreen';
import useCopy from '@/hooks/useCopy';
import useTextSelection from '@/hooks/useTextSelection';
import useResponsive from '@/hooks/useResponsive';

function wait() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('1');
    }, 2000);
  });
}

export default function Hook() {
  const fullscreenDom = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string>('');
  // 栅格系统-响应式
  const responsive = useResponsive();
  // console.log(responsive);
  // 全屏
  const [targetDom, setTargetDom] = useState<HTMLDivElement | null>(null);
  // 选择文字
  const state = useTextSelection(targetDom as any);
  // 复制
  const [copyText, copy] = useCopy();
  // 防抖
  const run = useDebounceFn(
    () => {
      console.log('useDebounceFn');
    },
    { wait: 1000 },
  );
  const debounceValue = useDebounce(value, { wait: 1000 });

  // 节流
  const throttleRun = useThrottleFn(
    () => {
      console.log('throttleRun');
    },
    { wait: 3000 },
  );

  // 状态锁 防止重复请求
  const [lockFn, lockStatus] = useLockFn(async () => {
    const res = await wait();
  });

  useEffect(() => {
    setTargetDom(fullscreenDom.current!);
  }, []);

  const { isFullscreen, isEnabled, enterFullscreen, exitFullscreen } =
    useFullscreen(targetDom, {
      onEnter: () => {
        console.log('onEnter');
      },
      onExit: () => {
        'onExit';
      },
    });

  return (
    <main className='grid grid-cols-2 gap-4'>
      <div>
        <button className='primary-button' onClick={() => copy('123')}>
          {copyText || 'copyText'}
        </button>
      </div>

      <div ref={fullscreenDom}>
        <button
          className='primary-button'
          type='button'
          onClick={() => {
            enterFullscreen();
          }}
        >
          enterFullscreen
        </button>
        <button
          className='primary-button'
          type='button'
          onClick={() => exitFullscreen()}
        >
          exitFullscreen
        </button>
        <h1>标题</h1>
        <p>文字内容文字内容文字内容文字内容文字内容文字内容</p>
      </div>

      <button className='primary-button' type='button' onClick={() => lockFn()}>
        lockFn
      </button>

      <button className='primary-button' onClick={() => run()}>
        debounce
      </button>

      <button className='primary-button' onClick={() => throttleRun()}>
        throttleRun
      </button>
      <div>
        <input
          placeholder={'useDebounce'}
          type='text'
          onChange={(v) => {
            setValue(v.target.value);
          }}
        />
        <p>{debounceValue}</p>
      </div>
    </main>
  );
}
