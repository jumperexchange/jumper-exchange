import {
  EarnOpportunityWithLatestAnalytics,
  HttpResponse,
} from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetOpportunityBySlugResult = HttpResponse<
  EarnOpportunityWithLatestAnalytics,
  unknown
>;

export async function getOpportunityBySlug(
  slug: string,
): Promise<GetOpportunityBySlugResult> {
  try {
    const client = makeClient();
    const opportunity = await client.v1.earnControllerGetItemV1(slug);
    return opportunity;
  } catch (error) {
    return error as GetOpportunityBySlugResult;
  }
}
