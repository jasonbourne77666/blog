import { useState, useRef, useEffect } from 'react';

interface RectProps {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
}

interface StateProps extends RectProps {
  text: string;
}

const initRect: RectProps = {
  top: NaN,
  left: NaN,
  bottom: NaN,
  right: NaN,
  height: NaN,
  width: NaN,
};

const initState: StateProps = {
  text: '',
  ...initRect,
};

const getRectSelection = (
  selection: Selection | null,
): RectProps | Record<string, any> => {
  const range = selection?.getRangeAt(0);
  if (range) {
    const { height, width, top, left, right, bottom } =
      range.getBoundingClientRect();
    return { height, width, top, left, right, bottom };
  }
  return {};
};

const useTextSelection = (
  target: Document | HTMLDivElement = document,
): StateProps => {
  const [state, setState] = useState(initState);
  const lastRef = useRef(state);

  useEffect(() => {
    if (!target) return;

    const mdown = () => {
      if (!window.getSelection) return;
      if (lastRef.current.text) setState({ ...initState });
      const select = window.getSelection();
      select?.removeAllRanges();
    };

    const mUp = () => {
      if (!window.getSelection) return;
      const select = window.getSelection();
      const text = select?.toString() || '';

      if (text) setState({ ...state, text, ...getRectSelection(select) });
    };

    target.addEventListener('mousedown', mdown);
    target.addEventListener('mouseup', mUp);

    return () => {
      target?.removeEventListener('mousedown', mdown);
      target?.removeEventListener('mouseup', mUp);
    };
  }, [target, state]);

  return state;
};

export default useTextSelection;
