import { makeClient } from './client';

export type ApyAnalyticsRangeField = 'day' | 'week' | 'month' | 'year';

export async function getOpportunityApyAnalytics(
  slug: string,
  query: { range: ApyAnalyticsRangeField; instant?: boolean },
) {
  const client = makeClient();
  return client.v1.earnControllerGetApyAnalyticsV1(slug, query);
}
