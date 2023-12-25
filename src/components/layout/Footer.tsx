import { LifePercentage } from '@/components/lifeVisualization/LifePercentage';

export const Footer = () => {
  return (
    <footer className="fixed bg-white bottom-0 left-0 w-full z-10 p-5 pb-11">
      <LifePercentage />
    </footer>
  );
};

export default Footer;
