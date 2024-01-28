import { TypeAnimation } from 'react-type-animation';

import { useTheme } from '@/contexts/ThemeContext';
import { ToggleTheme } from '@/components/ui/toggle-theme';

const CURSOR_CLASS_NAME = 'custom-type-animation-cursor';

export const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header
      className="fixed flex items-center justify-between top-0 left-0 w-full text-center
    px-[var(--padding-x)] pt-[31px] sm:pt-[47px] border-b sm:border-none"
    >
      <TypeAnimation
        cursor={false}
        sequence={[
          1500,
          (el) => el?.classList.add(CURSOR_CLASS_NAME),
          'Life is short',
          1500,
          'Digitize your years with us',
          1500,
          'Ageinpixels',
          (el) => el?.classList.remove(CURSOR_CLASS_NAME),
          3000,
        ]}
        wrapper="h1"
        speed={40}
        preRenderFirstString={true}
        className={`text-lg font-semibold ${CURSOR_CLASS_NAME}`}
      />

      <ToggleTheme checked={isDarkMode} onCheckedChange={toggleTheme} />
    </header>
  );
};

export default Header;
