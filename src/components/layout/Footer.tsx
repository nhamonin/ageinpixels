import { LifePercentage } from '@/components/lifeVisualization/LifePercentage';

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-10 px-[var(--padding-x)] pb-10 border-t">
      <LifePercentage />
    </footer>
  );
};

export default Footer;
