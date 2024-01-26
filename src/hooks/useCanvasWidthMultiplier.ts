import { useEffect, useState } from 'react';

export const useCanvasWidthMultiplier = (width: number) => {
  const [canvasWidthMultiplier, setCanvasWidthMultiplier] = useState(1);

  useEffect(() => {
    const calculateCanvasWidthMultiplier = (width: number) => {
      const minCanvasWidth = 300;
      const maxCanvasWidth = 1500;
      const minMultiplier = 0.7;
      const maxMultiplier = 1;

      const clampedWidth = Math.max(minCanvasWidth, Math.min(width, maxCanvasWidth));
      return (
        minMultiplier +
        (maxMultiplier - minMultiplier) *
          ((clampedWidth - minCanvasWidth) / (maxCanvasWidth - minCanvasWidth))
      );
    };

    setCanvasWidthMultiplier(calculateCanvasWidthMultiplier(width));
  }, [width]);

  return canvasWidthMultiplier;
};
