import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

import { useCanvasWidthMultiplier } from '@/hooks/useCanvasWidthMultiplier';
import { useTheme } from '@/contexts/ThemeContext';
import { getCubeMaterial, updateMaterialEmission } from '@/lib/utils';
import { CubeProps } from '@/types';

const lightColor = '#808080';
const darkColor = '#000';

export const CubeWithEdges = ({
  position,
  isLived,
  isCurrentYear,
  innerWidth,
  outerWidth,
}: CubeProps) => {
  const { isDarkMode } = useTheme();
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const canvasWidthMultiplier = useCanvasWidthMultiplier(size.width);

  useFrame(({ clock }) => {
    if (!isCurrentYear || !meshRef.current) return;

    updateMaterialEmission(meshRef.current, clock.elapsedTime);
  });

  const fillMaterial = getCubeMaterial({ isLived, fillColor: lightColor });
  const lineColor = isDarkMode ? lightColor : darkColor;
  const lineMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: lineColor }),
    [lineColor]
  );

  return (
    <mesh
      ref={meshRef}
      position={position.map((x) => x * canvasWidthMultiplier) as [number, number, number]}
      scale={[innerWidth * canvasWidthMultiplier, canvasWidthMultiplier, canvasWidthMultiplier]}
      material={fillMaterial}
    >
      <boxGeometry args={[outerWidth, 1, 1]} />
      <lineSegments material={lineMaterial}>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(outerWidth, 1, 1)]} />
      </lineSegments>
    </mesh>
  );
};
