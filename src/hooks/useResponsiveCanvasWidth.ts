import { useState, useEffect } from 'react';

export function useResponsiveCanvasWidth() {
  const [canvasWidth, setCanvasWidth] = useState('calc(100vw - 2 * var(--padding-x))');

  useEffect(() => {
    function handleResize() {
      setCanvasWidth(
        window.innerWidth < 768
          ? 'calc(100vw - 2 * var(--padding-x))'
          : 'calc(100vw - 602px - 2 * var(--padding-x))'
      );
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return canvasWidth;
}
