import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthTokens, AuthUser } from '@/services/auth/auth.service';

type AuthState = {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  setSession: (session: { user: AuthUser; tokens: AuthTokens } | null) => void;
  logout: () => void;
  getToken: () => string | null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      getToken: () => get().tokens?.accessToken || null,
      setSession: (session) =>
        set({
          user: session?.user ?? null,
          tokens: session?.tokens ?? null,
          isAuthenticated: Boolean(session?.user && session?.tokens),
        }),
      logout: () => set({ user: null, tokens: null, isAuthenticated: false }),
    }),
    { name: 'scentiment-auth' }
  )
);

