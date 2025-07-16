import { useMemo } from 'react';
import { TaskVerificationWithApy } from 'src/types/loyaltyPass';

export const useFormatDisplayTaskData = (
  task: TaskVerificationWithApy & {
    isVerified: boolean;
    isRequired: boolean;
  },
) => {
  return useMemo(() => {
    const {
      id,
      name,
      description,
      CTALink,
      CTAText,
      CampaignId,
      TaskType,
      uuid,
      hasTask,
      maxApy,
      isVerified,
      isRequired,
    } = task;

    return {
      id: id.toString(),
      taskId: uuid,
      title: name || '',
      description: description || '',
      campaignId: CampaignId,
      href: CTALink,
      linkLabel: CTAText,
      shouldVerify: hasTask,
      taskType: TaskType,
      maxApy,
      isVerified,
      isRequired,
    };
  }, [JSON.stringify(task ?? {})]);
};
