import { FC } from 'react';
import { notFound } from 'next/navigation';

import { getQuestBySlug } from 'src/app/lib/getQuestBySlug';
import { fetchTaskOpportunities } from 'src/utils/merkl/fetchTaskOpportunities';
import { fetchOpportunitiesByRewardsIds } from 'src/utils/merkl/fetchQuestOpportunities';
import { MissionDetails } from './MissionDetails';
import { MissionWidget } from './MissionWidget/MissionWidget';
import { TwoColumnLayout } from 'src/components/TwoColumnLayout/TwoColumnLayout';

interface MissionPageProps {
  slug: string;
}

export const MissionPage: FC<MissionPageProps> = async ({ slug }) => {
  const { data } = await getQuestBySlug(slug);
  if (!data) {
    return notFound();
  }

  const rewardsIds = data.CustomInformation?.['rewardsIds'];
  const tasksVerification = data.tasks_verification;
  const [rewardOpportunities, taskOpportunities] = await Promise.all([
    fetchOpportunitiesByRewardsIds(rewardsIds),
    fetchTaskOpportunities(tasksVerification),
  ]);

  return (
    <TwoColumnLayout
      mainContent={<MissionDetails mission={data} tasks={taskOpportunities} />}
      sideContent={<MissionWidget customInformation={data.CustomInformation} />}
    />
  );
};
