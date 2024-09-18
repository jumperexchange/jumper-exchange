import { defaultFp } from '@/config/config';
import type { FpState } from 'src/types/fp';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn as create } from 'zustand/traditional';

export const useFpStore = create(
  persist(
    (set, get) => ({
      ...defaultFp,
      setFp: (fp: string) => {
        set({
          fp: fp,
        });
      },
    }),
    {
      name: 'jumper-fp',
      version: 1,
    },
  ) as unknown as StateCreator<FpState, [], [], FpState>,
  shallow,
);
