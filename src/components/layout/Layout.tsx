import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { ScrollToTop } from './ScrollToTop';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="page-surface min-h-screen flex flex-col font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-gray-900 focus:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900"
      >
        Skip to content
      </a>
      <Header />
      <CartDrawer />
      <ScrollToTop />
      <main id="main-content" className="flex-grow pt-[108px] text-gray-900">
        {children}
      </main>
      <Footer />
    </div>
  );
}
