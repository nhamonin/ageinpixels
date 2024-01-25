import { useState, useEffect, useRef } from 'react';

const SMALL_SCREEN_WIDTH = 768;
const MEDIUM_SCREEN_WIDTH = 1280;
const SMALL_SCREEN_WIDTH_OFFSET = 0;
const MEDIUM_SCREEN_CANVAS_WIDTH_OFFSET = 302;
const LARGE_SCREEN_CANVAS_WIDTH_OFFSET = 602;
const PADDING_X = 'var(--padding-x)';
const CONTENT_HEIGHT = 'var(--content-height)';

export function useResponsiveCanvasDimensions() {
  const [dimensions, setDimensions] = useState({
    canvasHeight: `calc(${CONTENT_HEIGHT} - var(--questions-height))`,
    canvasWidth: `calc(100vw - 2 * ${PADDING_X})`,
  });

  const questionsRef = useRef<HTMLDivElement | null>(null);

  const updateDimensions = () => {
    const width = window.innerWidth;
    const isSmallScreen = width < SMALL_SCREEN_WIDTH;
    const isMediumScreen = width < MEDIUM_SCREEN_WIDTH;
    const questionsHeight = questionsRef.current ? `${questionsRef.current.clientHeight}px` : '0px';

    const newCanvasHeight = isSmallScreen
      ? `calc(${CONTENT_HEIGHT} - ${questionsHeight})`
      : CONTENT_HEIGHT;
    const canvasWidthOffset = isSmallScreen
      ? SMALL_SCREEN_WIDTH_OFFSET
      : isMediumScreen
      ? MEDIUM_SCREEN_CANVAS_WIDTH_OFFSET
      : LARGE_SCREEN_CANVAS_WIDTH_OFFSET;
    const newCanvasWidth = `calc(100vw - ${canvasWidthOffset}px - 2 * ${PADDING_X})`;

    setDimensions({ canvasHeight: newCanvasHeight, canvasWidth: newCanvasWidth });
  };

  useEffect(() => {
    questionsRef.current = document.getElementById('questions') as HTMLDivElement;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === questionsRef.current) {
          updateDimensions();
        }
      }
    });

    if (questionsRef.current) {
      resizeObserver.observe(questionsRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      if (questionsRef.current) {
        resizeObserver.unobserve(questionsRef.current);
      }
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return { ...dimensions };
}
