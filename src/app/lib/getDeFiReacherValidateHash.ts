import type { JumperBackend } from '@/types/jumper-backend';
import type { Hex } from 'viem';
import { makeClient } from './client';

type ValidateHttpResponse = Awaited<
  ReturnType<
    JumperBackend<unknown>['v1']['userRewardsControllerValidateRewardV1']
  >
>;
export type DeFiReacherValidateHashResponse = ValidateHttpResponse['data'];

export const getDeFiReacherValidateHash = async (
  address: string,
  txHash: Hex,
): Promise<DeFiReacherValidateHashResponse> => {
  const client = makeClient();
  const res = await client.v1.userRewardsControllerValidateRewardV1(address, {
    provider: 'defi-reacher',
    txHash,
  });
  return res.data;
};
