import { getMerklOpportunities } from 'src/app/lib/getMerklOpportunities';
import {
  TaskVerification,
  TaskVerificationWithApy,
} from 'src/types/loyaltyPass';
import { calculateMaxApy } from './merklHelper';

export const fetchTaskOpportunities = async (
  tasks: TaskVerification[],
): Promise<TaskVerificationWithApy[]> => {
  return await Promise.all(
    (tasks || []).map(async (task) => {
      if (!task.CampaignId) return task;

      const opportunities = await getMerklOpportunities({
        campaignId: task.CampaignId,
      });

      if (!opportunities.length) return task;

      // Calculate APY only if we have opportunities
      const maxApy = calculateMaxApy(opportunities);

      return { ...task, maxApy };
    }),
  );
};
