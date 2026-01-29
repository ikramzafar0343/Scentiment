// Seller layout wrapper that bypasses main layout
import { ReactNode } from 'react';

interface SellerLayoutProps {
  children: ReactNode;
}

export function SellerLayout({ children }: SellerLayoutProps) {
  return <div className="min-h-screen">{children}</div>;
}
