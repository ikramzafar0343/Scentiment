// Seller store for managing seller state
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Seller {
  id: string;
  name: string;
  email: string;
  registrationNumber?: string;
  isVerified?: boolean;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
}

interface SellerState {
  seller: Seller | null;
  isAuthenticated: boolean;
  setSeller: (seller: Seller | null) => void;
  logout: () => void;
}

export const useSellerStore = create<SellerState>()(
  persist(
    (set) => ({
      seller: null,
      isAuthenticated: false,
      setSeller: (seller) => set({ seller, isAuthenticated: !!seller }),
      logout: () => set({ seller: null, isAuthenticated: false }),
    }),
    {
      name: 'scentiment-seller',
    }
  )
);
