import type { NFTInfoProps } from 'src/hooks/useCheckNFTAvailability';

export interface SuperfestNFTStoreProps {
  address?: string;
  claimInfo?: {
    [key: string]: NFTInfoProps;
  };
  timestamp: number;
}

export interface SuperfestNFTState extends SuperfestNFTStoreProps {
  setNFTCheckData: (
    address: string,
    claimInfo: {
      [key: string]: NFTInfoProps;
    },
    time: number,
  ) => void;
}
