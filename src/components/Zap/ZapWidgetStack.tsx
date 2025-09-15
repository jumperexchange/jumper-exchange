'use client';

import Box from '@mui/material/Box';
import { FC, useMemo, useState } from 'react';
import { ClientOnly } from 'src/components/ClientOnly';
import { WidgetSkeleton } from 'src/components/Widgets/variants/base/WidgetSkeleton';
import { ZapDepositBackendWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapDepositBackendWidget';
import { ZapWithdrawWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapWithdrawWidget';
import { MISSION_WIDGET_ELEMENT_ID } from 'src/const/quests';
import { WidgetTrackingProvider } from 'src/providers/WidgetTrackingProvider';
import { CustomInformation, Quest } from 'src/types/loyaltyPass';
import { TaskType } from 'src/types/strapi';
import { DepositPoolCard } from '../ZapWidget/DepositPoolCard/DepositPoolCard';
import { HorizontalTabs } from 'src/components/HorizontalTabs/HorizontalTabs';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';

export interface ZapWidgetStackProps {
  customInformation?: CustomInformation;
  market?: Quest;
}

export const ZapWidgetStack: FC<ZapWidgetStackProps> = ({
  customInformation,
  market,
}) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  if (!customInformation || !customInformation.projectData) {
    return <WidgetSkeleton />;
  }

  const ctx = useMemo(() => {
    return {
      taskType: TaskType.Zap,
    };
  }, []);

  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  // Get zap data to check if user has deposited and if withdraw is available
  const {
    zapData,
    depositTokenData,
    isLoadingDepositTokenData,
  } = useEnhancedZapData(projectData);

  const hasDeposited = !isLoadingDepositTokenData && !!depositTokenData;
  const hasWithdrawAbi = !!zapData?.abi?.withdraw;

  const tabs = useMemo(() => [
    {
      value: 'deposit',
      label: 'Deposit',
    },
    {
      value: 'withdraw',
      label: 'Withdraw',
      disabled: !hasDeposited || !hasWithdrawAbi,
    },
  ], [hasDeposited, hasWithdrawAbi]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue as 'deposit' | 'withdraw');
  };

  const renderWidget = () => {
    if (activeTab === 'deposit') {
      return (
        <ZapDepositBackendWidget
          ctx={ctx}
          customInformation={customInformation}
        />
      );
    } else {
      return (
        <ZapWithdrawWidget
          ctx={ctx}
          customInformation={customInformation}
        />
      );
    }
  };

  return (
    <WidgetTrackingProvider>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <DepositPoolCard customInformation={customInformation} />
        <Box
          id={MISSION_WIDGET_ELEMENT_ID}
          data-testid="zap-widget-container"
          sx={{
            position: { lg: 'sticky' },
            top: {
              lg: 124,
            },
          }}
        >
          <Box sx={{ marginBottom: 3 }}>
            <HorizontalTabs
              tabs={tabs}
              value={activeTab}
              onChange={handleTabChange}
            />
          </Box>
          <ClientOnly>
            {renderWidget()}
          </ClientOnly>
        </Box>
      </Box>
    </WidgetTrackingProvider>
  );
};
