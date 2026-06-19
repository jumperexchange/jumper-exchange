import { cache } from 'react';
import { getQuestsBySlugs } from '@/app/lib/getQuestsBySlugs';
import type { Quest } from 'src/types/loyaltyPass';

// Cached so the detail pages can call it from both generateMetadata and the
// page render without fetching twice.
export const getQuestBySlug = cache(async (slug: string) => {
  const { data } = await getQuestsBySlugs<Quest>([slug], {
    withCampaign: true,
  });

  return {
    data: data.data.find((quest) => quest.Slug === slug),
  };
});
