import { useMemo } from 'react';
import type { TaskVerificationWithApy } from 'src/types/loyaltyPass';
import { useMissionTaskApy } from '@/hooks/mission/useMissionApy';

export const useFormatDisplayTaskData = (
  missionSlug: string,
  task: TaskVerificationWithApy & {
    isVerified: boolean;
    isRequired: boolean;
  },
) => {
  const { data: apyData } = useMissionTaskApy(missionSlug, task.uuid);
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
      apy: apyData?.total || 0,
      isVerified,
      isRequired,
    };
  }, [task, apyData]);
};
