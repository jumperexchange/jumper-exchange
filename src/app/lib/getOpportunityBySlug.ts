import { makeClient } from './client';

export async function getOpportunityBySlug(slug: string) {
  try {
    const client = makeClient();
    const opportunity = await client.v1.earnControllerGetItemV1(slug);
    return opportunity.data;
  } catch (error) {
    console.error('getOpportunityBySlug failed for slug', slug, error);
    throw error;
  }
}
