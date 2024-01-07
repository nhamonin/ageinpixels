import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as THREE from 'three';

import { CubeWithEdges } from '@/components/lifeVisualization/CubeWithEdges';
import { MutableRefObject } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const proxify = (url: string): string => {
  const proxyServerUrl = 'https://corsproxy.io/?';
  return `${proxyServerUrl}${encodeURIComponent(url)}`;
};

export const parseDate = (dateStr: string) => {
  const parts = dateStr.split('-');
  return new Date(+parts[2], +parts[1] - 1, +parts[0]);
};

export const formatNumber = (number: number) => {
  const roundedNumber = Math.round(number * 100) / 100;

  return roundedNumber % 1 === 0 ? roundedNumber.toString() : roundedNumber.toFixed(2);
};

export const calculateAge = (birthDateString: string) => {
  const birthDate = parseDate(birthDateString);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    throw new Error('Invalid birth date string');
  }

  const diffInMilliseconds = today.getTime() - birthDate.getTime();
  const ageInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

  return ageInYears;
};

export const generateCubes = ({
  lifeExpectancy,
  isDarkMode,
  currentAge,
}: {
  lifeExpectancy: number;
  isDarkMode: boolean;
  currentAge: number;
}) => {
  const layerSize = Math.round(Math.cbrt(lifeExpectancy));
  const cubesPerLayer = layerSize * layerSize;
  const totalLayers = Math.ceil(lifeExpectancy / cubesPerLayer);
  const cubes = [];

  for (let layer = 0; layer < totalLayers; layer++) {
    const isLastLayer = layer === totalLayers - 1;
    const remainingCubes = lifeExpectancy - layer * cubesPerLayer;
    const layerCubes = isLastLayer ? Math.min(remainingCubes, cubesPerLayer) : cubesPerLayer;

    for (let i = 0; i < layerCubes; i++) {
      const x = (i % layerSize) - Math.floor(layerSize / 2) + 0.5;
      const y = layer - 1.2;
      const z = Math.floor(i / layerSize) - Math.floor(layerSize / 2) + 0.5;
      const cubeIndex = layer * cubesPerLayer + i;
      const isLived = cubeIndex < currentAge;
      const isCurrentYear = cubeIndex === Math.floor(currentAge);
      const fractionalInnerWidth = cubeIndex === Math.ceil(currentAge) - 1 ? currentAge % 1 : 1;
      const fractionalOuterWidth =
        cubeIndex === Math.ceil(lifeExpectancy) - 1
          ? lifeExpectancy - Math.trunc(lifeExpectancy)
          : 1;
      const adjustX = (1 - (isCurrentYear ? fractionalInnerWidth : fractionalOuterWidth)) / 2;

      cubes.push(
        <CubeWithEdges
          key={`cube-${cubeIndex}`}
          position={[x - adjustX, y, z]}
          innerWidth={fractionalInnerWidth}
          outerWidth={fractionalOuterWidth}
          isLived={isLived}
          isDarkMode={isDarkMode}
          isCurrentYear={isCurrentYear}
        />
      );
    }
  }

  return cubes;
};

export const createMarkup = (htmlContent: string) => {
  return { __html: htmlContent };
};

export const smoothThreeTransition = (
  cameraRef: MutableRefObject<THREE.Camera | null>,
  targetPosition: THREE.Vector3,
  targetRotation?: THREE.Euler,
  duration: number = 200
) => {
  let start: number | null = null;
  if (!cameraRef.current) return;

  const initialPosition = cameraRef.current.position.clone();

  let initialQuaternion: THREE.Quaternion | undefined;
  let targetQuaternion: THREE.Quaternion | undefined;
  if (targetRotation) {
    initialQuaternion = cameraRef.current.quaternion.clone();
    targetQuaternion = new THREE.Quaternion().setFromEuler(targetRotation);
  }

  const step = (timestamp: number) => {
    if (!cameraRef.current) return;

    if (start === null) start = timestamp;
    const progress = timestamp - start;
    const fraction = Math.min(progress / duration, 1);

    cameraRef.current.position.lerpVectors(initialPosition, targetPosition, fraction);

    if (targetQuaternion) {
      cameraRef.current.quaternion.slerpQuaternions(
        initialQuaternion as THREE.Quaternion,
        targetQuaternion as THREE.Quaternion,
        fraction
      );
    }

    if (fraction < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};
