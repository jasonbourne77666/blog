import { useRef, useMemo, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';

/**
 * 响应式数据 类似vue中 reactive
 * @param initialState
 * @returns
 */
const useReactive = <T extends Record<string, any>>(initialState: T): T => {
  const ref = useRef<T>(initialState);
  const [, setFlag] = useState(1); // 仅作为刷新页面，无其他实际意义

  const observer = useCallback(
    <T extends Record<string, any>>(initialVal: T, cb: () => void): T => {
      const proxy = new Proxy<T>(initialVal, {
        get(target, key, receiver) {
          // receiver 设置get的this指向 即指向生成的 proxy 对象
          const res = Reflect.get(target, key, receiver);
          return Object.prototype.toString.call(res) === '[object Object]'
            ? observer(res, cb) // obj.key1.key2
            : Reflect.get(target, key);
        },
        set(target, key, val) {
          const ret = Reflect.set(target, key, val);
          cb();
          return ret;
        },
      });

      return proxy;
    },
    [],
  );

  const state = useMemo(() => {
    return observer(ref.current, () => {
      setFlag((v) => v + 1);
    });
  }, [observer]);

  return state;
};

export default useReactive;
