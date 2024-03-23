import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

import { CameraLogger } from '@/components/lifeVisualization/CameraLogger';
import { CameraSetter } from '@/components/lifeVisualization/CameraSetter';
import { RotatingGrid } from '@/components/lifeVisualization/RotatingGrid';
import { Controls } from '@/components/lifeVisualization/Controls';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUserData } from '@/contexts/UserDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useHoverTransform } from '@/hooks/useHoverTransform';
import { useResponsiveCanvasDimensions } from '@/hooks/useResponsiveCanvasDimensions';
import { calculateAge } from '@/lib/utils';
import { useFullScreen } from '@/hooks/useFullScreen';
import { useLifeExpectancy } from '@/hooks/useLifeExpectancy';

const AnimatedDirectionalLight = animated.directionalLight;

export const AgeVisualization = () => {
  const { isDarkMode } = useTheme();
  const { userData } = useUserData();
  const { transform, handleMouseMove, handleMouseEnter, handleMouseLeave } = useHoverTransform();
  const { canvasHeight, canvasWidth } = useResponsiveCanvasDimensions();
  const { isFullScreen } = useFullScreen();
  const { isLoading, error } = useLifeExpectancy();

  const { birthDate, lifeExpectancy, globalLifeExpectancy } = userData;
  const lifeExpectancyToUse = lifeExpectancy || globalLifeExpectancy;
  const layerSize = Math.round(Math.cbrt(lifeExpectancyToUse));
  const cubesPerLayer = layerSize * layerSize;
  const totalLayers = Math.ceil(lifeExpectancyToUse / cubesPerLayer);
  const light = useRef<THREE.DirectionalLight>(null);

  const currentAge = useRef(birthDate ? calculateAge(birthDate) : 0);
  useEffect(() => {
    currentAge.current = birthDate ? calculateAge(birthDate) : 0;
  }, [birthDate]);

  const lightAnimation = useSpring({
    loop: true,
    to: [{ intensity: 10 }, { intensity: 7 }, { intensity: 10 }],
    from: { intensity: 10 },
    config: { duration: 750 },
  });
  useEffect(() => {
    lightAnimation.intensity.start({ from: 0, to: 10 });
  }, [isDarkMode, lightAnimation.intensity]);

  if (isLoading) {
    return (
      <section
        className="flex items-center pt-14 justify-center h-[var(--content-height)]"
        style={{
          height: canvasHeight,
          width: canvasWidth,
        }}
      >
        <LoadingSpinner size={84} />
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex items-center pt-12 justify-center h-[var(--content-height)]">
        <p className="text-center text-lg px-12">
          Oops, we're having trouble retrieving data from the World Health Organization at the
          moment. Check back soon!
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center overflow-hidden items-center max-h-[var(--content-height)] md:min-w-auto md:min-h-auto relative">
      <p
        className={`${
          isFullScreen ? 'opacity-100' : 'opacity-0'
        } md:opacity-100 md:block absolute text-xl tabular-nums animate-levitate-sm md:animate-levitate top-2`}
        style={{
          transform,
          transition: `transform 0.2s ease-out, opacity 0.2s ${isFullScreen ? '1s' : ''} ease-out`,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {currentAge.current.toFixed(2)} / {lifeExpectancyToUse.toFixed(2)}
      </p>

      <Canvas
        className="cursor-pointer z-[1]"
        style={{
          height: canvasHeight,
          width: canvasWidth,
          transform,
          transition: `transform .2s ease-out, height .6s ${isFullScreen ? '.3s' : ''} ease-out`,
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
          currentAge={currentAge.current}
          directionalLight={light}
        />
      </Canvas>
      <Controls />
    </section>
  );
};
