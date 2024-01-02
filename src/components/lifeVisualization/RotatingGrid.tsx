import { useRef, useState, useEffect } from 'react';
import { useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three/addons/controls/OrbitControls.js';
import { OrbitControls } from '@react-three/drei';

extend({ OrbitControlsImpl });

type RotatingGridProps = {
  cubes: JSX.Element[];
};

export const RotatingGrid = ({ cubes }: RotatingGridProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const [isOrbiting, setIsOrbiting] = useState(true);

  useEffect(() => {
    const controls = new OrbitControlsImpl(camera, gl.domElement);
    controls.addEventListener('start', () => setIsOrbiting(false));
    controls.addEventListener('end', () => setIsOrbiting(true));
    return () => {
      controls.removeEventListener('start', () => setIsOrbiting(false));
      controls.removeEventListener('end', () => setIsOrbiting(true));
      controls.dispose();
    };
  }, [camera, gl.domElement]);

  useFrame(() => {
    if (groupRef.current && isOrbiting) {
      const rotationSpeed = 0.005;
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      {cubes}
      <OrbitControls />
    </group>
  );
};
