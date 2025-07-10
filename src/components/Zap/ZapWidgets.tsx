'use client';

import { FC } from 'react';
import { DepositPoolCard } from '../ZapWidget/DepositPoolCard/DepositPoolCard';
import { CustomInformation } from 'src/types/loyaltyPass';
import Box from '@mui/material/Box';
import { ZapWidgetTabs } from './ZapWidgetTabs';
import { ZapWidget } from './ZapWidget';

interface ZapWidgetsProps {
  detailInformation?: CustomInformation;
}
export const ZapWidgets: FC<ZapWidgetsProps> = ({ detailInformation }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <DepositPoolCard customInformation={detailInformation} />
      <ZapWidgetTabs
        renderChildren={(activeTab) => {
          if (activeTab === 0) {
            return (
              <ZapWidget customInformation={detailInformation} type="deposit" />
            );
          }
          return (
            <ZapWidget customInformation={detailInformation} type="withdraw" />
          );
        }}
      />
    </Box>
  );
};
