import { getQuestsBy } from '@/app/lib/getQuestsBy';

export async function getQuestBySlug(slug: string) {
  const quests = await getQuestsBy('Slug', slug);

  if (!quests) {
    return {
      data: undefined,
    };
  }

  return {
    data: quests.data.data.find((quest) => quest.Slug === slug),
    url: quests.url,
  };
}
