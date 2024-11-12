import { getTokenBalanceQueryOptions } from '../queries';
import { useQueries } from '@tanstack/react-query';
import { formatEther, formatUnits } from 'viem';
import type { Tables } from '../types';

export type TokenData = Pick<
  Tables<'tokens'>,
  | 'id'
  | 'chain_id'
  | 'contract_address'
  | 'symbol'
  | 'name'
  | 'image'
  | 'decimals'
  | 'current_price'
>;

export const useTokenBalances = ({
  account,
  tokens_data,
}: {
  account: string;
  tokens_data: Array<TokenData>;
}) => {
  const contract_addresses =
    (!!tokens_data && tokens_data.map((token) => token.contract_address)) || [];

  // const balanceQueries = useQueries({
  //   queries:
  //     contract_addresses.map((contract_address) =>
  //       getTokenBalanceQueryOptions(
  //         chain_id,
  //         contract_address as `0x${string}`,
  //         account as `0x${string}`
  //       )
  //     ) || [],
  // });

  const balanceQueries = useQueries({
    queries:
      tokens_data.map((token) =>
        getTokenBalanceQueryOptions(
          token.chain_id,
          token.contract_address as `0x${string}`,
          account as `0x${string}`,
        ),
      ) || [],
  });

  let data = null;

  if (balanceQueries.every((query) => query.isSuccess)) {
    data = balanceQueries.map((query, index) => {
      const token_data = tokens_data[index];

      const contract_address = contract_addresses[index];

      const balance = formatUnits(
        query.data[2].result as bigint,
        query.data[1].result as number,
      );

      let balance_usd = 0;

      if (!!token_data.current_price) {
        balance_usd = parseFloat(balance) * token_data.current_price;
      }

      // const balance_usd =
      //   !!tokens_info &&
      //   !!tokens_info[contract_address] &&
      //   !!tokens_info[contract_address].current_price
      //     ? balance * tokens_info[contract_address].current_price
      //     : null;

      return {
        ...token_data,
        balance,
        balance_usd,
      };
    });
  }

  const isLoading = balanceQueries.some((query) => query.isLoading);
  const isError = balanceQueries.some((query) => query.isError);
  const isRefetching = balanceQueries.some((query) => query.isRefetching);

  return { data, isLoading, isError, isRefetching };
};
