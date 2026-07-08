import { QuestStrapiApi } from '@/utils/strapi/StrapiApi';
import type { QuestData, StrapiResponse } from 'src/types/strapi';

interface GetQuestsBySlugsOptions {
  // Also populate the campaign relation (needed by the detail pages).
  withCampaign?: boolean;
}

// The quest payload is typed as QuestData in list contexts and as Quest
// (src/types/loyaltyPass) on the detail pages; the type parameter lets each
// caller keep its existing shape.
export async function getQuestsBySlugs<T = QuestData>(
  slugs: string[],
  { withCampaign = false }: GetQuestsBySlugsOptions = {},
) {
  if (slugs.length === 0) {
    return { data: { data: [] } };
  }

  const urlParams = new QuestStrapiApi()
    .filterBySlugs(slugs)
    .addPaginationParams({
      page: 1,
      pageSize: slugs.length,
      withCount: false,
    });
  if (withCampaign) {
    urlParams.populateCampaign();
  }
  const apiUrl = urlParams.getApiUrl();

  const res = await fetch(decodeURIComponent(apiUrl), {
    next: {
      revalidate: 60 * 5, // revalidate every 5 minutes
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data: StrapiResponse<T> = await res.json();

  return { data };
}
