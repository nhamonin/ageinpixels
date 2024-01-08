import { useRef, useEffect } from 'react';
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
  const orbitingRef = useRef(true);
  const { camera, gl } = useThree();
  const previousTimeRef = useRef(performance.now());

  useEffect(() => {
    const controls = new OrbitControlsImpl(camera, gl.domElement);

    controls.addEventListener('start', () => (orbitingRef.current = false));
    controls.addEventListener('end', () => (orbitingRef.current = true));
    return () => {
      controls.dispose();
    };
  }, [camera, gl.domElement]);

  useFrame(() => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - previousTimeRef.current) / 1000;
    previousTimeRef.current = currentTime;

    if (groupRef.current && orbitingRef.current) {
      const rotationSpeed = 0.3;
      groupRef.current.rotation.y += rotationSpeed * deltaTime;
    }
  });

  return (
    <group ref={groupRef}>
      {cubes}
      <OrbitControls enablePan={false} />
    </group>
  );
};
