import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';

import { CameraLogger } from '@/components/lifeVisualization/CameraLogger';
import { CameraSetter } from '@/components/lifeVisualization/CameraSetter';
import { RotatingGrid } from '@/components/lifeVisualization/RotatingGrid';
import { Controls } from '@/components/lifeVisualization/Controls';
import { useUserData } from '@/contexts/UserDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useHoverTransform } from '@/hooks/useHoverTransform';
import { formatNumber, calculateAge, generateCubes } from '@/lib/utils';

export const AgeVisualization = () => {
  const { isDarkMode } = useTheme();
  const { userData } = useUserData();
  const { transform, handleMouseMove, handleMouseEnter, handleMouseLeave } = useHoverTransform();
  const { birthDate, lifeExpectancy } = userData;
  const currentAge = birthDate ? calculateAge(birthDate) : 0;
  const layerSize = Math.round(Math.cbrt(lifeExpectancy));
  const cubesPerLayer = layerSize * layerSize;
  const totalLayers = Math.ceil(lifeExpectancy / cubesPerLayer);

  const cubes = useMemo(
    () => generateCubes({ lifeExpectancy, isDarkMode, currentAge }),
    [lifeExpectancy, isDarkMode, currentAge]
  );

  return (
    <section className="flex flex-col justify-center overflow-hidden items-center sm:min-w-auto sm:min-h-auto relative">
      {lifeExpectancy > 0 && (
        <p
          className="text-xl animate-levitate absolute top-2"
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
        className="cursor-pointer"
        style={{
          height: 'var(--content-height)',
          width: 'calc(100vw - 600px - 2 * var(--padding-x))',
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
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[-5, 3, -2]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={500}
          shadow-mapSize-height={500}
        />
        <RotatingGrid cubes={cubes} />
      </Canvas>
      <Controls />
    </section>
  );
};
