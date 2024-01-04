import { useTheme } from '@/contexts/ThemeContext';
import { ToggleTheme } from '@/components/ui/toggle-theme';

export const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header
      className="fixed flex items-center justify-between top-0 left-0 w-full z-10 text-center
    px-[var(--padding-x)] pt-[47px] border-b"
    >
      <h1 className="text-lg font-semibold">Ageinpixels</h1>
      <ToggleTheme checked={isDarkMode} onCheckedChange={toggleTheme} />
    </header>
  );
};

export default Header;
