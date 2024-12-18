'use client';
import type { ProjectData } from '@/components/CustomWidget/CustomWidget';
import { CustomWidget as CustomWidgetComponent } from '@/components/CustomWidget/CustomWidget';
import { useAccount } from '@lifi/wallet-management';

interface CustomWidgetPageProps {
  projectData: ProjectData;
}

const CustomWidgetPage = ({ projectData }: CustomWidgetPageProps) => {
  const { account } = useAccount();

  return <CustomWidgetComponent account={account} projectData={projectData} />;
};

export default CustomWidgetPage;
