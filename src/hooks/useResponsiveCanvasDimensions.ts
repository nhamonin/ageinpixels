import { useState, useEffect } from 'react';

export function useResponsiveCanvasDimensions() {
  const [canvasHeight, setCanvasHeight] = useState(
    'calc(var(--content-height) - var(--questions-height))'
  );
  const [canvasWidth, setCanvasWidth] = useState('calc(100vw - 2 * var(--padding-x))');

  useEffect(() => {
    function handleResize() {
      setCanvasHeight(
        window.innerWidth < 768
          ? 'calc(var(--content-height) - var(--questions-height))'
          : 'var(--content-height)'
      );

      setCanvasWidth(
        window.innerWidth < 768
          ? 'calc(100vw - 2 * var(--padding-x))'
          : 'calc(100vw - 302px - 2 * var(--padding-x))'
      );

      setCanvasHeight(window.innerWidth < 1280 ? 'var(--content-height)' : 'var(--content-height)');

      setCanvasWidth(
        window.innerWidth < 1280
          ? 'calc(100vw - 302px - 2 * var(--padding-x))'
          : 'calc(100vw - 602px - 2 * var(--padding-x))'
      );
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { canvasHeight, canvasWidth };
}
