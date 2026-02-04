import {
  type DeFiReacherClaimCalldata,
  getDeFiReacherRewardClaimCalldata,
} from '@/app/lib/getDeFiReacherRewardClaimCalldata';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

type UseDeFiReacherRewardClaimCalldataResult = UseQueryResult<
  DeFiReacherClaimCalldata | null,
  Error
>;

export const useDeFiReacherRewardClaimCalldata = (
  userAddress?: string,
  campaignId?: string,
): UseDeFiReacherRewardClaimCalldataResult => {
  return useQuery<DeFiReacherClaimCalldata | null>({
    queryKey: ['deFiReacherRewardClaimCalldata', userAddress, campaignId],
    queryFn: () => {
      if (!userAddress || !campaignId) {
        return null;
      }
      return getDeFiReacherRewardClaimCalldata(userAddress, campaignId);
    },
    enabled: false,
  });
};
