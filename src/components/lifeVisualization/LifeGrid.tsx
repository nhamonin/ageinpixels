import { Canvas } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';

import { CameraAnimation } from '@/components/lifeVisualization/CameraAnimation';
import { CameraLogger } from '@/components/lifeVisualization/CameraLogger';
import { CameraSetter } from '@/components/lifeVisualization/CameraSetter';
import { CubeWithEdges } from '@/components/lifeVisualization/CubeWidthEdges';
import { useTheme } from '@/contexts/ThemeContext';

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
  const topY = totalLayers - 2 + 1;

  for (let layer = 0; layer < totalLayers; layer++) {
    const isLastLayer = layer === totalLayers - 1;
    const layerCubes = isLastLayer ? Math.ceil(max % cubesPerLayer) : cubesPerLayer;

    for (let i = 0; i < layerCubes; i++) {
      const x = (i % layerSize) - Math.floor(layerSize / 2);
      const y = layer - 2;
      const z = Math.floor(i / layerSize) - Math.floor(layerSize / 2);
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
    <Canvas style={{ width: '100%', height: '50vh' }} shadows>
      <CameraAnimation />
      <CameraSetter />
      <CameraLogger />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 0]}
        intensity={0.7}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-10, -10, -10]} intensity={1} color="white" />
      {cubes}
      <Billboard position={[0, topY, 0]}>
        <Text
          color={isDarkMode ? 'white' : 'black'}
          anchorX="center"
          anchorY="middle"
          fontSize={0.5}
          position={[0, 0, 0]}
        >
          {`${current.toFixed(2)} / ${max.toFixed(2)} years`}
        </Text>
      </Billboard>
    </Canvas>
  );
};
