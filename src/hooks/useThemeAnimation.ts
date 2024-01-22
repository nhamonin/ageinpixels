import { RefObject, useEffect, useState } from 'react';
import anime from 'animejs';

import { sunPath, moonPath, raysPaths } from '@/constants/iconPaths';

const white = '#fff';
const black = '#000';

const ANIMATION_DURATION = 200;
const ANIMATION_DELAY = 200;
const ANIMATION_RAY_DELAY = 50;
const ROTATION_ANGLE = -360;
const ROTATION_DELAY = 200;
const ROTATION_DURATION = 400;

export function useThemeAnimation(checked: boolean | undefined, svgRef: RefObject<SVGSVGElement>) {
  const [currentPath, setCurrentPath] = useState(checked ? moonPath : sunPath);
  const [currentRays, setCurrentRays] = useState(checked ? [] : raysPaths);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setCurrentPath(checked ? moonPath : sunPath);

    if (svgRef.current) {
      anime({
        targets: svgRef.current.querySelector('.main-path'),
        d: checked ? moonPath : sunPath,
        fill: checked ? white : black,
        duration: ANIMATION_DURATION,
        easing: 'easeInOutQuad',
        rotate: {
          value: checked ? ROTATION_ANGLE : 0,
          delay: ROTATION_DELAY,
          duration: ROTATION_DURATION,
        },
        complete: function () {
          setRotation(checked ? ROTATION_ANGLE : 0);
        },
      });
    }
  }, [checked, svgRef]);

  useEffect(() => {
    if (checked) return setCurrentRays([]);

    const timeouts = raysPaths.map((rayPath, index) =>
      setTimeout(
        () => {
          setCurrentRays((prevRays) => [...prevRays, rayPath]);
        },
        ANIMATION_DELAY + index * ANIMATION_RAY_DELAY
      )
    );

    return () => timeouts.forEach(clearTimeout);
  }, [checked]);

  return { currentPath, currentRays, rotation };
}
