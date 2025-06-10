import { getMerklOpportunities } from 'src/app/lib/getMerklOpportunities';
import { TaskVerification } from 'src/types/loyaltyPass';
import { calculateMaxApy } from './merklHelper';

export const fetchTaskOpportunities = async (tasks: TaskVerification[]) => {
  return await Promise.all(
    (tasks || []).map(async (task) => {
      if (!task.CampaignId) return task;
      const maxApy = await getMerklOpportunities({
        campaignId: task.CampaignId,
      }).then((tasksItems) => {
        const maxApy = tasksItems.map((taskItem) => {
          return calculateMaxApy([taskItem]);
        });
        return maxApy[0];
      });
      return { ...task, maxApy };
    }),
  );
};
