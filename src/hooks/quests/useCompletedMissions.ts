import { useQuery } from '@tanstack/react-query';
import {
  compact,
  every,
  filter,
  groupBy,
  map,
  mapValues,
  max,
  orderBy,
} from 'lodash';
import { getQuestsBySlugs } from 'src/app/lib/getQuestsBySlugs';
import { useGetVerifiedTasks } from 'src/hooks/tasksVerification/useGetVerifiedTasks';
import type { QuestData } from 'src/types/strapi';

export interface CompletedMission {
  quest: QuestData;
  completedAt: Date;
}

interface VerifiedTask {
  slug: string;
  stepId: string;
  timestamp: Date | string;
}

// A mission counts as completed when every verifiable task (`hasTask`) has a
// task verification recorded for the wallet. Verifications are joined to
// quests by slug — the questId they carry is a Strapi documentId that does not
// survive re-publishing / environment moves, while the slug is the stable
// public key. `completedAt` is the latest verification timestamp, and missions
// are sorted newest first.
export const deriveCompletedMissions = (
  verifiedTasks: VerifiedTask[],
  quests: QuestData[],
): CompletedMission[] => {
  const verificationsByQuest = mapValues(
    groupBy(verifiedTasks, 'slug'),
    (tasks) => ({
      stepIds: new Set(map(tasks, 'stepId')),
      timestamps: map(tasks, (task) => new Date(task.timestamp)),
    }),
  );

  const missions = compact(
    quests.map((quest) => {
      const verifications = verificationsByQuest[quest.Slug];
      const verifiableTasks = filter(quest.tasks_verification, 'hasTask');
      const isCompleted =
        verifications &&
        verifiableTasks.length > 0 &&
        every(verifiableTasks, (task) => verifications.stepIds.has(task.uuid));
      if (!isCompleted) {
        return null;
      }
      return { quest, completedAt: max(verifications.timestamps) as Date };
    }),
  );

  return orderBy(missions, 'completedAt', 'desc');
};

// Missions the wallet has completed. The task verifications only carry the
// quest slug, so the quests themselves are fetched from Strapi to get
// title / image / points. Quests that no longer exist in Strapi are omitted.
export const useCompletedMissions = (walletAddress?: string) => {
  const { data: verifiedTasks, isLoading: isVerificationsLoading } =
    useGetVerifiedTasks(walletAddress);

  const slugs = [
    ...new Set((verifiedTasks ?? []).map((task) => task.slug)),
  ].sort();

  const { data: quests, isLoading: isQuestsLoading } = useQuery({
    queryKey: ['completed-missions', slugs],
    queryFn: async () => {
      const { data } = await getQuestsBySlugs(slugs);
      return data.data;
    },
    enabled: slugs.length > 0,
  });

  return {
    completedMissions: deriveCompletedMissions(
      verifiedTasks ?? [],
      quests ?? [],
    ),
    isLoading: isVerificationsLoading || (slugs.length > 0 && isQuestsLoading),
  };
};
