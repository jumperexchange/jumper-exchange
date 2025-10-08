import {
  EarnOpportunityHistory,
  HttpResponse,
  JumperBackend,
} from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetOpportunityAnalyticsResult = HttpResponse<
  EarnOpportunityHistory,
  unknown
>;

export type EarnOpportunityAnalyticsQuery = Parameters<
  JumperBackend<unknown>['v1']['earnControllerGetAnalyticsV1']
>[1];

export type AnalyticsValueField = EarnOpportunityAnalyticsQuery['value'];
export type AnalyticsRangeField = EarnOpportunityAnalyticsQuery['range'];

export async function getOpportunityAnalytics(
  slug: string,
  query: EarnOpportunityAnalyticsQuery,
): Promise<GetOpportunityAnalyticsResult> {
  const client = makeClient();
  const analytics = await client.v1.earnControllerGetAnalyticsV1(slug, query);
  return analytics;
}
