import React from 'react';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="w-full flex flex-col items-center mx-auto overflow-auto pt-[var(--header-height)] pb-[var(--footer-height)] px-5">
        {children}
      </main>

      <Footer />
    </div>
  );
};
