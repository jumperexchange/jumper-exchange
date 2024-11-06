import { useQuery } from '@tanstack/react-query';
import { getAccountAllowanceQueryOptions } from '../queries';
import { formatUnits, type Address } from 'viem';
import {
  type SupportedTokenInfo,
  useSupportedTokensInfo,
} from './use-supported-tokens-info';

export type AccountAllowance = SupportedTokenInfo & {
  raw_value: BigInt;
  token_value: number;
  usd_value: number;
};

export const useAccountAllowance = ({
  chain_id,
  account,
  spender,
  tokens,
}: {
  chain_id: number;
  account: Address;
  spender: Address;
  tokens: Address[];
}) => {
  let data = null;

  const token_ids = tokens.map((token) => `${chain_id}-${token.toLowerCase()}`);

  const propsAccountInfo = useQuery(
    getAccountAllowanceQueryOptions(chain_id, account, spender, tokens),
  );

  const propsTokensInfo = useSupportedTokensInfo({ token_ids });

  const isLoading = propsAccountInfo.isLoading || propsTokensInfo.isLoading;
  const isError = propsAccountInfo.isError || propsTokensInfo.isError;
  const isRefetching =
    propsAccountInfo.isRefetching || propsTokensInfo.isRefetching;

  if (
    !!propsTokensInfo.data &&
    !!propsAccountInfo.data &&
    !(propsAccountInfo.data instanceof Error) &&
    !(propsTokensInfo.data instanceof Error)
  ) {
    data = propsAccountInfo.data.map((res, index) => {
      const raw_value = res.result ? BigInt(res.result) : BigInt(0);
      let token_value = parseFloat(
        formatUnits(raw_value, propsTokensInfo.data![index].decimals),
      );

      return {
        ...propsTokensInfo.data![index],
        raw_value,
        token_value,
        usd_value: token_value * propsTokensInfo.data![index].price,
      } as AccountAllowance;
    });
  }

  return {
    data,
    isLoading,
    isRefetching,
    isError,
  };
};
