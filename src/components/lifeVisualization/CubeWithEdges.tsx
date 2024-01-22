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
  const animatedColor = new THREE.Color('#777');

  useFrame(({ clock }) => {
    if (isCurrentYear && meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      const emissiveIntensity = Math.sin(clock.elapsedTime * 3.5) * 0.2 + 0.8;

      material.emissiveIntensity = emissiveIntensity;
      material.emissive = animatedColor;
      material.needsUpdate = true;
      material.roughness = 0.5;
      material.metalness = 0.2;
    }
  });

  const opacity = isLived ? 1 : 0;
  const transparent = !isLived;

  let fillColor = lightColor;
  if (isCurrentYear) {
    fillColor = lightColor;
  }

  const fillMaterial = new THREE.MeshStandardMaterial({
    color: fillColor,
    opacity: opacity,
    transparent,
    roughness: 0.5,
    metalness: 0.2,
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
