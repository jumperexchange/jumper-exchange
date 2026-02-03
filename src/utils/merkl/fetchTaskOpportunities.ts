import type {
  TaskVerification,
  TaskVerificationWithApy,
} from 'src/types/loyaltyPass';
import { getMerklApy } from './merklApy';

export const fetchTaskOpportunities = async (
  tasks: TaskVerification[],
): Promise<TaskVerificationWithApy[]> => {
  return await Promise.all(
    (tasks || []).map(async (task) => {
      const links = task.rewardApiLinks;
      if (!links?.length) {
        return task;
      }

      const { maxApy } = await getMerklApy(links);
      return { ...task, maxApy };
    }),
  );
};
