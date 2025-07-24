'use client';

import { ClientOnly } from 'src/components/ClientOnly';
import { CustomInformation } from 'src/types/loyaltyPass';
import { FC, useMemo } from 'react';
import { WidgetSkeleton } from 'src/components/Widgets/variants/base/WidgetSkeleton';
import Box from '@mui/material/Box';
import { ZapDepositWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapDepositWidget';
import { TaskType } from 'src/types/strapi';
import { MISSION_WIDGET_ELEMENT_ID } from 'src/const/quests';
import { DepositPoolCard } from '../ZapWidget/DepositPoolCard/DepositPoolCard';
import { ZapInitProvider } from 'src/providers/ZapInitProvider/ZapInitProvider';

export interface ZapWidgetStackProps {
  customInformation?: CustomInformation;
}

export const ZapWidgetStack: FC<ZapWidgetStackProps> = ({
  customInformation,
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
    <ZapInitProvider projectData={projectData}>
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
          sx={{
            position: { lg: 'sticky' },
            top: {
              lg: 124,
            },
          }}
        >
          <ClientOnly>
            <ZapDepositWidget ctx={ctx} customInformation={customInformation} />
          </ClientOnly>
        </Box>
      </Box>
    </ZapInitProvider>
  );
};
