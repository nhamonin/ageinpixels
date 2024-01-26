import { useEffect, useState } from 'react';

import Line, { LineProps } from '@/components/ui/line';
import { useResponsiveCanvasDimensions } from '@/hooks/useResponsiveCanvasDimensions';
import { useFullScreen } from '@/hooks/useFullScreen';

const ANIMATION_DELAY = 1300;

export const GridBackground = () => {
  const { canvasHeight } = useResponsiveCanvasDimensions();
  const { isFullScreen } = useFullScreen();
  const [hidden, setHidden] = useState(!isFullScreen);

  useEffect(() => {
    if (isFullScreen) {
      setHidden(true);
    } else {
      const timer = setTimeout(() => {
        setHidden(false);
      }, ANIMATION_DELAY);
      return () => clearTimeout(timer);
    }
  }, [isFullScreen]);

  const lines: LineProps[] = [
    { orientation: 'horizontal', position: 'calc(var(--header-height) - 1px)' },
    { orientation: 'horizontal', position: 'calc(100svh - var(--footer-height))' },
    {
      orientation: 'horizontal',
      position: `calc(100svh - var(--footer-height) - ${canvasHeight})`,
      customClass: `${hidden ? 'hidden' : 'block'}`,
    },
    {
      orientation: 'horizontal',
      position: `calc(100svh - var(--footer-height) - ${canvasHeight} - 140px)`,
      customClass: `${hidden ? 'hidden' : 'block'}`,
    },

    { orientation: 'vertical', position: 'calc(var(--padding-x) - 1px)', customClass: 'block' },
    { orientation: 'vertical', position: 'calc(100vw - var(--padding-x))', customClass: 'block' },
    {
      orientation: 'vertical',
      position: 'calc(300px + var(--padding-x))',
      customClass: 'hidden md:block',
    },
    {
      orientation: 'vertical',
      position: 'calc(100svw - 150px - var(--padding-x))',
      customClass: 'hidden xl:block',
    },
    {
      orientation: 'vertical',
      position: 'calc(100svw - 301px - var(--padding-x))',
      customClass: 'hidden xl:block',
    },
  ];

  return (
    <>
      {lines.map((line, index) => (
        <Line key={index} {...line} />
      ))}
    </>
  );
};
