import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export const CameraLogger = () => {
  const { camera } = useThree();

  useEffect(() => {
    const logCameraSettings = () => {
      console.log('Position:', camera.position);
      console.log('Rotation:', camera.rotation);
      console.log('Zoom:', camera.zoom);
    };

    window.addEventListener('keydown', (e) => {
      if (e.key === 'L' || e.key === 'l') {
        logCameraSettings();
      }
    });

    return () => {
      window.removeEventListener('keydown', logCameraSettings);
    };
  }, [camera]);

  return null;
};
