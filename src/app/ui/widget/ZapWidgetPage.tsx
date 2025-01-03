'use client';
import type { ProjectData } from 'src/components/ZapWidget/ZapWidget';
import { ZapWidget } from 'src/components/ZapWidget/ZapWidget';
import { useAccount } from '@lifi/wallet-management';

interface ZapWidgetPageProps {
  projectData: ProjectData;
  type: 'deposit' | 'withdraw';
}

const ZapWidgetPage = ({ projectData, type }: ZapWidgetPageProps) => {
  const { account } = useAccount();

  return <ZapWidget account={account} projectData={projectData} type={type} />;
};

export default ZapWidgetPage;
