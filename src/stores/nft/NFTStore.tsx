import type { NFTInfo } from 'src/hooks/useCheckNFTAvailability';
import type { NFTState } from 'src/types/NFTStore';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const useNFTStore = createWithEqualityFn(
  persist(
    (set, get) => ({
      address: undefined,
      claimInfo: undefined,
      timestamp: undefined,

      // Loyalty Pass Information
      setNFTCheckData: (
        address: string,
        claimInfo: {
          [key: string]: NFTInfo;
        },
        time: number,
      ) => {
        set({
          address: address,
          claimInfo: claimInfo,
          timestamp: time,
        });
      },
    }),
    {
      name: 'jumper-nft', // name of the item in the storage (must be unique)
      version: 1,
    },
  ) as unknown as StateCreator<NFTState, [], [], NFTState>,
  shallow,
);
