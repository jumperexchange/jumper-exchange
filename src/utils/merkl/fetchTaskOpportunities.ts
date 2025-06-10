import { getMerklOpportunities } from 'src/app/lib/getMerklOpportunities';
import { TaskVerification } from 'src/types/loyaltyPass';

export const fetchTaskOpportunities = async (tasks: TaskVerification[]) => {
  return await Promise.all(
    (tasks || []).map(async (task) => {
      if (!task.CampaignId) return task;
      const opportunity = await getMerklOpportunities({
        campaignId: task.CampaignId,
      });
      return {
        ...task,
        opportunity,
      };
    }),
  );
};
