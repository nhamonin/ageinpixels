import * as THREE from 'three';
import { MeshProps } from '@react-three/fiber';

type CubeProps = MeshProps & {
  position: [number, number, number];
  isLived: boolean;
  isDarkMode: boolean;
};

const lightColor = '#ffffff';
const darkColor = '#666';

export const CubeWithEdges = ({ position, isLived, isDarkMode }: CubeProps) => {
  const opacity = +!!isLived;
  const transparent = !isLived;
  const fillColor = !isLived ? lightColor : isDarkMode ? lightColor : darkColor;

  const fillMaterial = new THREE.MeshStandardMaterial({
    color: fillColor,
    opacity: opacity,
    transparent: transparent,
  });
  const lineMaterial = new THREE.LineBasicMaterial({
    color: isDarkMode ? lightColor : darkColor,
  });

  return (
    <mesh position={position} material={fillMaterial}>
      <boxGeometry args={[1, 1, 1]} />
      <lineSegments material={lineMaterial}>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
      </lineSegments>
    </mesh>
  );
};
