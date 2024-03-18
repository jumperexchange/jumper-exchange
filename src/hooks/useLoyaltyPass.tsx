import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { useLoyaltyPassStore } from 'src/stores';
import type { PDA } from 'src/types';
import { getAllPDAs } from './querries/pdas';
import { useAccounts } from './useAccounts';

export interface UseLoyaltyPassProps {
  isSuccess: boolean;
  address?: string;
  points?: number;
  tier?: string;
  pdas?: PDA[];
}

interface IGatewayAPI {
  issuedPDAs: PDA[];
}

const SECONDS_IN_A_DAY = 86400;

export const useLoyaltyPass = (): UseLoyaltyPassProps => {
  const { account } = useAccounts();
  const {
    address: storedAddress,
    points: storedPoints,
    tier: storedTier,
    pdas: storedPdas,
    timestamp,
    setLoyaltyPassData,
  } = useLoyaltyPassStore((state) => state);

  //we store the data during 24hours to avoid querying too much our partner API.
  const t = Date.now() / 1000;
  const storeNeedsRefresh = t > (timestamp ?? 0) + SECONDS_IN_A_DAY;

  const queryIsEnabled =
    storeNeedsRefresh &&
    !!account?.address &&
    account?.chainType === 'EVM' &&
    account?.address?.toLowerCase() !== storedAddress?.toLowerCase();

  // query
  const apiBaseUrl = import.meta.env.VITE_GATEWAY_URL;
  const apiUrl = new URL(`${apiBaseUrl}`);
  const apiKey = import.meta.env.VITE_GATEWAY_API_KEY;
  const apiAccesToken = import.meta.env.VITE_GATEWAY_API_TOKEN;
  const headers = {
    'x-api-key': `${apiKey}`,
    Authorization: `Bearer ${apiAccesToken}`,
  };

  const { data, isSuccess } = useQuery({
    queryKey: ['loyalty-pass'],
    queryFn: async () => {
      const res = await request(
        decodeURIComponent(apiUrl.href),
        getAllPDAs,
        { EVMAddress: account?.address },
        headers,
      );

      if (res && account?.address) {
        let points = 0;
        let tier = '';
        const { issuedPDAs: pdas } = res as IGatewayAPI;
        // filter to remove loyalty pass from pda
        const pdasWithoutLoyalty = pdas.filter((pda: PDA) => {
          if (pda.dataAsset.title === 'LI.FI Loyalty Pass') {
            points = pda.dataAsset.claim.points;
            tier = pda.dataAsset.claim.tier;
            return false;
          }
          return true;
        });

        setLoyaltyPassData(
          account.address,
          points,
          tier,
          pdasWithoutLoyalty,
          t,
        );

        return {
          address: account.address,
          points: points,
          tier: tier,
          pdas: pdasWithoutLoyalty,
        };
      } else {
        return null;
      }
    },
    enabled: queryIsEnabled,
    refetchInterval: 1000 * 60 * 60,
  });

  const returnLocalData =
    account?.address === storedAddress && !storeNeedsRefresh;
  const errorWhileFetchingData =
    !data || !account?.address || !(account.chainType === 'EVM');

  if (returnLocalData) {
    return {
      isSuccess: true,
      address: storedAddress,
      points: storedPoints,
      tier: storedTier,
      pdas: storedPdas,
    };
  } else if (errorWhileFetchingData) {
    return {
      isSuccess: false,
      address: account?.address,
      points: undefined,
      tier: undefined,
      pdas: [],
    };
  }

  return { ...data, isSuccess: isSuccess };
};
