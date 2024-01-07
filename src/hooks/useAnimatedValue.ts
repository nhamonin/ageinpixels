import { useEffect, useState } from 'react';

import { interpolateValue } from '@/lib/utils';

export const useAnimatedValue = (newValue: number, duration = 1000) => {
  const [value, setValue] = useState(newValue);
  useEffect(() => {
    const interpolate = interpolateValue(value, newValue, duration);
    const animate = (time: number) => {
      const interpolatedValue = interpolate(time);
      setValue(interpolatedValue);
      if (interpolatedValue !== newValue) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [newValue, duration, value]);

  return value;
};
