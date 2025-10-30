'use client';

import Box from '@mui/material/Box';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ClientOnly } from 'src/components/ClientOnly';
import { WidgetSkeleton } from 'src/components/Widgets/variants/base/WidgetSkeleton';
import { ZapDepositBackendWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapDepositBackendWidget';
import { MISSION_WIDGET_ELEMENT_ID } from 'src/const/quests';
import { WidgetTrackingProvider } from 'src/providers/WidgetTrackingProvider';
import { CustomInformation, Quest } from 'src/types/loyaltyPass';
import { TaskType } from 'src/types/strapi';
import { DepositPoolCard } from '../ZapWidget/DepositPoolCard/DepositPoolCard';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';
import { SweepTokensCard } from '../ZapWidget/SweepTokensCard/SweepTokensCard';
import { useZapQuestIdStorage } from 'src/providers/hooks';

export interface ZapWidgetStackProps {
  customInformation?: CustomInformation;
  market?: Quest;
}

export const ZapWidgetStack: FC<ZapWidgetStackProps> = ({
  customInformation,
  market,
}) => {
  useZapQuestIdStorage();
  const { t } = useTranslation();

  if (!customInformation || !customInformation.projectData) {
    return <WidgetSkeleton />;
  }

  const ctx = useMemo(() => {
    return {
      taskType: TaskType.Zap as const,
    };
  }, []);

  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  // Get zap data to check if user has deposited and if withdraw is available
  const {
    zapData,
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    isSuccess: isZapDataSuccess,
    refetchDepositToken,
  } = useEnhancedZapData(projectData);

  const hasDeposited = !isLoadingDepositTokenData && !!depositTokenData;
  const hasWithdrawAbi = !!zapData?.abi?.withdraw;

  const tabs = useMemo(
    () => [
      {
        value: 'deposit',
        label: t('widget.zap.tabs.deposit'),
      },
      {
        value: 'withdraw',
        label: t('widget.zap.tabs.withdraw'),
        disabled: !hasDeposited || !hasWithdrawAbi,
      },
    ],
    [hasDeposited, hasWithdrawAbi, t],
  );

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
        <SweepTokensCard customInformation={customInformation} />
        <DepositPoolCard
          customInformation={customInformation}
          zapData={zapData}
          isZapDataSuccess={isZapDataSuccess}
          depositTokenData={depositTokenData}
          depositTokenDecimals={depositTokenDecimals}
          isLoadingDepositTokenData={isLoadingDepositTokenData}
        />
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
          <ClientOnly>
            <ZapDepositBackendWidget
              ctx={ctx}
              customInformation={customInformation}
              refetchDepositToken={refetchDepositToken}
              zapData={zapData}
              isZapDataSuccess={isZapDataSuccess}
            />
          </ClientOnly>
        </Box>
      </Box>
    </WidgetTrackingProvider>
  );
};
