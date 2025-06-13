'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * 分时函数 类似react fiber调和
 * @returns
 */
function performChunk(datas, handler: (value?: any, index?: number) => void) {
  if (typeof datas === 'number') {
    datas = { length: datas };
  }
  if (datas.length === 0) return;
  let i = 0;

  function _run() {
    requestIdleCallback((idle) => {
      while (idle.timeRemaining() > 0 && i < datas.length) {
        handler(datas[i], i);
        i++;
      }

      if (i < datas.length) {
        _run();
      }
    });
  }
  _run();
}

const App: React.FunctionComponent = () => {
  const [state, setState] = useState<Array<number>>(
    Array.from({ length: 100000 }, (_, i) => i),
  );

  // 插入dom
  function handle(data, i?: number) {
    const dom = document.getElementById('wrapper');
    const div = document.createElement('div');
    div.textContent = '' + data;
    dom?.appendChild(div);
  }

  const clickHandle = useCallback(() => {
    performChunk(state, handle);
  }, [state]);

  const clickHandleBad = useCallback(() => {
    for (const i of state) {
      handle(i);
    }
  }, [state]);

  return (
    <div>
      <div className='grid grid-cols-2 gap-4'>
        <button onClick={clickHandle}>生成10000个元素 优化后</button>
        <button onClick={clickHandleBad}>生成10000个元素 未优化</button>
      </div>
      <div id='wrapper'></div>
    </div>
  );
};

export default App;
