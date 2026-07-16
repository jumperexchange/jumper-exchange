import { makeClient } from './client';

export async function getOpportunityBySlug(slug: string) {
  const client = makeClient();
  const response = await client.v1.earnControllerGetItemV1(slug);
  return response.data;
}
