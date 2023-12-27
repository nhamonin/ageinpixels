import React from 'react';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black dark:text-white">
      <Header />

      <main className="w-full flex flex-col items-center justify-center mx-auto overflow-auto mt-[var(--header-height)] mb-[var(--footer-height)] px-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};
