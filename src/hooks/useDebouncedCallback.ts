import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback(callback: () => void, delay: number) {
  const debounceRef = useRef<number | null>(null);

  const debouncedCallback = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}
