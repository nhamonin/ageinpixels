import { RefObject, useEffect, useState } from 'react';
import anime from 'animejs';

import { moonPath, rays, sunPath } from '@/constants/iconPaths';

const white = '#fff';
const black = '#000';

const ANIMATION_DURATION = 200;
const ANIMATION_DELAY = 200;
const ANIMATION_RAY_DELAY = 50;

export function useThemeAnimation(checked: boolean | undefined, svgRef: RefObject<SVGSVGElement>) {
  const [currentPath, setCurrentPath] = useState(checked ? moonPath : sunPath);
  const [currentRays, setCurrentRays] = useState(checked ? [] : rays);

  useEffect(() => {
    setCurrentPath(checked ? moonPath : sunPath);

    if (svgRef.current) {
      anime({
        targets: svgRef.current.querySelector('.main-path'),
        d: checked ? moonPath : sunPath,
        fill: checked ? white : black,
        duration: ANIMATION_DURATION,
        easing: 'easeInOutQuad',
      });
    }
  }, [checked, svgRef]);

  useEffect(() => {
    if (checked) return setCurrentRays([]);

    const timeouts = rays.map((rayPath, index) =>
      setTimeout(
        () => {
          setCurrentRays((prevRays) => [...prevRays, rayPath]);
        },
        ANIMATION_DELAY + index * ANIMATION_RAY_DELAY
      )
    );

    return () => timeouts.forEach(clearTimeout);
  }, [checked]);

  return { currentPath, currentRays };
}
