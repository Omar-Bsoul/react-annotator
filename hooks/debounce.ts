import * as React from 'react';

export const useDebounce = (callback: (...args: any) => void, delay: number) => {
  const [debouncing, setDebouncing] = React.useState(false);
  const [callbackArgs, setCallbackArgs] = React.useState<any>(undefined);

  React.useEffect(() => {
    if (debouncing) {
      const id = setTimeout(() => {
        setDebouncing(false);
        callback(...callbackArgs);
      }, delay);
      return () => clearTimeout(id);
    }
  }, [debouncing, callback, delay]);

  const debounce = (...args: any) => {
    setDebouncing(true);
    setCallbackArgs(args);
  };

  const clearDebounce = () => {
    setDebouncing(false);
  };

  return [debounce, clearDebounce];
};
