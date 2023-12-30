import { LifePercentage } from '@/components/lifeVisualization/LifePercentage';

export const Footer = () => {
  return (
    <footer className="fixed bg-background bottom-0 left-0 w-full z-10 px-10 pb-10">
      <LifePercentage />
    </footer>
  );
};

export default Footer;
