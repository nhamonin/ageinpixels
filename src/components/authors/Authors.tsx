import { useFullScreen } from '@/hooks/useFullScreen';

export const Authors = () => {
  const { isFullScreen } = useFullScreen();

  return (
    <section
      className={`${
        isFullScreen ? 'flex' : 'hidden'
      } absolute top-[var(--header-height)] left-[var(--padding-x)] pt-1 xl:pt-0 xl:w-full xl:h-full md:flex
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
