import { useQuery } from '@tanstack/react-query';
import { getAccountAllowanceQueryOptions } from '../queries';
import { type Address } from 'viem';

export const useTokenAllowance = ({
  chain_id,
  account,
  spender,
  tokens,
  enabled = true,
}: {
  chain_id: number;
  account: Address;
  spender: Address;
  tokens: Address[];
  enabled?: boolean;
}) => {
  const props = useQuery({
    ...getAccountAllowanceQueryOptions(chain_id, account, spender, tokens),
    enabled,
  });

  return props;
};
