import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export const CameraSetter = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(3.8234145434976132, 3.0723651726468892, -4.2067371830615246);
    camera.rotation.set(-2.5107905356208997, 0.6331623306064111, 2.7336879305903623);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};
