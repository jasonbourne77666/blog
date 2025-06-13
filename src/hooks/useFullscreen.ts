import { useState, useCallback, useRef, useEffect } from 'react';
import screenfull from 'screenfull';

interface Options {
  onEnter?: () => void;
  onExit?: () => void;
}

const useFullscreen = (target: HTMLDivElement | null, options?: Options) => {
  const { onEnter, onExit } = options || {};

  const [isFullscreen, setIsFullscreen] = useState(false);

  const onChange = useCallback(() => {
    if (screenfull.isEnabled) {
      const ele = target;
      if (!screenfull.element) {
        onExit?.();
        setIsFullscreen(false);
        screenfull.off('change', onChange);
      } else {
        const isFullscreen = screenfull.element === ele;
        if (isFullscreen) {
          onEnter?.();
        } else {
          onExit?.();
        }
        setIsFullscreen(isFullscreen);
      }
    }
  }, [target, onExit, onEnter]);

  const enterFullscreen = useCallback(() => {
    const ele = target;
    if (!ele) return;
    if (screenfull.isEnabled) {
      screenfull.request(ele);
      screenfull.on('change', onChange);
    }
  }, [onChange, target]);

  const exitFullscreen = useCallback(() => {
    const ele = target;
    if (screenfull.isEnabled && screenfull.element === ele) {
      screenfull.exit();
      onExit?.();
      console.log('exit');
    }
  }, [target, onExit]);

  return {
    isFullscreen,
    isEnabled: screenfull.isEnabled,
    enterFullscreen,
    exitFullscreen,
  };
};

export default useFullscreen;
