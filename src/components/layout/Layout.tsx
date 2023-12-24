import React from 'react';
import { LifePercentage } from '../lifeVisualization/LifePercentage';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-10 text-center p-5">Header</header>

      <main className="w-full flex flex-col items-center mx-auto overflow-auto pt-[var(--header-height)] pb-[var(--footer-height)] px-5">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 w-full z-10 p-5 pb-11">
        <LifePercentage />
      </footer>
    </div>
  );
};
