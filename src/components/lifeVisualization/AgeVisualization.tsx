import { Canvas } from '@react-three/fiber';

import { CameraLogger } from '@/components/lifeVisualization/CameraLogger';
import { CameraSetter } from '@/components/lifeVisualization/CameraSetter';
import { CubeWithEdges } from '@/components/lifeVisualization/CubeWithEdges';
import { RotatingGrid } from '@/components/lifeVisualization/RotatingGrid';
import { useUserData } from '@/contexts/UserDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { formatNumber, calculateAge } from '@/lib/utils';

export const AgeVisualization = () => {
  const { isDarkMode } = useTheme();
  const { userData } = useUserData();
  const { birthDate, lifeExpectancy } = userData;
  const currentAge = birthDate ? calculateAge(birthDate) : 0;
  const layerSize = Math.round(Math.cbrt(lifeExpectancy));
  const cubesPerLayer = layerSize * layerSize;
  const totalLayers = Math.ceil(lifeExpectancy / cubesPerLayer);
  const cubes = [];

  for (let layer = 0; layer < totalLayers; layer++) {
    const isLastLayer = layer === totalLayers - 1;
    const layerCubes = isLastLayer ? Math.ceil(lifeExpectancy % cubesPerLayer) : cubesPerLayer;

    for (let i = 0; i < layerCubes; i++) {
      const x = (i % layerSize) - Math.floor(layerSize / 2) + 0.5;
      const y = layer - 1.6;
      const z = Math.floor(i / layerSize) - Math.floor(layerSize / 2) + 0.5;
      const cubeIndex = layer * cubesPerLayer + i;
      const isLived = cubeIndex < currentAge;
      const isCurrentYear = cubeIndex === Math.floor(currentAge);
      const fractionalInnerWidth = cubeIndex === Math.ceil(currentAge) - 1 ? currentAge % 1 : 1;
      const fractionalOuterWidth =
        isLastLayer && i === layerCubes - 1 ? lifeExpectancy % 1 || 1 : 1;
      const adjustX = (1 - (isCurrentYear ? fractionalInnerWidth : fractionalOuterWidth)) / 2;

      cubes.push(
        <CubeWithEdges
          key={`cube-${cubeIndex}`}
          position={[x - adjustX, y, z]}
          innerWidth={fractionalInnerWidth}
          outerWidth={fractionalOuterWidth}
          isLived={isLived}
          isDarkMode={isDarkMode}
          isCurrentYear={isCurrentYear}
        />
      );
    }
  }

  return (
    <section className="flex flex-col justify-center items-center sm:min-w-auto sm:min-h-auto relative">
      <p className="text-xl animate-levitate absolute top-10">
        {formatNumber(currentAge)} / {formatNumber(lifeExpectancy)} years
      </p>
      <Canvas
        className="cursor-pointer"
        style={{ height: 'var(--content-height)', width: 'calc(100vw - 680px)' }}
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
    </section>
  );
};
