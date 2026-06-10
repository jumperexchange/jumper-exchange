import type { CustomInformation, Quest } from 'src/types/loyaltyPass';
import { TwoColumnLayout } from '../TwoColumnLayout/TwoColumnLayout';
import { ZapDetails } from './ZapDetails';
import { ZapWidgetStack } from './ZapWidgetStack';

interface ZapPageProps {
  market: Quest;
  detailInformation?: CustomInformation;
}

export const ZapPage = async ({ market, detailInformation }: ZapPageProps) => {
  return (
    <TwoColumnLayout
      mainContent={<ZapDetails market={market} />}
      // Demo testing backend integration
      sideContent={
        <ZapWidgetStack market={market} customInformation={detailInformation} />
      }
      shouldStretchSideContent
    />
  );
};
