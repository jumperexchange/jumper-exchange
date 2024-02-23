import { useAccounts } from './useAccounts';
import { useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';

// create PDA type
export interface PDA {}

export interface UseLoyaltyPassProps {
  isConnected?: boolean;
  points?: number | null;
  tier?: string | null;
  pdas?: PDA[];
}

export const useLoyaltyPass = (): UseLoyaltyPassProps => {
  const { account } = useAccounts();

  //   const apiBaseUrl = import.meta.env.VITE_GATEWAY_URL;
  const apiBaseUrl = 'https://protocol.mygateway.xyz/graphql';
  const apiUrl = new URL(`${apiBaseUrl}`);

  // prepare the gql for the query
  const getAllPDAs = gql`
    query issuedPDAs($EVMAddress: String!) {
      issuedPDAs(
        filter: {
          organization: { type: GATEWAY_ID, value: "lifi" }
          owner: { type: EVM, value: $EVMAddress }
        }
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

  // tokens
  //   const apiKey = import.meta.env.VITE_GATEWAY_API_KEY;
  //   const apiAccesToken = import.meta.env.VITE_GATEWAY_API_TOKEN;
  const apiKey = '';
  const apiAccesToken = '';
  const headers = {
    'x-api-key': `${apiKey}`,
    Authorization: `Bearer ${apiAccesToken}`,
  };

  // query
  const { data } = useQuery({
    queryKey: ['loyalty-pass'],
    queryFn: async () =>
      request(
        decodeURIComponent(apiUrl.href),
        getAllPDAs,
        { EVMAddress: account?.address },
        headers,
      ),
    enabled: !!account?.address && account.chainType === 'EVM',
    refetchInterval: 1000 * 60 * 60,
  });

  //   verify that the user is connected with an EVM address
  if (!data || !account?.address || !(account.chainType === 'EVM')) {
    console.log('No account sorry');
    return {
      isConnected: false,
      points: null,
      tier: null,
      pdas: [],
    };
  } else {
    // transform the data
    // console.log(data);
    let points = 0;
    let tier = null;
    const { issuedPDAs: pdas } = data as any;
    // filter to remove loyalty pass from pda
    const pdasWithoutLoyalty = pdas.filter((pda: any) => {
      if (pda.dataAsset.title === 'LI.FI Loyalty Pass') {
        console.log('HERE IS THE LOYALTY PASS');
        points = pda.dataAsset.claim.points;
        tier = pda.dataAsset.claim.tier;
        return false;
      }
      return true;
    });

    return {
      isConnected: true,
      points: points,
      tier: tier,
      pdas: pdasWithoutLoyalty,
    };
  }
};
