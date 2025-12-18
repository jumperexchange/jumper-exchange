import type { HttpResponse, PosthogFeatureFlag } from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetPosthogFeatureFlagResult = HttpResponse<
  PosthogFeatureFlag,
  unknown
>;

export const getPosthogFeatureFlag = async (
  feature: string,
  distinctId: string,
): Promise<GetPosthogFeatureFlagResult> => {
  try {
    const client = makeClient();
    const posthogFeatureFlag =
      await client.v1.postHogControllerGetFeatureFlagV1({
        key: feature,
        distinctId: distinctId,
      });
    return posthogFeatureFlag;
  } catch (error) {
    console.error('getPosthogFeatureFlag failed for feature', feature, error);
    throw error;
  }
};
