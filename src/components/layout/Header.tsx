import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';

export const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="fixed bg-background flex items-center justify-between top-0 left-0 w-full z-10 text-center px-10 pt-10">
      <h1 className="text-lg font-semibold">Ageinpixels</h1>
      <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
    </header>
  );
};

export default Header;
