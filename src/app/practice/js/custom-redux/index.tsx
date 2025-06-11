import { useEffect, useState, useContext } from "react";
import { createStore } from "./custom-redux/mini-redux";
import { counter, add, remove } from "./custom-redux/store";

const store = createStore(counter);

export default function CustomRedux() {
  const [, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const state = store.getState();

  useEffect(() => {
    setCount(state.count);
  }, [state.count]);

  return (
    <div>
      <h1>{count}</h1>
      <button
        onClick={() => {
          store.dispatch(add());
          setIndex((v) => v + 1);
        }}
      >
        ADD
      </button>
      <button
        onClick={() => {
          store.dispatch(remove());
          setIndex((v) => v - 1);
        }}
      >
        REMOVE
      </button>
    </div>
  );
}
