'use client';
import {
  CustomWidget as CustomWidgetComponent,
  ProjectData,
} from '@/components/CustomWidget/CustomWidget';
import { useAccount } from '@lifi/wallet-management';

interface CustomWidgetPageProps {
  projectData: ProjectData;
}

const CustomWidgetPage = ({ projectData }: CustomWidgetPageProps) => {
  const { account } = useAccount();

  return <CustomWidgetComponent account={account} projectData={projectData} />;
};

export default CustomWidgetPage;
