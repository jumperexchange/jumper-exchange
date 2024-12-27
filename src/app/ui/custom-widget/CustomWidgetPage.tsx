'use client';
import type { ProjectData } from '@/components/CustomWidget/CustomWidget';
import { CustomWidget as CustomWidgetComponent } from '@/components/CustomWidget/CustomWidget';
import { useAccount } from '@lifi/wallet-management';

interface CustomWidgetPageProps {
  projectData: ProjectData;
  type: 'deposit' | 'withdraw';
}

const CustomWidgetPage = ({ projectData, type }: CustomWidgetPageProps) => {
  const { account } = useAccount();

  return (
    <CustomWidgetComponent
      account={account}
      projectData={projectData}
      type={type}
    />
  );
};

export default CustomWidgetPage;
