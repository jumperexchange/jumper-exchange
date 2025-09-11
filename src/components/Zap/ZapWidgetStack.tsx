'use client';

import Box from '@mui/material/Box';
import { FC, useMemo } from 'react';
import { ClientOnly } from 'src/components/ClientOnly';
import { WidgetSkeleton } from 'src/components/Widgets/variants/base/WidgetSkeleton';
import { ZapDepositBackendWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapDepositBackendWidget';
import { MISSION_WIDGET_ELEMENT_ID } from 'src/const/quests';
import { WidgetTrackingProvider } from 'src/providers/WidgetTrackingProvider';
import { CustomInformation, Quest } from 'src/types/loyaltyPass';
import { TaskType } from 'src/types/strapi';
import { DepositPoolCard } from '../ZapWidget/DepositPoolCard/DepositPoolCard';

export interface ZapWidgetStackProps {
  customInformation?: CustomInformation;
  market?: Quest;
}

export const ZapWidgetStack: FC<ZapWidgetStackProps> = ({
  customInformation,
  market,
}) => {
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
          <ClientOnly>
            <ZapDepositBackendWidget
              ctx={ctx}
              customInformation={customInformation}
            />
          </ClientOnly>
        </Box>
      </Box>
    </WidgetTrackingProvider>
  );
};
