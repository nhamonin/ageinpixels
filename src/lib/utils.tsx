import { MutableRefObject } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as THREE from 'three';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const proxify = (url: string): string => {
  const proxyServerUrl = 'https://corsproxy.io/?';
  return `${proxyServerUrl}${encodeURIComponent(url)}`;
};

export const stringToDate = (dateStr: string) => {
  const parts = dateStr.split('-');
  return new Date(+parts[2], +parts[1] - 1, +parts[0]);
};

export const dateToString = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const dayStr = day < 10 ? `0${day}` : `${day}`;
  const monthStr = month < 10 ? `0${month}` : `${month}`;

  return `${dayStr}-${monthStr}-${year}`;
};

export const formatNumber = (number: number) => {
  const roundedNumber = Math.round(number * 100) / 100;

  return roundedNumber % 1 === 0 ? roundedNumber.toString() : roundedNumber.toFixed(2);
};

export const calculateAge = (birthDateString: string) => {
  const birthDate = stringToDate(birthDateString);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    throw new Error('Invalid birth date string');
  }

  const diffInMilliseconds = today.getTime() - birthDate.getTime();
  const ageInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

  return ageInYears;
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

export const interpolateValue = (start: number, end: number, duration: number) => {
  let startTime: number | null = null;

  return (timestamp: number) => {
    startTime = startTime || timestamp;
    const elapsed = timestamp - startTime;
    if (elapsed < duration) {
      const fraction = elapsed / duration;
      return start + (end - start) * fraction;
    } else {
      return end;
    }
  };
};
