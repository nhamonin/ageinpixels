import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraSetter = ({ totalLayers }: { totalLayers: number }) => {
  const { camera } = useThree();

  useEffect(() => {
    const basePosition = new THREE.Vector3(
      4.03831481072017,
      3.2450516781501877,
      -4.443182625869301
    );
    const baseRotation = new THREE.Euler(
      -2.5107905356208997,
      0.6331623306064111,
      2.7336879305903623
    );
    const baseLayers = 4;
    const distanceMultiplier = totalLayers / baseLayers;
    const newPosition = basePosition.clone().multiplyScalar(distanceMultiplier);

    camera.position.copy(newPosition);
    camera.rotation.copy(baseRotation);

    camera.updateProjectionMatrix();
  }, [totalLayers, camera]);

  return null;
};
