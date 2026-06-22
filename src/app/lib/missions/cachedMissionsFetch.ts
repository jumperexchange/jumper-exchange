import { unstable_cache } from 'next/cache';

import { fetchQuestBySlug } from '@/app/lib/missions/missionQueries';
import type { PaginationProps } from '@/utils/strapi/StrapiApi';
import { getProfileBannerCampaigns } from '@/app/lib/getProfileBannerCampaigns';
import { getQuestsWithNoCampaignAttached } from '@/app/lib/getQuestsWithNoCampaignAttached';

const MISSIONS_PAGE_REVALIDATE_SECONDS = 300;

export const fetchMissionsListForPage = (
  pagination: PaginationProps,
  daysAhead: number,
) =>
  unstable_cache(
    () => getQuestsWithNoCampaignAttached(pagination, daysAhead),
    ['missions-page-list', JSON.stringify(pagination), String(daysAhead)],
    { revalidate: MISSIONS_PAGE_REVALIDATE_SECONDS },
  )();

export const fetchQuestBySlugForPage = (slug: string) =>
  unstable_cache(
    () => fetchQuestBySlug(slug),
    ['missions-page-quest-by-slug', slug],
    {
      revalidate: MISSIONS_PAGE_REVALIDATE_SECONDS,
      tags: [`quest:slug:${slug}`],
    },
  )();

export const fetchProfileBannerCampaignsForPage = () =>
  unstable_cache(
    () => getProfileBannerCampaigns(),
    ['missions-page-banner-campaigns'],
    { revalidate: MISSIONS_PAGE_REVALIDATE_SECONDS },
  )();
