import { useEffect } from 'react';

export function useThemeInitializer() {
  useEffect(() => {
    const html = document.documentElement;

    setTimeout(() => {
      html.classList.add('transition-enabled');
    }, 0);
  }, []);
}
