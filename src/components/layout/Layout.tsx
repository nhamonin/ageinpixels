import React from 'react';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <Header />

      <main className="grid grid-cols-[300px_1fr_300px] items-center justify-items-center h-[var(--content-height)] overflow-auto mt-[var(--header-height)] mb-[var(--footer-height)] px-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};
