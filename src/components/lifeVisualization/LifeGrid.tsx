import { Canvas } from '@react-three/fiber';

import { CameraLogger } from '@/components/lifeVisualization/CameraLogger';
import { CameraSetter } from '@/components/lifeVisualization/CameraSetter';
import { CubeWithEdges } from '@/components/lifeVisualization/CubeWithEdges';
import { RotatingGrid } from '@/components/lifeVisualization/RotatingGrid';
import { useTheme } from '@/contexts/ThemeContext';
import { formatNumber } from '@/lib/utils';

type LifeGridProps = {
  max: number;
  current: number;
};

export const LifeGrid = ({ max, current }: LifeGridProps) => {
  const cubes = [];
  const layerSize = Math.round(Math.cbrt(max));
  const cubesPerLayer = layerSize * layerSize;
  const totalLayers = Math.ceil(max / cubesPerLayer);
  const { isDarkMode } = useTheme();

  for (let layer = 0; layer < totalLayers; layer++) {
    const isLastLayer = layer === totalLayers - 1;
    const layerCubes = isLastLayer ? Math.ceil(max % cubesPerLayer) : cubesPerLayer;

    for (let i = 0; i < layerCubes; i++) {
      const x = (i % layerSize) - Math.floor(layerSize / 2) + 0.5;
      const y = layer - 1.6;
      const z = Math.floor(i / layerSize) - Math.floor(layerSize / 2) + 0.5;
      const cubeIndex = layer * cubesPerLayer + i;
      const isLived = cubeIndex < current;
      const isCurrentYear = cubeIndex === Math.floor(current);
      const fractionalInnerWidth = cubeIndex === Math.ceil(current) - 1 ? current % 1 : 1;
      const fractionalOuterWidth = isLastLayer && i === layerCubes - 1 ? max % 1 || 1 : 1;
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
    <>
      <p className="text-xl animate-levitate">
        {formatNumber(current)} / {formatNumber(max)} years
      </p>
      <Canvas style={{ height: '50svh', width: '50vw', minWidth: '600px' }} shadows>
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
    </>
  );
};
