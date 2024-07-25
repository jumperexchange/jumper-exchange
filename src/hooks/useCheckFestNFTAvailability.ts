'use client';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { availableNFT } from './querries/superfestNFT';
import { useAccount } from 'wagmi';
import { superfestNFTCheck } from './querries/superfestNFTCheck';
import { useState } from 'react';

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

export interface UseCheckFestNFTAvailabilityRes {
  claimInfo: {
    [key: string]: NFTInfo;
  };
  isLoading?: boolean;
  isSuccess?: boolean;
}

export interface UseCheckFestNFTAvailabilityProps {
  userAddress?: string;
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

// const claimInfo = {
//   mode: {
//     isClaimable: false,
//     isClaimed: false,
//     claimingAddress: `0x1`,
//     cid: 'GCaA9tkNSX',
//     numberId: 306585,
//     signature: '',
//     cap: 0,
//     verifyIds: 0,
//     NFTAddress: `0x1`,
//   },
//   optimism: {
//     isClaimable: false,
//     isClaimed: false,
//     claimingAddress: `0x1`,
//     cid: 'GCG29tkzgi',
//     numberId: 306532,
//     signature: '',
//     cap: 0,
//     verifyIds: 0,
//     NFTAddress: `0x1`,
//   },
//   base: {
//     isClaimable: false,
//     isClaimed: false,
//     claimingAddress: `0x1`,
//     cid: 'GCP49tkWyM',
//     numberId: 306586,
//     signature: '',
//     cap: 0,
//     verifyIds: 0,
//     NFTAddress: `0x1`,
//   },
//   // fraxtal: {
//   //   isClaimable: false,
//   //   isClaimed: false,
//   //   claimingAddress: `0x1`,
//   //   cid: CID,
//   //   signature: '',
//   //   cap: 0,
//   //   verifyIds: 0,
//   //   NFTAddress: `0x1`,
//   // },
// } as { [key: string]: NFTInfo };

const GALXE_ENDPOINT = 'https://graphigo.prd.galaxy.eco/query';

export const useCheckFestNFTAvailability = ({
  userAddress,
}: UseCheckFestNFTAvailabilityProps): UseCheckFestNFTAvailabilityRes => {
  const [claimInfo, setClaimInfo] = useState<{ [key: string]: NFTInfo }>({
    mode: {
      isClaimable: false,
      isClaimed: false,
      claimingAddress: `0x1`,
      cid: 'GCaA9tkNSX',
      numberId: 306585,
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
      numberId: 306532,
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
      numberId: 306586,
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
  });

  console.log('entering');
  console.log(claimInfo);
  console.log('-------------');

  for (const [chainName, chainInfo] of Object.entries(claimInfo)) {
    const {
      data: dataCheckClaim,
      isSuccess: IsCheckClaimSuccess,
      isLoading: IsCheckClaimLoading,
    } = useQuery({
      queryKey: ['checkFestNFT' + chainName],
      queryFn: async () => {
        const res = await request(
          GALXE_ENDPOINT,
          superfestNFTCheck,
          {
            id: chainInfo.cid,
            address: userAddress,
          },
          {},
        );
        return res as GalxeGraphqlCheckRes;
      },
      enabled: !!userAddress,
      refetchInterval: 1000 * 60 * 60,
    });

    const alreadyClaimed =
      dataCheckClaim?.campaign?.participationStatus?.toLowerCase() ===
      'success';
    if (alreadyClaimed) {
      claimInfo[chainName].isClaimed = true;
    }

    const { data, isSuccess, isLoading } = useQuery({
      queryKey: ['festNFT' + chainName],
      queryFn: async () => {
        const res = await request(
          GALXE_ENDPOINT,
          availableNFT,
          {
            campaignID: chainInfo.cid,
            address: userAddress,
          },
          {},
        );
        return res as GalxeGraphqlRes;
      },
      enabled: !!userAddress && !alreadyClaimed,
      refetchInterval: 1000 * 60 * 60,
    });
    if (data?.prepareParticipate && data.prepareParticipate.allow) {
      // cap: 0, -> check for the CAP
      claimInfo[chainName].isClaimable = true;
      claimInfo[chainName].verifyIds =
        data.prepareParticipate.mintFuncInfo.verifyIDs?.[0];
      claimInfo[chainName].powahs =
        data.prepareParticipate.mintFuncInfo.powahs?.[0];
      claimInfo[chainName].signature = data.prepareParticipate.signature;
      claimInfo[chainName].claimingAddress =
        data.prepareParticipate.spaceStation;
      claimInfo[chainName].NFTAddress =
        data.prepareParticipate.mintFuncInfo.nftCoreAddress;
    }
  }

  return {
    claimInfo: claimInfo,
  };
};
