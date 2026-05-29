import { makeClient } from './client';

export async function getOpportunityRelatedMarket(slug: string) {
  try {
    const client = makeClient();
    const data = await client.v1.earnControllerGetRelatedItemsV1(slug);
    return data.data;
  } catch (error) {
    console.error('getOpportunityRelatedMarket failed for slug', slug, error);
    throw error;
  }
}
