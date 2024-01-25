import { useState, useEffect } from 'react';

import { useFullScreen } from './useFullScreen';

const SMALL_SCREEN_WIDTH = 768;
const MEDIUM_SCREEN_WIDTH = 1280;
const SMALL_SCREEN_WIDTH_OFFSET = 0;
const MEDIUM_SCREEN_CANVAS_WIDTH_OFFSET = 302;
const LARGE_SCREEN_CANVAS_WIDTH_OFFSET = 602;
const CONTENT_HEIGHT = 'var(--content-height)';
const CONTENT_WIDTH = 'var(--content-width)';
const QUESTIONS_SELECTOR = '#questions';
const PARENT_CONTAINER_SELECTOR = 'main';

export function useResponsiveCanvasDimensions() {
  const [dimensions, setDimensions] = useState({
    canvasHeight: CONTENT_HEIGHT,
    canvasWidth: CONTENT_WIDTH,
  });
  const { isFullScreen, toggleFullScreen } = useFullScreen();

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const isSmallScreen = width < SMALL_SCREEN_WIDTH;
      const isMediumScreen = width < MEDIUM_SCREEN_WIDTH;

      if (isFullScreen && !isSmallScreen) {
        toggleFullScreen();
      }

      const questionsElement = document.querySelector(QUESTIONS_SELECTOR);
      const questionsHeight = `${questionsElement?.clientHeight || 0}px`;

      const newCanvasHeight = isSmallScreen
        ? `calc(${CONTENT_HEIGHT} - ${questionsHeight})`
        : CONTENT_HEIGHT;
      const canvasWidthOffset = isSmallScreen
        ? SMALL_SCREEN_WIDTH_OFFSET
        : isMediumScreen
        ? MEDIUM_SCREEN_CANVAS_WIDTH_OFFSET
        : LARGE_SCREEN_CANVAS_WIDTH_OFFSET;
      const newCanvasWidth = `calc(${CONTENT_WIDTH} - ${canvasWidthOffset}px)`;

      setDimensions({ canvasHeight: newCanvasHeight, canvasWidth: newCanvasWidth });
    };

    updateDimensions();

    const parentContainer = document.querySelector(PARENT_CONTAINER_SELECTOR);
    if (!parentContainer) {
      console.error('Parent container not found');
      return;
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          updateDimensions();
        }
      }
    });

    observer.observe(parentContainer, { childList: true, subtree: true });

    window.addEventListener('resize', updateDimensions);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullScreen]);

  return { ...dimensions };
}
