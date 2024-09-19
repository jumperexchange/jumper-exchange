import type { NFTInfoProps } from 'src/hooks/useCheckNFTAvailability';
import type { SuperfestNFTState } from 'src/types/SuperfestNFTStore';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const useSuperfestNFTStore = createWithEqualityFn(
  persist(
    (set) => ({
      address: undefined,
      claimInfo: undefined,
      timestamp: undefined,

      // Loyalty Pass Information
      setNFTCheckData: (
        address: string,
        claimInfo: {
          [key: string]: NFTInfoProps;
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
      name: 'jumper-superfest-nft', // name of the item in the storage (must be unique)
      version: 1,
    },
  ) as unknown as StateCreator<SuperfestNFTState, [], [], SuperfestNFTState>,
  shallow,
);
