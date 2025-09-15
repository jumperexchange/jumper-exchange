import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getOpportunitiesTop } from 'src/app/lib/getOpportunitiesTop';
import { FIVE_MINUTES_MS } from 'src/const/time';
import { Hex } from 'viem';
import { EarnOpportunity } from 'src/types/jumper-backend';
import { useAccount } from '@lifi/wallet-management';

export interface Props {}

export type Result = UseQueryResult<EarnOpportunity[], unknown>;

const useAccountAddress = (): string | undefined => {
  const { account } = useAccount();
  return account.address;
};

const isHex = (address: string): address is Hex => {
  // TODO: improve
  return address.startsWith('0x');
};

export const useEarnTopOpportunities = ({}: Props): Result => {
  const accountAddress = useAccountAddress();

  let address: Hex | undefined = undefined;
  if (accountAddress && isHex(accountAddress)) {
    address = accountAddress;
  }

  return useQuery({
    queryKey: ['earn-top-opportunities', address],
    queryFn: async () => {
      const result = await getOpportunitiesTop(address);
      if (!result.ok) {
        throw result.error;
      }
      // @ts-expect-error: we need to fix this - typing is incorrect we're retuning the http wrapper data.
      return result.data.data;
    },
    refetchInterval: FIVE_MINUTES_MS,
  });
};
