import { useEffect } from 'react';

import Line, { LineProps } from '@/components/ui/line';

const FLASHES_AMOUNT_PER_LINE = 3;
const ANIMATIONS_DURATION = 3500;
const ANIMATION_DELAY = 100;

export const GridBackground = () => {
  const lines: LineProps[] = [
    { orientation: 'horizontal', position: 'calc(var(--header-height) - 1px)' },
    { orientation: 'horizontal', position: 'calc(100svh - var(--footer-height))' },

    { orientation: 'vertical', position: 'calc(var(--padding-x) - 1px)' },
    { orientation: 'vertical', position: 'calc(100vw - var(--padding-x))' },

    { orientation: 'vertical', position: 'calc(300px + var(--padding-x))' },
    { orientation: 'vertical', position: 'calc(100svw - 150px - var(--padding-x))' },
    { orientation: 'vertical', position: 'calc(100svw - 300px - var(--padding-x))' },
  ];

  useEffect(() => {
    const triggerFlash = () => {
      const lineElements = document.querySelectorAll('.line');

      lineElements.forEach((line) => {
        const numberOfFlashes = Math.floor(Math.random() * FLASHES_AMOUNT_PER_LINE) + 1;

        for (let i = 0; i < numberOfFlashes; i++) {
          const randomDelay = Math.random() * ANIMATIONS_DURATION;

          setTimeout(() => {
            line.classList.add('animate-flash');

            setTimeout(() => line.classList.remove('animate-flash'), ANIMATION_DELAY);
          }, randomDelay);
        }
      });
    };

    triggerFlash();
  }, []);

  return (
    <>
      {lines.map((line, index) => (
        <Line key={index} {...line} />
      ))}
    </>
  );
};
