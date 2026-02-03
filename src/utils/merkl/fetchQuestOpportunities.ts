import type { QuestDataExtended } from 'src/types/merkl';
import type { QuestData } from 'src/types/strapi';
import { getMerklApy } from './merklApy';

export const fetchQuestOpportunitiesByMerklLinks = async (
  questsData: QuestData[],
): Promise<QuestDataExtended[]> => {
  return await Promise.all(
    questsData.map(async (quest) => {
      const links = quest.rewardApiLinks;
      const { opportunities, maxApy } = links?.length
        ? await getMerklApy(links)
        : { opportunities: [], maxApy: 0 };

      return {
        ...quest,
        opportunities,
        maxApy,
      };
    }),
  );
};
