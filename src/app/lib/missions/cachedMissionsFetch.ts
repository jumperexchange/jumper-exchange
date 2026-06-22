import { cacheLife, cacheTag } from 'next/cache';

import { fetchQuestBySlug } from '@/app/lib/missions/missionQueries';
import type { PaginationProps } from '@/utils/strapi/StrapiApi';
import { getProfileBannerCampaigns } from '@/app/lib/getProfileBannerCampaigns';
import { getQuestsWithNoCampaignAttached } from '@/app/lib/getQuestsWithNoCampaignAttached';

const MISSIONS_PAGE_REVALIDATE_SECONDS = 300;

export async function fetchMissionsListForPage(
  pagination: PaginationProps,
  daysAhead: number,
) {
  'use cache';
  cacheLife({ revalidate: MISSIONS_PAGE_REVALIDATE_SECONDS });
  return getQuestsWithNoCampaignAttached(pagination, daysAhead);
}

export async function fetchQuestBySlugForPage(slug: string) {
  'use cache';
  cacheTag(`quest:slug:${slug}`);
  cacheLife({ revalidate: MISSIONS_PAGE_REVALIDATE_SECONDS });
  return fetchQuestBySlug(slug);
}

export async function fetchProfileBannerCampaignsForPage() {
  'use cache';
  cacheLife({ revalidate: MISSIONS_PAGE_REVALIDATE_SECONDS });
  return getProfileBannerCampaigns();
}
