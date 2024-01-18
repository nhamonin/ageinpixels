import sunIcon from '@/assets/images/themes/light/sun.svg';
import moonIcon from '@/assets/images/themes/dark/moon.svg';

type ToggleThemeProps = {
  checked?: boolean;
  onCheckedChange?: () => void;
};

export const ToggleTheme = ({ checked, onCheckedChange }: ToggleThemeProps) => (
  <button
    className="flex items-center justify-center cursor-pointer w-8 h-8"
    onClick={onCheckedChange}
    aria-label={checked ? 'Activate light mode' : 'Activate dark mode'}
  >
    <img src={checked ? moonIcon : sunIcon} alt={checked ? 'Moon Icon' : 'Sun icon'} />
  </button>
);
