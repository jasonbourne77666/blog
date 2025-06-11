import writeText from 'copy-to-clipboard';
import { useCallback, useState } from 'react';

type copyTextProps = string | undefined;
type CopyFn = (text: string) => void; // Return success

const useCopy = (): [copyTextProps, CopyFn] => {
  const [copyText, setCopyText] = useState<copyTextProps>(undefined);

  const copy = useCallback((value?: string | number) => {
    if (!value) return setCopyText('');
    try {
      writeText(value.toString());
      setCopyText(value.toString());
    } catch (err) {
      setCopyText('');
    }
  }, []);

  return [copyText, copy];
};

export default useCopy;
