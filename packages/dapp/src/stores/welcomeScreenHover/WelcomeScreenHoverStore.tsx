import { createWithEqualityFn } from 'zustand/traditional';

interface WelcomeScreenHoverState {
  welcomeScreenHover: boolean;
  setWelcomeScreenHover: (active: boolean) => void;
}

export const useWelcomeScreenHoverStore =
  createWithEqualityFn<WelcomeScreenHoverState>(
    (set) => ({
      welcomeScreenHover: false,
      setWelcomeScreenHover: (active: boolean) =>
        set({ welcomeScreenHover: active }),
    }),
    Object.is,
  );
