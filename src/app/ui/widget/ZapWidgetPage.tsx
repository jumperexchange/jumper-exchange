import { ZapWidget } from 'src/components/Zap/ZapWidget';
import type { CustomInformation } from 'src/types/loyaltyPass';

interface ZapWidgetPageProps {
  customInformation: CustomInformation;
  type: 'deposit' | 'withdraw';
}

const ZapWidgetPage = ({ customInformation, type }: ZapWidgetPageProps) => {
  return <ZapWidget customInformation={customInformation} type={type} />;
};

export default ZapWidgetPage;
