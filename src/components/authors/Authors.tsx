import { useFullScreen } from '@/hooks/useFullScreen';
import { useEffect, useState } from 'react';

const FULL_SCREEN_ANIMATION_DURATION = 900;

export const Authors = () => {
  const { isFullScreen } = useFullScreen();
  const [display, setDisplay] = useState<'flex' | 'hidden'>(isFullScreen ? 'flex' : 'hidden');
  const [opacity, setOpacity] = useState(isFullScreen ? 1 : 0);

  useEffect(() => {
    if (isFullScreen) {
      setDisplay('flex');
      const timer = setTimeout(() => {
        setOpacity(1);
      }, FULL_SCREEN_ANIMATION_DURATION);
      return () => clearTimeout(timer);
    } else {
      setOpacity(0);
      setDisplay('hidden');
    }
  }, [isFullScreen]);

  return (
    <section
      style={{ opacity: opacity, transition: 'opacity 0.3s' }}
      className={`${display} absolute top-[var(--header-height)] left-[var(--padding-x)] pt-1 xl:pt-0 xl:w-full xl:h-full md:flex
      xl:static xl:justify-end xl:items-end justify-self-end gap-1 text-authors text-xs underline pr-[2px] z-20`}
    >
      <a href="https://www.linkedin.com/in/nhamonin/" target="_blank">
        Development
      </a>
      |
      <a href="https://www.linkedin.com/in/solomia-hamonina-40696a248/" target="_blank">
        Design
      </a>
    </section>
  );
};
