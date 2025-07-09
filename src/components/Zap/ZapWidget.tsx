'use client';

import { ClientOnly } from 'src/components/ClientOnly';
import { CustomInformation } from 'src/types/loyaltyPass';
import { FC, useMemo } from 'react';
import { WidgetSkeleton } from 'src/components/Widgets/variants/base/WidgetSkeleton';
import Box from '@mui/material/Box';
import { ZapDepositWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapDepositWidget';
import { ZapWithdrawWidget } from 'src/components/Widgets/variants/base/ZapWidget/ZapWithdrawWidget';
import { TaskType } from 'src/types/strapi';

export interface ZapWidgetProps {
  type: 'deposit' | 'withdraw';
  customInformation?: CustomInformation;
}

export const ZapWidget: FC<ZapWidgetProps> = ({ customInformation, type }) => {
  if (!customInformation || !customInformation.projectData) {
    return <WidgetSkeleton />;
  }

  const ctx = useMemo(() => {
    return {
      taskType: TaskType.Zap,
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <ClientOnly>
        {type === 'deposit' ? (
          <ZapDepositWidget ctx={ctx} customInformation={customInformation} />
        ) : (
          <ZapWithdrawWidget ctx={ctx} customInformation={customInformation} />
        )}
      </ClientOnly>
    </Box>
  );
};
