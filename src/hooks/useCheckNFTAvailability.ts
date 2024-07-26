'use client';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { availableNFT } from './querries/superfestNFT';
import { useAccount } from 'wagmi';
import { superfestNFTCheck } from './querries/superfestNFTCheck';
import { useState, useMemo, useEffect } from 'react';
import { useSuperfestNFTStore } from 'src/stores/superfestNFT';
import { useAccounts } from './useAccounts';

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

const GALXE_ENDPOINT = 'https://graphigo.prd.galaxy.eco/query';
const SECONDS_IN_A_DAY = 86400;
const NFTInfo = {
  mode: {
    cid: 'GCaA9tkNSX',
    numberId: 306585,
  },
  optimism: {
    cid: 'GCG29tkzgi',
    numberId: 306532,
  },
  base: {
    cid: 'GCP49tkWyM',
    numberId: 306586,
  },
  fraxtal: {
    cid: '',
    numberId: 0,
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
  } =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  if (data?.prepareParticipate && data.prepareParticipate.allow) {
    claimInfo.isClaimable = true;
    claimInfo.verifyIds = data.prepareParticipate.mintFuncInfo.verifyIDs?.[0];
    claimInfo.powahs = data.prepareParticipate.mintFuncInfo.powahs?.[0];
    claimInfo.signature = data.prepareParticipate.signature;
    claimInfo.claimingAddress = data.prepareParticipate.spaceStation;
    claimInfo.NFTAddress = data.prepareParticipate.mintFuncInfo.nftCoreAddress;
  }

  return {
    claimInfo,
    isLoading,
    isSuccess,
  };
};
