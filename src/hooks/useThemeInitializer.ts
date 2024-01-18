import { useEffect } from 'react';

export function useThemeInitializer(checked: boolean | undefined) {
  useEffect(() => {
    const gridBackground = document.querySelector('body');

    if (!gridBackground) return;

    gridBackground.classList.remove('animate-rays');

    setTimeout(() => {
      gridBackground.classList.add('animate-rays');
    }, 10);
  }, [checked]);
}
