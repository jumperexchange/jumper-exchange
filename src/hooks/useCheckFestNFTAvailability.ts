'use client';
import { MercleNFTABI } from '../const/abi/mercleNftABI';
import { base } from 'wagmi/chains';
import { useReadContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { availableNFTs } from './querries/superfestNFT';

interface ClaimableBooleans {
  isClaimable: boolean;
  isClaimed: boolean;
}

export interface UseCheckFestNFTAvailabilityRes {
  claimInfo: {
    mode: ClaimableBooleans;
    optimism: ClaimableBooleans;
    base: ClaimableBooleans;
    fraxtal: ClaimableBooleans;
  };
}

export interface UseCheckFestNFTAvailabilityProps {
  userAddress?: string;
}

const GALXE_ENDPOINT = 'https://graphigo.prd.galaxy.eco/query';

export const useCheckFestNFTAvailability = ({
  userAddress,
}: UseCheckFestNFTAvailabilityProps): UseCheckFestNFTAvailabilityRes => {
  // state
  let claimInfo = {
    mode: {
      isClaimable: false,
      isClaimed: false,
    },
    optimism: {
      isClaimable: false,
      isClaimed: false,
    },
    base: {
      isClaimable: false,
      isClaimed: false,
    },
    fraxtal: {
      isClaimable: false,
      isClaimed: false,
    },
  };

  // Call to get the available rewards

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['loyalty-pass'],
    queryFn: async () => {
      const res = await request(GALXE_ENDPOINT, availableNFTs, {
        EVMAddress: account?.address,
      });

      return res;

      //   if (res && account?.address) {
      //     let points = 0;
      //     let tier = '';
      //     const { issuedPDAs: pdas } = res as IGatewayAPI;
      //     // filter to remove loyalty pass from pda
      //     const pdasWithoutLoyalty = pdas.filter((pda: PDA) => {
      //       if (pda.dataAsset.title === 'LI.FI Loyalty Pass') {
      //         points = pda.dataAsset.claim.points;
      //         tier = pda.dataAsset.claim.tier;
      //         return false;
      //       }
      //       return true;
      //     });

      //     setLoyaltyPassData(
      //       account.address,
      //       points,
      //       tier,
      //       pdasWithoutLoyalty,
      //       t,
      //     );

      //     return {
      //       address: account.address,
      //       points: points,
      //       tier: tier,
      //       pdas: pdasWithoutLoyalty,
      //     };
      //   } else {
      //     return undefined;
      //   }
    },
    enabled: !!userAddress,
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    claimInfo: claimInfo,
  };
};
