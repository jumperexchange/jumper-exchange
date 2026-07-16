import { getQuestBySlug } from '@/app/lib/getQuestBySlug';

export const questBySlugQueryKey = (slug: string) =>
  ['quest-by-slug', slug] as const;

export const fetchQuestBySlug = async (slug: string) => {
  const { data } = await getQuestBySlug(slug);
  return data ?? null;
};
