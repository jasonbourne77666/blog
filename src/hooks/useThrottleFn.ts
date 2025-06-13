import { useRef, useMemo, useEffect } from 'react';
import { throttle } from 'lodash';

type noop = (...arg: any[]) => any;

export interface ThrottleOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

const useThrottleFn = <T extends noop>(fn: T, options?: ThrottleOptions) => {
  const fnRef = useRef<noop>(fn);

  const throttled = useMemo(
    () =>
      throttle(
        (...args: Parameters<T>): ReturnType<T> => fnRef.current(...args),
        options?.wait ?? 0,
        options || {},
      ),
    [options],
  );

  useEffect(() => {
    return () => {
      throttled.cancel();
    };
  }, [throttled]);

  return throttled;
};

export default useThrottleFn;
