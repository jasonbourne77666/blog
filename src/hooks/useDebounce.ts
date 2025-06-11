import { useState, useMemo } from 'react';
import useDebounceFn from '@/hooks/useDebounceFn';

import type { DebounceOptions } from './useDebounceFn';

const useDebounce = <T>(value: T, options?: DebounceOptions) => {
  const [debounced, setDebounced] = useState(value);

  const run = useDebounceFn((value) => {
    setDebounced(value);
  }, options);

  useMemo(() => {
    run(value);
  }, [value, run]);

  return debounced;
};

export default useDebounce;
