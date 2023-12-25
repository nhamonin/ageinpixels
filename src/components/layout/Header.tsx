import { Switch } from "@/components/ui/switch";

export const Header = () => {
  return (
    <header className="fixed flex items-center justify-between bg-white top-0 left-0 w-full z-10 text-center p-10">
      <h1 className="text-lg font-semibold">Ageinpixels</h1>
      <Switch />
    </header>
  );
};

export default Header;
