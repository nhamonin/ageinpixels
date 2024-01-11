import { LifePercentage } from '@/components/lifeVisualization/LifePercentage';

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full px-[var(--padding-x)] pb-[25px]">
      <LifePercentage />
    </footer>
  );
};

export default Footer;
