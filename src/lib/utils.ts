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
