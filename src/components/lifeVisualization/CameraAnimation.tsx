import { useRef, useState, useEffect, useMemo } from 'react';
import { Vector3 } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export const CameraAnimation = () => {
  const { camera, gl } = useThree();
  const orbitRef = useRef<OrbitControlsImpl>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const initialPosition = useMemo(
    () => new Vector3(4.707337099811188, 3.6236873560133684, 2.5425246562196513),
    []
  );

  useEffect(() => {
    camera.position.copy(initialPosition);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    const controls = orbitRef.current;
    if (controls) {
      const onControlStart = () => setIsAnimating(false);
      const onControlEnd = () => setIsAnimating(true);

      controls.addEventListener('start', onControlStart);
      controls.addEventListener('end', onControlEnd);

      return () => {
        controls.removeEventListener('start', onControlStart);
        controls.removeEventListener('end', onControlEnd);
      };
    }
  }, [camera, orbitRef, setIsAnimating, initialPosition]);

  useFrame(() => {
    if (isAnimating && orbitRef.current) {
      const time = performance.now() * 0.0005;
      const radius = initialPosition.length();
      camera.position.lerp(
        new Vector3(Math.cos(time) * radius, initialPosition.y, Math.sin(time) * radius),
        0.05
      );
      camera.lookAt(0, 0, 0);
      orbitRef.current.update();
    }
  });

  return <DreiOrbitControls ref={orbitRef} args={[camera, gl.domElement]} />;
};
