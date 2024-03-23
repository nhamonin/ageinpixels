import { useAnimatedValue } from '@/hooks/useAnimatedValue';
import { CubeWithEdges } from '@/components/lifeVisualization/CubeWithEdges';

export const useAgeCubes = ({
  lifeExpectancy,
  currentAge,
}: {
  lifeExpectancy: number;
  currentAge: number;
}) => {
  const animatedLifeExpectancy = useAnimatedValue(lifeExpectancy, 2000);
  const animatedCurrentAge = useAnimatedValue(currentAge, 2000);
  const cubes = [];

  const layerSize = 4;
  const cubesPerLayer = layerSize * layerSize;
  const totalLayers = Math.ceil(animatedLifeExpectancy / cubesPerLayer);

  for (let layer = 0; layer < totalLayers; layer++) {
    const isLastLayer = layer === totalLayers - 1;
    const remainingCubes = animatedLifeExpectancy - layer * cubesPerLayer;
    const layerCubes = isLastLayer ? Math.min(remainingCubes, cubesPerLayer) : cubesPerLayer;

    for (let i = 0; i < layerCubes; i++) {
      const cubeIndex = layer * cubesPerLayer + i;
      const isLived = cubeIndex < animatedCurrentAge;
      const isCurrentYear = cubeIndex === Math.floor(animatedCurrentAge);
      const fractionalInnerWidth =
        cubeIndex === Math.ceil(animatedCurrentAge) - 1 ? animatedCurrentAge % 1 : 1;
      const fractionalOuterWidth =
        cubeIndex === Math.ceil(animatedLifeExpectancy) - 1
          ? animatedLifeExpectancy - Math.trunc(animatedLifeExpectancy)
          : 1;
      const initialX = (i % layerSize) - Math.floor(layerSize / 2) + 0.5;
      const adjustX = (1 - (isCurrentYear ? fractionalInnerWidth : fractionalOuterWidth)) / 2;
      const x = initialX - adjustX;
      const y = layer - 1.2;
      const z = Math.floor(i / layerSize) - Math.floor(layerSize / 2) + 0.5;

      cubes.push(
        <CubeWithEdges
          key={cubeIndex}
          position={[x, y, z]}
          isLived={isLived}
          isCurrentYear={isCurrentYear}
          innerWidth={fractionalInnerWidth}
          outerWidth={fractionalOuterWidth}
        />
      );
    }
  }

  return cubes;
};
