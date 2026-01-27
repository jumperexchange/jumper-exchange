import type { ApyAnalyticsHistory, HttpResponse } from '@/types/jumper-backend';
import { makeClient } from './client';

export type ApyAnalyticsRangeField = 'day' | 'week' | 'month' | 'year';

export type GetOpportunityApyAnalyticsResult = HttpResponse<
  ApyAnalyticsHistory,
  unknown
>;

export async function getOpportunityApyAnalytics(
  slug: string,
  query: { range: ApyAnalyticsRangeField; instant?: boolean },
): Promise<GetOpportunityApyAnalyticsResult> {
  const client = makeClient();
  return client.v1.earnControllerGetApyAnalyticsV1(slug, query);
}
