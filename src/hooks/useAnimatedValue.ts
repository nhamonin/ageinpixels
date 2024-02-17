import { useEffect, useState, useRef } from 'react';

export const useAnimatedValue = (newValue: number, duration: number = 1000) => {
  const [value, setValue] = useState(0);

  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const previousValueRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = undefined;
    previousValueRef.current = value;

    const animate = (currentTime: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = currentTime;
      }

      const elapsedTime = currentTime - startTimeRef.current;
      const fraction = Math.min(elapsedTime / duration, 1);

      const newValueProgress =
        previousValueRef.current + (newValue - previousValueRef.current) * fraction;

      setValue(newValueProgress);

      if (fraction < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newValue, duration]);

  return value;
};
