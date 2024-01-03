import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
