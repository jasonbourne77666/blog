"use client";

// import styles from './Interceptor.module.scss';
import { useEffect, useCallback, memo, useRef } from "react";

type AspectFn = (..._p: any[]) => Promise<void>;

class InterceptorClass<T = any> {
  aspects: Array<AspectFn>;

  constructor() {
    this.aspects = [];
  }

  use(functor: AspectFn) {
    this.aspects.push(functor);
  }

  async run(context: T) {
    const aspects = this.aspects;
    const proc = aspects.reduceRight(
      (a, b) => {
        return async () => {
          await b(context, a);
        };
      },
      () => Promise.resolve()
    );

    try {
      await proc();
    } catch (error) {
      console.log(error);
    }

    return context;
  }
}

const Interceptor: React.FC = (props: any) => {
  const ref = useRef<any>(null);
  function wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  const task = useCallback(function (id: number) {
    return async (ctx: any, next: AspectFn) => {
      console.log(`task ${id} begin`);
      ctx.count++;
      await wait(1000);
      console.log(`count: ${ctx.count}`);
      await next();
      console.log(`task ${id} end`);
    };
  }, []);

  useEffect(() => {
    ref.current = new InterceptorClass();
    ref.current.use(task(1));
    ref.current.use(task(2));
    ref.current.use(task(3));
    ref.current.use(task(4));
  }, [task]);

  return (
    <div>
      <button
        onClick={() => {
          ref.current?.run({ count: 0 });
        }}
      >
        洋葱模型
      </button>
      <br />
      <br />
      <button
        onClick={() => {
          // 管道函数
          function pipe(...funcs) {
            const callback = (value, func) => {
              return func(value);
            };

            return function (params) {
              return funcs.reduce(callback, params);
            };
          }
          const funcs = [
            (x) => {
              return x + 1;
            },
            (x) => {
              return x * 2;
            },
            (x) => {
              return x - 2;
            },
          ];

          const compute = pipe(...funcs);
          console.log(compute(10));
        }}
      >
        pipe函数组合
      </button>
      <button
        onClick={() => {
          // 实现一个对象的entries方法，使对象可以被for of 遍历
          const a = { a: 1, b: 2, c: 3 };

          const createRanger = (obj) => {
            const keys = Object.keys(obj);
            let length = keys.length;

            return {
              next() {
                const key = keys.shift() || "";
                const nextValue = obj[key];
                length--;
                return {
                  value: [key, nextValue],
                  done: length < 0,
                };
              },
              [Symbol.iterator]() {
                return this;
              },
            };
          };

          for (const [k, v] of createRanger(a)) {
            console.log(k, v);
          }
        }}
      >
        模拟 Object.entries()
      </button>
    </div>
  );
};

export default memo(Interceptor);
