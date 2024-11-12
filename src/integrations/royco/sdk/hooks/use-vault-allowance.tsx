import { useQuery } from '@tanstack/react-query';
import { getVaultAllowanceQueryOptions } from '../queries';

export const useVaultAllowance = ({
  chain_id,
  account,
  vault_address,
  spender,
  enabled = true,
}: {
  chain_id: number;
  account: string;
  vault_address: string;
  spender: string;
  enabled?: boolean;
}) => {
  return useQuery({
    ...getVaultAllowanceQueryOptions(chain_id, account, vault_address, spender),
    enabled,
  });
};
