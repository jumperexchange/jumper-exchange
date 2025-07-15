import type { CustomInformation, Quest } from 'src/types/loyaltyPass';
import { TwoColumnLayout } from '../TwoColumnLayout/TwoColumnLayout';
import { ZapDetails } from './ZapDetails';
import { ZapWidgetStack } from './ZapWidgetStack';
import { fetchTaskOpportunities } from 'src/utils/merkl/fetchTaskOpportunities';

interface ZapPageProps {
  market: Quest;
  detailInformation?: CustomInformation;
}

export const ZapPage = async ({ market, detailInformation }: ZapPageProps) => {
  const tasksVerification = market.tasks_verification;
  const taskOpportunities = await fetchTaskOpportunities(tasksVerification);

  return (
    <TwoColumnLayout
      mainContent={<ZapDetails market={market} tasks={taskOpportunities} />}
      sideContent={<ZapWidgetStack customInformation={detailInformation} />}
      shouldStretchSideContent
    />
  );
};
