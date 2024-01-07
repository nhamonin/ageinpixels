import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

import { useCameraContext } from '@/contexts/CameraContext';
import { basePosition, baseRotation } from '@/constants/cameraSettings';

export const CameraSetter = ({ totalLayers }: { totalLayers: number }) => {
  const { camera } = useThree();
  const { setCamera } = useCameraContext();

  useEffect(() => {
    const baseLayers = 5;
    const distanceMultiplier = totalLayers / baseLayers;
    const newPosition = basePosition.clone().multiplyScalar(distanceMultiplier);

    camera.position.copy(newPosition);
    camera.rotation.copy(baseRotation);

    camera.updateProjectionMatrix();

    setCamera(camera);
  }, [camera, totalLayers, setCamera]);

  return null;
};
