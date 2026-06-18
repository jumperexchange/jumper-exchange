import type { JumperBackend } from '@/types/jumper-backend';
import { makeClient } from './client';

type HttpResponse = Awaited<
  ReturnType<
    JumperBackend<unknown>['v1']['userRewardsControllerGetUserRewardsV1']
  >
>;

export type UserRewardsResponse = HttpResponse['data'];

export async function getUserRewards(
  address: string,
  jumperCampaignId?: string,
): Promise<UserRewardsResponse> {
  const client = makeClient();
  const res = await client.v1.userRewardsControllerGetUserRewardsV1(address, {
    jumperCampaignId,
  });
  return res.data;
}
