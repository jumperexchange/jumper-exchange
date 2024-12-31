import { getQuestBy } from '@/app/lib/getQuestBy';

export async function getQuestBySlug(slug: string) {
  return getQuestBy('Slug', slug);
}
