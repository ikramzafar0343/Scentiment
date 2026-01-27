import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <CartDrawer />
      <main className="flex-grow pt-[120px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
