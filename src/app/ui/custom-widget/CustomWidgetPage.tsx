'use client';
import { CustomWidget as CustomWidgetComponent } from '@/components/CustomWidget/CustomWidget';
import { useAccount } from '@lifi/wallet-management';

const CustomWidgetPage = () => {
  const { account } = useAccount();

  return <CustomWidgetComponent account={account} />;
};

export default CustomWidgetPage;
