import { getQuestBy } from '@/app/lib/getQuestBy';

export async function getQuestByLabel(label: string) {
  return getQuestBy('Label', label);
}
