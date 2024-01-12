import { useTheme } from '@/contexts/ThemeContext';
import { ToggleTheme } from '@/components/ui/toggle-theme';
import burgerLight from '@/assets/images/themes/light/burger.svg';
import burgerDark from '@/assets/images/themes/dark/burger.svg';

export const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header
      className="fixed flex items-center justify-between top-0 left-0 w-full text-center
    px-[var(--padding-x)] pt-[36px] sm:pt-[47px] border-b sm:border-none"
    >
      <h1 className="text-lg font-semibold">Ageinpixels</h1>
      <ToggleTheme checked={isDarkMode} onCheckedChange={toggleTheme} />
      <button className="sm:hidden" aria-label="Open menu">
        <img src={isDarkMode ? burgerDark : burgerLight} alt="Burger Icon" />
      </button>
    </header>
  );
};

export default Header;
