import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

import { CameraLogger } from '@/components/lifeVisualization/CameraLogger';
import { CameraSetter } from '@/components/lifeVisualization/CameraSetter';
import { RotatingGrid } from '@/components/lifeVisualization/RotatingGrid';
import { Controls } from '@/components/lifeVisualization/Controls';
import { useUserData } from '@/contexts/UserDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useHoverTransform } from '@/hooks/useHoverTransform';
import { useResponsiveCanvasDimensions } from '@/hooks/useResponsiveCanvasDimensions';
import { formatNumber, calculateAge } from '@/lib/utils';

export const AgeVisualization = () => {
  const { isDarkMode } = useTheme();
  const { userData } = useUserData();
  const { transform, handleMouseMove, handleMouseEnter, handleMouseLeave } = useHoverTransform();
  const { canvasHeight, canvasWidth } = useResponsiveCanvasDimensions();

  const { birthDate, lifeExpectancy } = userData;
  const currentAge = birthDate ? calculateAge(birthDate) : 0;
  const layerSize = Math.round(Math.cbrt(lifeExpectancy));
  const cubesPerLayer = layerSize * layerSize;
  const totalLayers = Math.ceil(lifeExpectancy / cubesPerLayer);
  const light = useRef<THREE.DirectionalLight>(null);

  return (
    <section className="flex flex-col justify-center overflow-hidden items-center max-h-[var(--content-height)] sm:min-w-auto sm:min-h-auto relative">
      {lifeExpectancy > 0 && (
        <p
          className="hidden sm:block absolute text-xl animate-levitate top-2"
          style={{
            transform,
            transition: 'transform 0.2s ease-out',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {formatNumber(currentAge)} / {formatNumber(lifeExpectancy)} years
        </p>
      )}
      <Canvas
        className="cursor-pointer z-[1]"
        style={{
          height: canvasHeight,
          width: canvasWidth,
          transform,
          transition: 'transform 0.2s ease-out',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        shadows
      >
        <CameraSetter totalLayers={totalLayers} />
        <CameraLogger />
        <ambientLight intensity={2} />
        <directionalLight ref={light} intensity={10} color={isDarkMode ? '#4656e0' : '#ffe187'} />
        <RotatingGrid
          lifeExpectancy={lifeExpectancy}
          currentAge={currentAge}
          directionalLight={light}
        />
      </Canvas>
      <Controls />
    </section>
  );
};
