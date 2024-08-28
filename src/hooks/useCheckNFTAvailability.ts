'use client';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { availableNFT } from './querries/superfestNFT';
import { superfestNFTCheck } from './querries/superfestNFTCheck';
import { useAccounts } from './useAccounts';
import { GALXE_ENDPOINT } from 'src/const/urls';

export interface NFTInfo {
  isClaimable: boolean;
  isClaimed: boolean;
  claimingAddress: string;
  cid: string;
  numberId: number;
  signature?: string;
  cap?: number;
  verifyIds?: number;
  powahs?: number;
  NFTAddress?: string;
}

export interface UseCheckNFTAvailabilityRes {
  claimInfo: NFTInfo;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export interface UseCheckNFTAvailabilityProps {
  chain: string;
}

interface PrepareParticipate {
  allow: boolean;
  disallowReason: string;
  signature: string;
  spaceStation: string;
  mintFuncInfo: MintFuncInfo;
}

interface MintFuncInfo {
  cap: number;
  powahs: number[];
  verifyIDs: number[];
  nftCoreAddress: string;
}

interface GalxeGraphqlRes {
  prepareParticipate: PrepareParticipate;
}

interface GalxeGraphqlCheckRes {
  campaign: {
    numberID: number;
    participationStatus: string;
  };
}

const SECONDS_IN_A_DAY = 86400;
const NFTInfo = {
  mode: {
    cid: 'GCrKqtkcEs',
    numberId: 307092,
  },
  optimism: {
    cid: 'GCRvqtkGne',
    numberId: 307088,
  },
  base: {
    cid: 'GCQHCtkVUa',
    numberId: 307083,
  },
  fraxtal: {
    cid: 'GCSUCtkvFs',
    numberId: 307084,
  },
  box: {
    cid: 'GCwbetvgWp',
    numberId: 309901,
  },
} as { [key: string]: { cid: string; numberId: number } };

export const useCheckNFTAvailability = ({
  chain,
}: UseCheckNFTAvailabilityProps): UseCheckNFTAvailabilityRes => {
  const { account } = useAccounts();

  let claimInfo = {
    isClaimable: false,
    isClaimed: false,
    claimingAddress: `0x1`,
    cid: NFTInfo[chain]?.cid ?? '',
    numberId: NFTInfo[chain]?.numberId ?? 0,
    signature: '',
    powahs: 0,
    cap: 0,
    verifyIds: 0,
    NFTAddress: `0x1`,
  };

  const {
    data: dataCheckClaim,
    isSuccess: IsCheckClaimSuccess,
    isLoading: IsCheckClaimLoading,
  } = useQuery({
    queryKey: ['checkFestNFT' + chain + account?.address],
    queryFn: async () => {
      const res = (await request(
        GALXE_ENDPOINT,
        superfestNFTCheck,
        {
          id: NFTInfo[chain].cid,
          address: account?.address,
        },
        {},
      )) as GalxeGraphqlCheckRes;
      return res as GalxeGraphqlCheckRes;
    },
    enabled: !!account?.address,
    refetchInterval: 1000 * 60 * 60,
  });

  const alreadyClaimed =
    dataCheckClaim?.campaign?.participationStatus?.toLowerCase() === 'success';
  if (alreadyClaimed) {
    claimInfo.isClaimed = true;
  }

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['festNFT' + chain + account?.address],
    queryFn: async () => {
      const res = (await request(
        GALXE_ENDPOINT,
        availableNFT,
        {
          campaignID: NFTInfo[chain].cid,
          address: account?.address,
        },
        {},
      )) as GalxeGraphqlRes;

      return res as GalxeGraphqlRes;
    },
    enabled: !!account?.address && !alreadyClaimed,
    refetchInterval: 1000 * 60 * 60,
  });

  if (data?.prepareParticipate?.allow) {
    const { signature, spaceStation } = data.prepareParticipate;
    const { verifyIDs, powahs, nftCoreAddress } =
      data.prepareParticipate.mintFuncInfo;

    claimInfo.verifyIds = verifyIDs?.[0];
    claimInfo.powahs = powahs?.[0];
    claimInfo.signature = signature;
    claimInfo.claimingAddress = spaceStation;
    claimInfo.NFTAddress = nftCoreAddress;
    claimInfo.isClaimable = true;
  }

  return {
    claimInfo,
    isLoading,
    isSuccess,
  };
};
