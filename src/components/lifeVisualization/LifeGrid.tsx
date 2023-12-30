import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { CameraLogger } from '@/components/lifeVisualization/CameraLogger';
import { CameraSetter } from '@/components/lifeVisualization/CameraSetter';
import { CubeWithEdges } from '@/components/lifeVisualization/CubeWidthEdges';
import { useTheme } from '@/contexts/ThemeContext';

type LifeGridProps = {
  max: number;
  current: number;
};

export const LifeGrid = ({ max = 0, current }: LifeGridProps) => {
  const cubes = [];
  const layerSize = Math.round(Math.cbrt(max));
  const cubesPerLayer = layerSize * layerSize;
  const totalLayers = Math.ceil(max / cubesPerLayer);
  const cubesOnLastLayer = max % cubesPerLayer;
  const { isDarkMode } = useTheme();

  for (let layer = 0; layer < totalLayers; layer++) {
    const isLastLayer = layer === totalLayers - 1;
    const layerCubes = isLastLayer && cubesOnLastLayer !== 0 ? cubesOnLastLayer : cubesPerLayer;

    for (let i = 0; i < layerCubes; i++) {
      const x = (i % layerSize) - Math.floor(layerSize / 2);
      const y = layer;
      const z = Math.floor(i / layerSize) - Math.floor(layerSize / 2);
      const cubeIndex = layer * cubesPerLayer + i;
      const isLived = cubeIndex < current;

      cubes.push(
        <CubeWithEdges
          key={`cube-${cubeIndex}`}
          position={[x, y, z]}
          isLived={isLived}
          isDarkMode={isDarkMode}
        />
      );
    }
  }

  return (
    <Canvas style={{ width: '100%', height: '500px' }} shadows>
      <OrbitControls />
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
    </Canvas>
  );
};
