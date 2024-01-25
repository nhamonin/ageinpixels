import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

import { useCanvasWidthMultiplier } from '@/hooks/useCanvasWidthMultiplier';
import { getCubeMaterial, updateMaterialEmission } from '@/lib/utils';
import { CubeProps } from '@/types';

const lightColor = '#808080';
const darkColor = '#000';

export const CubeWithEdges = ({
  position,
  isLived,
  isDarkMode,
  isCurrentYear,
  innerWidth,
  outerWidth,
}: CubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const canvasWidthMultiplier = useCanvasWidthMultiplier(size.width);

  useFrame(({ clock }) => {
    if (isCurrentYear && meshRef.current) {
      updateMaterialEmission(meshRef.current, clock.elapsedTime);
    }
  });

  const fillMaterial = getCubeMaterial({ isLived, fillColor: lightColor });
  const lineColor = isDarkMode ? lightColor : darkColor;
  const lineMaterial = new THREE.LineBasicMaterial({ color: lineColor });

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
