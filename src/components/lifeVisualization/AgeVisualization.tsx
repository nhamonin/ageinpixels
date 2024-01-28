import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

import { CameraLogger } from '@/components/lifeVisualization/CameraLogger';
import { CameraSetter } from '@/components/lifeVisualization/CameraSetter';
import { RotatingGrid } from '@/components/lifeVisualization/RotatingGrid';
import { Controls } from '@/components/lifeVisualization/Controls';
import { useUserData } from '@/contexts/UserDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useHoverTransform } from '@/hooks/useHoverTransform';
import { useResponsiveCanvasDimensions } from '@/hooks/useResponsiveCanvasDimensions';
import { calculateAge } from '@/lib/utils';
import { useFullScreen } from '@/hooks/useFullScreen';

const AnimatedDirectionalLight = animated.directionalLight;

export const AgeVisualization = () => {
  const { isDarkMode } = useTheme();
  const { userData } = useUserData();
  const { transform, handleMouseMove, handleMouseEnter, handleMouseLeave } = useHoverTransform();
  const { canvasHeight, canvasWidth } = useResponsiveCanvasDimensions();
  const { isFullScreen } = useFullScreen();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 300);
  }, []);

  const { birthDate, lifeExpectancy, globalLifeExpectancy } = userData;
  const lifeExpectancyToUse = lifeExpectancy || globalLifeExpectancy;
  const currentAge = birthDate ? calculateAge(birthDate) : 0;
  const layerSize = Math.round(Math.cbrt(lifeExpectancyToUse));
  const cubesPerLayer = layerSize * layerSize;
  const totalLayers = Math.ceil(lifeExpectancyToUse / cubesPerLayer);
  const light = useRef<THREE.DirectionalLight>(null);
  const lightAnimation = useSpring({
    loop: true,
    to: [{ intensity: 10 }, { intensity: 7 }, { intensity: 10 }],
    from: { intensity: 10 },
    config: { duration: 750 },
  });

  useEffect(() => {
    lightAnimation.intensity.start({ from: 0, to: 10 });
  }, [isDarkMode, lightAnimation.intensity]);

  return (
    <section className="flex flex-col justify-center overflow-hidden items-center max-h-[var(--content-height)] h-[var(--content-height)] md:min-w-auto md:min-h-auto relative">
      {lifeExpectancyToUse > 0 && (
        <>
          <p
            className={`${
              isFullScreen ? 'opacity-100' : 'opacity-0'
            } md:opacity-100 md:block absolute text-xl tabular-nums animate-levitate-sm md:animate-levitate top-2`}
            style={{
              transform,
              transition: `transform 0.2s ease-out, opacity 0.2s ${
                isFullScreen ? '1s' : ''
              } ease-out`,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {currentAge.toFixed(2)} / {lifeExpectancyToUse.toFixed(2)}
          </p>

          <Canvas
            className="cursor-pointer z-[1]"
            style={{
              height: canvasHeight,
              width: canvasWidth,
              transform,
              transition: `transform .2s ease-out, ${
                isMounted && `height .6s ${isFullScreen ? '.3s' : ''} ease-out`
              }`,
              transformOrigin: 'bottom',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            resize={{ debounce: { scroll: 0, resize: 0 } }}
          >
            <CameraSetter totalLayers={totalLayers} />
            <CameraLogger />
            <ambientLight intensity={2} />
            <AnimatedDirectionalLight
              ref={light}
              color={isDarkMode ? '#4656e0' : '#ffe187'}
              {...lightAnimation}
            />
            <RotatingGrid
              lifeExpectancy={lifeExpectancyToUse}
              currentAge={currentAge}
              directionalLight={light}
            />
          </Canvas>
          <Controls />
        </>
      )}

      {isMounted && !lifeExpectancyToUse && (
        <p className="text-center text-lg px-12">
          Oops, we're having trouble retrieving data from the World Health Organization at the
          moment. Check back soon!
        </p>
      )}
    </section>
  );
};
