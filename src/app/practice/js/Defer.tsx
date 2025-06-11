import React, { useState, useEffect } from 'react';

// 任务分段

const useDefer = (maxCount: number = 100) => {
  const [count, setCount] = React.useState(1);
  let refId;

  const updateCount = () => {
    refId = requestAnimationFrame(() => {
      setCount((s) => s + 1);
      if (count >= maxCount) {
        return;
      }
      updateCount();
    });
  };
  if (typeof window !== 'undefined') {
    updateCount();
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(refId);
    };
  }, [refId]);

  const defer = (n: number) => {
    return count >= n;
  };

  return defer;
};

const App: React.FunctionComponent = () => {
  const defer = useDefer(100);
  return (
    <div>
      {new Array(200).fill(0).map((_, i) => {
        if (defer(i)) {
          return <div key={i}>{i}</div>;
        }
      })}
    </div>
  );
};

export default App;
