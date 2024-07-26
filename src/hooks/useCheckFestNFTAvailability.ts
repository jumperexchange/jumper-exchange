'use client';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { availableNFT } from './querries/superfestNFT';
import { useAccount } from 'wagmi';
import { superfestNFTCheck } from './querries/superfestNFTCheck';
import { useState, useMemo, useEffect } from 'react';
import { useSuperfestNFTStore } from 'src/stores/superfestNFT';

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
  alreadyClaimedInfo: {
    [key: string]: boolean;
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

const GALXE_ENDPOINT = 'https://graphigo.prd.galaxy.eco/query';
const SECONDS_IN_A_DAY = 86400;
const initialClaimInfo = {
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
} as { [key: string]: NFTInfo };

const inititalAlreadyClaimInfo = {
  mode: false,
  optimism: false,
  base: false,
  fraxtal: false,
} as { [key: string]: boolean };

export const useCheckFestNFTAvailability = ({
  userAddress,
}: UseCheckFestNFTAvailabilityProps): UseCheckFestNFTAvailabilityRes => {
  // const {
  //   address: storedAddress,
  //   claimInfo: storedClaimInfo,
  //   timestamp,
  //   setNFTCheckData,
  // } = useSuperfestNFTStore((state) => state);
  // //we store the data during 8hours to avoid querying too much our partner API.
  // const t = Date.now() / 1000;
  // const storeNeedsRefresh = t > (timestamp ?? 0) + SECONDS_IN_A_DAY / 3;

  const [claimInfo, setClaimInfo] = useState<{ [key: string]: NFTInfo }>(
    initialClaimInfo,
  );
  const [alreadyClaimedInfo, setAlreadyClaimedInfo] = useState<{
    [key: string]: boolean;
  }>(inititalAlreadyClaimInfo);

  useEffect(() => {
    setClaimInfo(initialClaimInfo);
    setAlreadyClaimedInfo(inititalAlreadyClaimInfo);
  }, [userAddress]);

  console.log('entering ------------- BEGINNING');
  console.log(userAddress);
  console.log('-------------');

  for (const [chainName] of Object.entries(initialClaimInfo)) {
    console.log(chainName);

    const {
      data: dataCheckClaim,
      isSuccess: IsCheckClaimSuccess,
      isLoading: IsCheckClaimLoading,
    } = useQuery({
      queryKey: ['checkFestNFT' + chainName + userAddress],
      queryFn: async () => {
        console.log('entering there');
        const res = (await request(
          GALXE_ENDPOINT,
          superfestNFTCheck,
          {
            id: initialClaimInfo[chainName].cid,
            address: userAddress,
          },
          {},
        )) as GalxeGraphqlCheckRes;
        const alreadyClaimed =
          res?.campaign?.participationStatus?.toLowerCase() === 'success';
        if (alreadyClaimed) {
          setAlreadyClaimedInfo({
            [chainName]: true,
          });
        }

        return res as GalxeGraphqlCheckRes;
      },
      enabled: !!userAddress,
      refetchInterval: 1000 * 60 * 60,
    });

    const { data, isSuccess, isLoading } = useQuery({
      queryKey: ['festNFT' + chainName + userAddress],
      queryFn: async () => {
        const res = (await request(
          GALXE_ENDPOINT,
          availableNFT,
          {
            campaignID: initialClaimInfo[chainName].cid,
            address: userAddress,
          },
          {},
        )) as GalxeGraphqlRes;
        if (res?.prepareParticipate && res.prepareParticipate.allow) {
          // cap: 0, -> check for the CAP
          setClaimInfo({
            ...claimInfo,
            [chainName]: {
              ...claimInfo[chainName],
              isClaimable: true,
              verifyIds: res.prepareParticipate.mintFuncInfo.verifyIDs?.[0],
              powahs: res.prepareParticipate.mintFuncInfo.powahs?.[0],
              signature: res.prepareParticipate.signature,
              claimingAddress: res.prepareParticipate.spaceStation,
              NFTAddress: res.prepareParticipate.mintFuncInfo.nftCoreAddress,
            },
          });
        }
        return res as GalxeGraphqlRes;
      },
      enabled: !!userAddress,
      refetchInterval: 1000 * 60 * 60,
    });
  }

  console.log(claimInfo);
  console.log('----------------- END');

  return {
    claimInfo: claimInfo,
    alreadyClaimedInfo: alreadyClaimedInfo,
  };
};
