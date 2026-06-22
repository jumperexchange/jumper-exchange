import { cache } from 'react';
import { QuestStrapiApi } from '@/utils/strapi/StrapiApi';
import type { Quest } from 'src/types/loyaltyPass';
import type { StrapiResponse } from 'src/types/strapi';
import { fetchStrapi } from '@/app/lib/fetchStrapi';

export const getQuestsBy = cache(async (key: string, value: string) => {
  const urlParams = new QuestStrapiApi()
    .filterBy(key, value)
    .populateCampaign();
  const apiUrl = urlParams.getApiUrl();

  const res = await fetchStrapi(
    decodeURIComponent(apiUrl),
    {
      next: {
        revalidate: 60 * 5,
        tags: [`quest:${key.toLowerCase()}:${value}`],
      },
    },
    'quests',
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data: StrapiResponse<Quest> = await res.json();

  return { data };
});
