import React from 'react';

import Line, { LineProps } from '@/components/ui/line';

export const GridBackground: React.FC = () => {
  const lines: LineProps[] = [
    { orientation: 'horizontal', position: 'calc(var(--header-height) - 1px)' },
    { orientation: 'horizontal', position: 'calc(100svh - var(--footer-height))' },

    { orientation: 'vertical', position: 'calc(var(--padding-x) - 1px)' },
    { orientation: 'vertical', position: 'calc(100vw - var(--padding-x))' },

    { orientation: 'vertical', position: 'calc(300px + var(--padding-x))' },
    { orientation: 'vertical', position: 'calc(100svw - 300px - var(--padding-x))' },
  ];

  return (
    <>
      {lines.map((line, index) => (
        <Line key={index} {...line} />
      ))}
    </>
  );
};
