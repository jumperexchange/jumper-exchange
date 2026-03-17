import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const REFERRER_STORAGE_KEY = 'jumper_referrer';

interface ReferrerStore {
  referrer: string | undefined;
  setReferrer: (referrer: string | undefined) => void;
}

export const useReferrerStore = create<ReferrerStore>()(
  persist(
    (set) => ({
      referrer: undefined,
      setReferrer: (referrer) => set({ referrer }),
    }),
    {
      name: REFERRER_STORAGE_KEY,
      storage: {
        getItem: (name) => {
          try {
            const str = sessionStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    },
  ),
);
