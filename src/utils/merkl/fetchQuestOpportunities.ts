import {
  getMerklOpportunities,
  MerklOpportunity,
} from 'src/app/lib/getMerklOpportunities';
import { QuestDataExtended } from 'src/types/merkl';
import type { QuestData } from 'src/types/strapi';
import { calculateMaxApy } from './merklHelper';

/**
 * Fetches Merkl opportunities for a given array of rewardsIds
 */
export const fetchOpportunitiesByRewardsIds = async (
  rewardsIds: unknown,
): Promise<MerklOpportunity[]> => {
  return Array.isArray(rewardsIds) && rewardsIds.length > 0
    ? await getMerklOpportunities({ searchQueries: rewardsIds })
    : [];
};

export const fetchQuestOpportunitiesByRewardsIds = async (
  questsData: QuestData[],
): Promise<QuestDataExtended[]> => {
  const extendedQuests = await Promise.all(
    questsData.map(async (quest) => {
      const rewardsIds = quest.CustomInformation?.rewardsIds;
      const opportunities = await fetchOpportunitiesByRewardsIds(rewardsIds);
      const maxApy = calculateMaxApy(opportunities);

      return {
        ...quest,
        opportunities,
        maxApy,
      };
    }),
  );
  return extendedQuests as QuestDataExtended[];
};

export const fetchQuestOpportunitiesByClaimingIds = async (
  questsData: QuestData[],
): Promise<QuestDataExtended[]> => {
  // Extract all unique claiming IDs from quests
  const identifiers = questsData
    .flatMap((quest: QuestData) => {
      const claimingId = quest.ClaimingId;
      const claimingIds = quest.CustomInformation?.['claimingIds'];
      return [claimingId, ...(Array.isArray(claimingIds) ? claimingIds : [])];
    })
    .filter((id): id is string => !!id);

  // Fetch max APY for all quests at once
  const merklOpportunities = await getMerklOpportunities({
    searchQueries: identifiers,
  });

  // Calculate max APY for all quests
  const maxApy = calculateMaxApy(merklOpportunities);

  // Add max APY to each quest
  return questsData.map((quest) => {
    const questExtended = {
      ...quest,
      opportunities: [],
      maxApy: maxApy,
    } as QuestDataExtended & { maxApy?: number };
    return questExtended;
  });
};
