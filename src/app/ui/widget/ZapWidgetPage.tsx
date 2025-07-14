import { ZapWidgetStack } from 'src/components/Zap/ZapWidgetStack';
import type { CustomInformation } from 'src/types/loyaltyPass';

interface ZapWidgetPageProps {
  customInformation: CustomInformation;
  type: 'deposit' | 'withdraw';
}

const ZapWidgetPage = ({ customInformation, type }: ZapWidgetPageProps) => {
  return <ZapWidgetStack customInformation={customInformation} />;
};

export default ZapWidgetPage;
