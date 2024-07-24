'use client';
import {  useQueries, useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { availableNFT } from './querries/superfestNFT';
import { useAccount } from 'wagmi';

export interface NFTInfo {
  isClaimable: boolean;
  isClaimed: boolean;
  claimingAddress: string;
  cid: string;
  signature?: string;
  cap?: number;
  verifyIds?: number;
  powahs?: number;
  NFTAddress?: string;
}

export interface UseCheckFestNFTAvailabilityRes {
  claimInfo: {
    [key: string]: NFTInfo;
  };
  isLoading: boolean;
  isSuccess: boolean;
}

export interface UseCheckFestNFTAvailabilityProps {
  userAddress?: string;
}

const GALXE_ENDPOINT = 'https://graphigo.prd.galaxy.eco/query';
const claimInfo = {
  mode: {
    isClaimable: false,
    isClaimed: false,
    claimingAddress: `0x1`,
    cid: 'GCaA9tkNSX',
    signature: '',
    cap: 0,
    verifyIds: 0,
    NFTAddress: `0x1`,
  },
  optimism: {
    isClaimable: false,
    isClaimed: false,
    claimingAddress: `0x1`,
    cid: 'GCG29tkzgi',
    signature: '',
    cap: 0,
    verifyIds: 0,
    NFTAddress: `0x1`,
  },
  base: {
    isClaimable: false,
    isClaimed: false,
    claimingAddress: `0x1`,
    cid: 'GCP49tkWyM',
    signature: '',
    cap: 0,
    verifyIds: 0,
    NFTAddress: `0x1`,
  },
  // fraxtal: {
  //   isClaimable: false,
  //   isClaimed: false,
  //   claimingAddress: `0x1`,
  //   cid: CID,
  //   signature: '',
  //   cap: 0,
  //   verifyIds: 0,
  //   NFTAddress: `0x1`,
  // },
};


export const useCheckFestNFTAvailability = ({
  userAddress,
}: UseCheckFestNFTAvailabilityProps): UseCheckFestNFTAvailabilityRes => {
  const { address } = useAccount();

  for (const [chainName, chainInfo] of Object.entries(claimInfo)) {
    const { data, isSuccess, isLoading } = useQuery({
      queryKey: ['festNFT' + chainName],
      queryFn: async () => {
        const res = await request(
          GALXE_ENDPOINT,
          availableNFT,
          {
            campaignID: chainInfo.cid,
            address: address,
          },
          {},
        );
        return res;
      },
      enabled: !!address,
      refetchInterval: 1000 * 60 * 60,
    });
    if (data && (data as any).prepareParticipate && (data as any).prepareParticipate.allow) {
      // cap: 0, -> check for the CAP
      (claimInfo[chainName as string] as any).isClaimable = true;
      (claimInfo[chainName as string] as any).verifyIds = (data as any).prepareParticipate.mintFuncInfo.verifyIDs?.[0];
      (claimInfo[chainName as string] as any).powahs = (data as any).prepareParticipate.mintFuncInfo.powahs?.[0];
      (claimInfo[chainName as string] as any).signature = (data as any).prepareParticipate.signature;
      (claimInfo[chainName as string] as any).claimingAddress = (data as any).prepareParticipate.spaceStation;
      (claimInfo[chainName as string] as any).NFTAddress = (data as any).prepareParticipate.mintFuncInfo.nftCoreAddress;
    }  
  }

  console.log('--------------')
  console.log(claimInfo)

  return {
    claimInfo: claimInfo,
    isLoading: false,
    isSuccess: true,
  };
};
