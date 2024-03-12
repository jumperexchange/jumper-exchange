import { useAccounts } from './useAccounts';
import { useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { useLoyaltyPassStore } from 'src/stores';
import { PDA } from 'src/types';

export interface UseLoyaltyPassProps {
  isSuccess: boolean;
  address?: string | null;
  points?: number | null;
  tier?: string | null;
  pdas?: PDA[];
}

const SECONDS_IN_A_DAY = 86400;

const getAllPDAs = gql`
  query issuedPDAs($EVMAddress: String!) {
    issuedPDAs(
      filter: {
        organization: { type: GATEWAY_ID, value: "lifi" }
        owner: { type: EVM, value: $EVMAddress }
      }
      skip: 0
      take: 300
      order: { issuanceDate: "DESC" }
    ) {
      id
      status
      ownerHash
      dataAsset {
        claim
        title
        description
        image
        dataModel {
          id
        }
        owner {
          gatewayId
          walletId
        }
      }
    }
  }
`;

export const useLoyaltyPass = (): UseLoyaltyPassProps => {
  const { account } = useAccounts();
  const [
    storedAddress,
    storedPoints,
    storedTier,
    storedPdas,
    timestamp,
    storeLoyaltyPassData,
  ] = useLoyaltyPassStore((state) => [
    state.address,
    state.points,
    state.tier,
    state.pdas,
    state.timestamp,
    state.storeLoyaltyPassData,
  ]);

  const apiBaseUrl = import.meta.env.VITE_GATEWAY_URL;
  const apiUrl = new URL(`${apiBaseUrl}`);
  const apiKey = import.meta.env.VITE_GATEWAY_API_KEY;
  const apiAccesToken = import.meta.env.VITE_GATEWAY_API_TOKEN;

  const headers = {
    'x-api-key': `${apiKey}`,
    Authorization: `Bearer ${apiAccesToken}`,
  };

  //we store the data during 24hours to avoid querying too much our partner API.
  const t = Date.now() / 1000;
  const storeNeedsRefresh = t > (timestamp ?? 0) + SECONDS_IN_A_DAY;

  const queryIsEnabled =
    storeNeedsRefresh &&
    !!account?.address &&
    account?.chainType === 'EVM' &&
    account?.address?.toLowerCase() !== storedAddress?.toLowerCase();

  // query
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
        const { issuedPDAs: pdas } = res as any;
        // filter to remove loyalty pass from pda
        const pdasWithoutLoyalty = pdas.filter((pda: any) => {
          if (pda.dataAsset.title === 'LI.FI Loyalty Pass') {
            points = pda.dataAsset.claim.points;
            tier = pda.dataAsset.claim.tier;
            return false;
          }
          return true;
        });

        storeLoyaltyPassData(
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
      points: null,
      tier: null,
      pdas: [],
    };
  }

  return { ...data, isSuccess: isSuccess };
};
