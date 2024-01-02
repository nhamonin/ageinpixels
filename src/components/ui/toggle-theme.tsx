import sunIcon from '@/assets/images/sun.svg';
import moonIcon from '@/assets/images/moon.svg';

type ToggleThemeProps = {
  checked?: boolean;
  onCheckedChange?: () => void;
};

export const ToggleTheme = ({ checked, onCheckedChange }: ToggleThemeProps) => (
  <div className="flex items-center justify-center cursor-pointer w-8 h-8" onClick={onCheckedChange}>
    <img src={checked ? moonIcon : sunIcon} alt={checked ? 'Moon Icon' : 'Sun icon'} />
  </div>
);
