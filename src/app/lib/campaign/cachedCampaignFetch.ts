import { getCampaignBySlug } from '@/app/lib/getCampaignsBySlug';
import { getCampaigns } from '@/app/lib/getCampaigns';
import { cacheLife } from 'next/cache';

const CAMPAIGN_PAGE_REVALIDATE_SECONDS = 300;

export async function getCampaignsForPage() {
  'use cache';
  cacheLife({ revalidate: CAMPAIGN_PAGE_REVALIDATE_SECONDS });
  return getCampaigns();
}

export async function getCampaignBySlugForPage(slug: string) {
  'use cache';
  cacheLife({ revalidate: CAMPAIGN_PAGE_REVALIDATE_SECONDS });
  return getCampaignBySlug(slug);
}
