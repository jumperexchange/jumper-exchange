import type { CustomInformation, Quest } from 'src/types/loyaltyPass';
import { fetchTaskOpportunities } from 'src/utils/merkl/fetchTaskOpportunities';
import { TwoColumnLayout } from '../TwoColumnLayout/TwoColumnLayout';
import { ZapDetails } from './ZapDetails';
import { ZapWidgetStack } from './ZapWidgetStack';

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
      // Demo testing backend integration
      sideContent={
        <ZapWidgetStack market={market} customInformation={detailInformation} />
      }
      shouldStretchSideContent
    />
  );
};
