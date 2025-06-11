import { getMerklOpportunities } from 'src/app/lib/getMerklOpportunities';
import { TaskVerification } from 'src/types/loyaltyPass';
import { calculateMaxApy } from './merklHelper';

export const fetchTaskOpportunities = async (tasks: TaskVerification[]) => {
  return await Promise.all(
    (tasks || []).map(async (task) => {
      if (!task.CampaignId) return task;

      const opportunities = await getMerklOpportunities({
        campaignId: task.CampaignId,
      });

      const apyValues = opportunities.map((opportunity) =>
        calculateMaxApy([opportunity]),
      );

      // Though if here we only need the 1st opportunity APY we could compute only that
      // Otherwise we might consider using Math.max(...apyValues)
      const maxApy = apyValues.length > 0 ? apyValues[0] : 0;

      return { ...task, maxApy };
    }),
  );
};
