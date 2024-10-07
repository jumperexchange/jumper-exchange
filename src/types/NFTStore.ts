import type { NFTInfo } from 'src/hooks/useCheckNFTAvailability';

export interface NFTStoreProps {
  address?: string;
  claimInfo?: {
    [key: string]: NFTInfo;
  };
  timestamp: number;
}

export interface NFTState extends NFTStoreProps {
  setNFTCheckData: (
    address: string,
    claimInfo: {
      [key: string]: NFTInfo;
    },
    time: number,
  ) => void;
}
