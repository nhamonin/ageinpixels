import { useRef } from 'react';
import * as THREE from 'three';
import { MeshProps, useFrame } from '@react-three/fiber';

type CubeProps = MeshProps & {
  position: [number, number, number];
  isLived: boolean;
  isDarkMode: boolean;
  isCurrentYear: boolean;
  innerWidth: number;
  outerWidth: number;
};

const lightColor = '#eee';
const darkColor = '#666';

export const CubeWithEdges = ({
  position,
  isLived,
  isDarkMode,
  isCurrentYear,
  innerWidth,
  outerWidth,
}: CubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const animatedColor = new THREE.Color(isDarkMode ? lightColor : darkColor);

  useFrame(({ clock }) => {
    if (isCurrentYear && meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      const emissiveIntensity = Math.sin(clock.elapsedTime * 5) * 0.2 + 0.8;

      material.emissiveIntensity = emissiveIntensity;
      material.emissive = animatedColor;
      material.needsUpdate = true;
    }
  });

  const opacity = isLived ? 1 : 0;
  const transparent = !isLived;

  let fillColor = isDarkMode ? lightColor : darkColor;
  if (isCurrentYear) {
    fillColor = isDarkMode ? darkColor : lightColor;
  }

  const fillMaterial = new THREE.MeshStandardMaterial({
    color: fillColor,
    opacity: opacity,
    transparent,
  });
  const lineColor = isDarkMode ? lightColor : darkColor;
  const lineMaterial = new THREE.LineBasicMaterial({
    color: lineColor,
  });

  return (
    <mesh ref={meshRef} position={position} scale={[innerWidth, 1, 1]} material={fillMaterial}>
      <boxGeometry args={[outerWidth, 1, 1]} />
      <lineSegments material={lineMaterial}>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(outerWidth, 1, 1)]} />
      </lineSegments>
    </mesh>
  );
};
