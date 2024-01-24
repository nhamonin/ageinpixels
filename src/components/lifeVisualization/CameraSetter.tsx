import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

import { useCameraContext } from '@/contexts/CameraContext';
import { basePosition, baseRotation } from '@/constants/cameraSettings';

export const CameraSetter = ({ totalLayers }: { totalLayers: number }) => {
  const { camera, size } = useThree();
  const { setCamera } = useCameraContext();

  const calculateCanvasWidthMultiplier = (width: number) => {
    const minCanvasWidth = 300;
    const maxCanvasWidth = 1500;
    const minMultiplier = 0.8;
    const maxMultiplier = 1.3;

    const clampedWidth = Math.max(minCanvasWidth, Math.min(width, maxCanvasWidth));

    return (
      maxMultiplier -
      (maxMultiplier - minMultiplier) *
        ((clampedWidth - minCanvasWidth) / (maxCanvasWidth - minCanvasWidth))
    );
  };

  useEffect(() => {
    const canvasWidthMultiplier = calculateCanvasWidthMultiplier(size.width);

    const baseLayers = 5;
    const distanceMultiplier = (totalLayers / baseLayers) * canvasWidthMultiplier;
    const newPosition = basePosition.clone().multiplyScalar(distanceMultiplier);

    camera.position.copy(newPosition);
    camera.rotation.copy(baseRotation);

    camera.updateProjectionMatrix();

    setCamera(camera);
  }, [camera, totalLayers, setCamera, size.width]);

  return null;
};
