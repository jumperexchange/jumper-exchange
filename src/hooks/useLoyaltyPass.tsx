import { useAccounts } from './useAccounts';
import { useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { useLoyaltyPassStore } from 'src/stores';
import { PDA } from 'src/types';

export interface UseLoyaltyPassProps {
  address?: string | null;
  points?: number | null;
  tier?: string | null;
  pdas?: PDA[];
}

const SECONDS_IN_A_DAY = 86400;

export const useLoyaltyPass = (): UseLoyaltyPassProps => {
  const { account } = useAccounts();
  // const [address, points, tier, pdas, timestamp, storeLoyaltyPassData] =
  //   useLoyaltyPassStore((state) => [
  //     state.address,
  //     state.points,
  //     state.tier,
  //     state.pdas,
  //     state.timestamp,
  //     state.storeLoyaltyPassData,
  //   ]);

  // if connected, check in the local storage
  // const t = Date.now() / 1000;
  // if (address && t > timestamp + SECONDS_IN_A_DAY) {
  //   return {
  //     address: address,
  //     points: points,
  //     tier: tier,
  //     pdas: pdas,
  //   };
  // }
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
        skip: 0
        take: 300
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

  const headers = {
    'x-api-key': `${apiKey}`,
    Authorization: `Bearer ${apiAccesToken}`,
  };

  // query
  const { data, isSuccess } = useQuery({
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
  if (!isSuccess || !account?.address || !(account.chainType === 'EVM')) {
    console.log('No account sorry');
    return {
      address: null,
      points: null,
      tier: null,
      pdas: [],
    };
  } else {
    // transform the data
    // console.log(data);
    let points = 0;
    let tier = '';
    const { issuedPDAs: pdas } = data as any;
    // filter to remove loyalty pass from pda
    const pdasWithoutLoyalty = pdas.filter((pda: any) => {
      if (pda.dataAsset.title === 'LI.FI Loyalty Pass') {
        points = pda.dataAsset.claim.points;
        tier = pda.dataAsset.claim.tier;
        return false;
      }
      return true;
    });

    // storeLoyaltyPassData(account.address, points, tier, pdasWithoutLoyalty, t);

    return {
      address: account.address,
      points: points,
      tier: tier,
      pdas: pdasWithoutLoyalty,
    };
  }
};
