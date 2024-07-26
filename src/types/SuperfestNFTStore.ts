import { NFTInfo } from 'src/hooks/useCheckFestNFTAvailability';

export interface SuperfestNFTStoreProps {
  address?: string;
  claimInfo?: {
    [key: string]: NFTInfo;
  };
  timestamp: number;
}

export interface SuperfestNFTState extends SuperfestNFTStoreProps {
  setNFTCheckData: (
    address: string,
    claimInfo: {
      [key: string]: NFTInfo;
    },
    time: number,
  ) => void;
}
