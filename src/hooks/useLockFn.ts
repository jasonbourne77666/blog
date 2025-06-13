/** 竞态锁，防止异步函数并发执行  重复提交*/

import { useState, useCallback } from 'react';

const useLockFn = <P extends any[] = any[], V = any>(
  fn: (...args: P) => Promise<V>,
): [(...args: P) => Promise<V | undefined>, boolean] => {
  const [status, setStatus] = useState(false);

  const f = useCallback(
    async (...args: P) => {
      if (status) return;
      setStatus(true);

      try {
        const ret = await fn(...args);
        setStatus(false);
        return ret;
      } catch (error) {
        setStatus(false);
        throw error;
      }
    },
    [fn, status],
  );

  return [f, status];
};

export default useLockFn;
