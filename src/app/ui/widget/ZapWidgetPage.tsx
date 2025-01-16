'use client';
import type { ProjectData } from 'src/components/ZapWidget/ZapWidget';
import { ZapWidget } from 'src/components/ZapWidget/ZapWidget';
import { useAccount } from '@lifi/wallet-management';
import type { CustomInformation } from 'src/types/loyaltyPass';

interface ZapWidgetPageProps {
  customInformation: CustomInformation;
  type: 'deposit' | 'withdraw';
}

const ZapWidgetPage = ({ customInformation, type }: ZapWidgetPageProps) => {
  const { account } = useAccount();

  return (
    <ZapWidget
      account={account}
      projectData={customInformation?.projectData}
      claimingIds={customInformation?.claimingIds}
      type={type}
    />
  );
};

export default ZapWidgetPage;
