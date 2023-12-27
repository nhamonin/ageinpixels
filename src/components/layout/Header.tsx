import { useEffect, useState } from 'react';

import { Switch } from '@/components/ui/switch';

export const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedPreference = localStorage.getItem('darkMode');
    if (storedPreference !== null) {
      console.log('storedPreference', storedPreference);
      return storedPreference === 'true';
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <header className="fixed bg-white dark:bg-black flex items-center justify-between top-0 left-0 w-full z-10 text-center px-10 pt-10">
      <h1 className="text-lg font-semibold">Ageinpixels</h1>
      <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
    </header>
  );
};

export default Header;
