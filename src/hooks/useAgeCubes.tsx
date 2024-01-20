import { useEffect, useMemo, useState } from 'react';

import { useAnimatedValue } from '@/hooks/useAnimatedValue';
import { CubeWithEdges } from '@/components/lifeVisualization/CubeWithEdges';
import { useTheme } from '@/contexts/ThemeContext';

export const useAgeCubes = ({
  lifeExpectancy,
  currentAge,
}: {
  lifeExpectancy: number;
  currentAge: number;
}) => {
  const { isDarkMode } = useTheme();
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    setStartAnimation(true);
  }, [lifeExpectancy, currentAge]);

  const animatedCurrentAge = useAnimatedValue(startAnimation ? currentAge : 0, 300);
  const animatedLifeExpectancy = useAnimatedValue(startAnimation ? lifeExpectancy : 0, 300);

  const cubes = useMemo(() => {
    const layerSize = 4;
    const cubesPerLayer = layerSize * layerSize;
    const totalLayers = Math.ceil(animatedLifeExpectancy / cubesPerLayer);
    const generatedCubes = [];

    for (let layer = 0; layer < totalLayers; layer++) {
      const isLastLayer = layer === totalLayers - 1;
      const remainingCubes = animatedLifeExpectancy - layer * cubesPerLayer;
      const layerCubes = isLastLayer ? Math.min(remainingCubes, cubesPerLayer) : cubesPerLayer;

      for (let i = 0; i < layerCubes; i++) {
        const x = (i % layerSize) - Math.floor(layerSize / 2) + 0.5;
        const y = layer - 1.2;
        const z = Math.floor(i / layerSize) - Math.floor(layerSize / 2) + 0.5;
        const cubeIndex = layer * cubesPerLayer + i;
        const isLived = cubeIndex < animatedCurrentAge;
        const isCurrentYear = cubeIndex === Math.floor(animatedCurrentAge);
        const fractionalInnerWidth =
          cubeIndex === Math.ceil(animatedCurrentAge) - 1 ? animatedCurrentAge % 1 : 1;
        const fractionalOuterWidth =
          cubeIndex === Math.ceil(animatedLifeExpectancy) - 1
            ? animatedLifeExpectancy - Math.trunc(animatedLifeExpectancy)
            : 1;
        const adjustX = (1 - (isCurrentYear ? fractionalInnerWidth : fractionalOuterWidth)) / 2;

        generatedCubes.push(
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

    return generatedCubes;
  }, [animatedCurrentAge, animatedLifeExpectancy, isDarkMode]);

  return cubes;
};
