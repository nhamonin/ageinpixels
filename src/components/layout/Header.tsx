import { useTheme } from '@/contexts/ThemeContext';
import { ToggleTheme } from '@/components/ui/toggle-theme';

export const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header
      className="fixed flex items-center justify-between top-0 left-0 w-full text-center
    px-[var(--padding-x)] pt-[31px] sm:pt-[47px] border-b sm:border-none"
    >
      <h1 className="text-lg font-semibold">Ageinpixels</h1>
      <ToggleTheme checked={isDarkMode} onCheckedChange={toggleTheme} />
    </header>
  );
};

export default Header;
