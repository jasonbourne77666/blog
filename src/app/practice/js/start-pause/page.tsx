'use client';
import React, { useEffect, useState } from 'react';

export default function StartPausePage() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const arr: any[] = [];
    for (let i = 1; i <= 5; i++) {
      arr.push(async () => {
        return new Promise((resolve) => {
          console.log('task', i, 'start');
          setTimeout(() => {
            resolve(i);
            console.log('task', i, 'end');
          }, 1000);
        });
      });
    }
    setTasks(arr);
  }, []);

  function processTasks(...tasks) {
    let isPause = false;
    const result: any[] = [];
    // 得到所有结果前，任务是挂起状态

    return {
      start() {
        return new Promise(async (resolve) => {
          isPause = false;
          while (tasks.length) {
            const task = tasks.shift();
            const res = await task();
            result.push(res);

            if (isPause) {
              break;
            }
          }
          isPause = true;
          resolve(result);
        });
      },
      pause() {
        isPause = true;
      },
    };
  }
  const { start, pause } = processTasks(...tasks);

  return (
    <div className='flex gap-2'>
      <button
        className='px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600'
        onClick={() => {
          start().then((res) => {
            console.log('res', res);
          });
        }}
      >
        开始
      </button>
      <button
        className='px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600'
        onClick={pause}
      >
        暂停
      </button>
    </div>
  );
}
