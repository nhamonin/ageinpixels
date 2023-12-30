import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export const CameraSetter = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(4.707337099811188, 3.6236873560133684, 2.5425246562196513);
    camera.rotation.set(-0.9499862757038413, 0.8337948398292025, 0.8028147398328144);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};
