import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';

export const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem('darkMode') === 'true' ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <header className="fixed flex items-center justify-between top-0 left-0 w-full z-10 text-center p-10">
      <h1 className="text-lg font-semibold">Ageinpixels</h1>
      <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
    </header>
  );
};

export default Header;
