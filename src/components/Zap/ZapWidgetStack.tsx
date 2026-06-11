'use client';

import Box from '@mui/material/Box';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ClientOnly } from '@/components/ClientOnly';
import { WidgetSkeleton } from '@/components/Widgets/variants/base/WidgetSkeleton';
import { ZapDepositBackendWidget } from '@/components/Widgets/variants/base/ZapWidget/ZapDepositBackendWidget';
import { MISSION_WIDGET_ELEMENT_ID } from '@/const/quests';
import { WidgetTrackingProvider } from '@/providers/WidgetTrackingProvider';
import type { CustomInformation, Quest } from '@/types/loyaltyPass';
import { TaskType } from '@/types/strapi';
import { DepositPoolCard } from '../ZapWidget/DepositPoolCard/DepositPoolCard';
import { useEnhancedZapData } from '@/hooks/zaps/useEnhancedZapData';
import { useZapQuestIdStorage } from '@/providers/hooks';
import envConfig from '@/config/env-config';

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

  const ctx = {
    taskType: TaskType.Zap as const,
  };

  const projectData = customInformation?.projectData;

  // Get zap data to check if user has deposited and if withdraw is available
  const {
    zapData,
    depositTokenData,
    depositTokenDecimals,
    isLoadingDepositTokenData,
    isSuccess: isZapDataSuccess,
    refetchDepositToken,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useEnhancedZapData(projectData);

  const hasDeposited = !isLoadingDepositTokenData && !!depositTokenData;
  const hasWithdrawAbi = !!zapData?.abi?.withdraw;

  return (
    <WidgetTrackingProvider variant="zap">
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
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
          <ClientOnly fallback={<WidgetSkeleton />}>
            <ZapDepositBackendWidget
              ctx={ctx}
              customInformation={customInformation}
              refetchDepositToken={refetchDepositToken}
              zapData={zapData}
              isZapDataSuccess={isZapDataSuccess}
              integrator={envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR_ZAP}
            />
          </ClientOnly>
        </Box>
      </Box>
    </WidgetTrackingProvider>
  );
};
