import type { JumperBackend } from '@/types/jumper-backend';
import { makeClient } from './client';

type CalldataHttpResponse = Awaited<
  ReturnType<JumperBackend<unknown>['v1']['userRewardsControllerGetCalldataV1']>
>;
export type DeFiReacherClaimCalldata = CalldataHttpResponse['data'];

export const getDeFiReacherRewardClaimCalldata = async (
  userAddress: string,
  campaignId: string,
): Promise<DeFiReacherClaimCalldata> => {
  const client = makeClient();
  const res = await client.v1.userRewardsControllerGetCalldataV1(userAddress, {
    provider: 'defi-reacher',
    campaignId,
  });
  return res.data;
};
