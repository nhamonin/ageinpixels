import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export const CameraSetter = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(3.922178698889387, 5.610373488685257, 6.225743344296638);
    camera.rotation.set(-0.7334540753607448, 0.43772247223484645, 0.3648764749113862);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};
