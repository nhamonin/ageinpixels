import { useRef } from 'react';

import { useThemeInitializer } from '@/hooks/useThemeInitializer';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { useThemeAnimation } from '@/hooks/useThemeAnimation';

const black = '#000';

const DEBOUNCE_DELAY = 400;

export const ToggleTheme = ({
  checked,
  onCheckedChange,
}: {
  checked?: boolean;
  onCheckedChange: () => void;
}) => {
  useThemeInitializer(checked);

  const svgRef = useRef<SVGSVGElement>(null);
  const handleCheckedChange = useDebouncedCallback(onCheckedChange, DEBOUNCE_DELAY);
  const { currentPath, currentRays, rotation } = useThemeAnimation(checked, svgRef);

  return (
    <button
      className="flex items-center justify-center cursor-pointer w-8 h-8"
      onClick={handleCheckedChange}
      aria-label={checked ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <svg ref={svgRef} width="32" height="32" viewBox="0 0 32 32">
        <path
          className="main-path origin-center"
          d={currentPath}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        {currentRays.map((d: string, index: number) => (
          <path key={index} className="ray" d={d} fill={black} />
        ))}
      </svg>
    </button>
  );
};
