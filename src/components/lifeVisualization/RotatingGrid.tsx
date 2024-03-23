import { useRef, useEffect, RefObject } from 'react';
import { useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three/addons/controls/OrbitControls.js';

import { basePosition as baseCameraPosition } from '@/constants/cameraSettings';
import { basePosition as baseLightPosition } from '@/constants/lightSettings';

import { useAgeCubes } from '@/hooks/useAgeCubes';

extend({ OrbitControlsImpl });

type RotatingGridProps = {
  lifeExpectancy: number;
  currentAge: number;
  directionalLight: RefObject<THREE.DirectionalLight>;
};

const lightPositionOffset = baseCameraPosition.clone().sub(baseLightPosition);

export const RotatingGrid = ({
  lifeExpectancy,
  currentAge,
  directionalLight,
}: RotatingGridProps) => {
  const cubes = useAgeCubes({ lifeExpectancy, currentAge });
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

  useFrame(({ camera }) => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - previousTimeRef.current) / 1000;
    previousTimeRef.current = currentTime;

    if (groupRef.current && orbitingRef.current) {
      const rotationSpeed = 0.2;
      groupRef.current.rotation.y += rotationSpeed * deltaTime;
    }

    if (directionalLight.current) {
      const offsetTransformed = lightPositionOffset.clone().applyMatrix4(camera.matrixWorld);
      directionalLight.current.position.copy(camera.position).add(offsetTransformed);
      directionalLight.current.rotation.copy(camera.rotation);
    }
  });

  return (
    <group ref={groupRef}>
      {cubes}
      <OrbitControls enablePan={false} />
    </group>
  );
};
