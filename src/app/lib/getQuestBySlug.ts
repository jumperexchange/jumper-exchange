import { getQuestBy } from '@/app/lib/getQuestBy';

export async function getQuestBySlug(slug: string) {
  return await getQuestBy('Slug', slug);
}
