'use client';

import { FC } from 'react';
import { DepositPoolCard } from '../ZapWidget/DepositPoolCard/DepositPoolCard';
import { CustomInformation } from 'src/types/loyaltyPass';
import Box from '@mui/material/Box';
import { ZapWidgetTabs } from './ZapWidgetTabs';
import { ZapWidget } from './ZapWidget';
import { MISSION_WIDGET_ELEMENT_ID } from 'src/const/quests';

interface ZapWidgetsProps {
  detailInformation?: CustomInformation;
}
export const ZapWidgets: FC<ZapWidgetsProps> = ({ detailInformation }) => {
  return (
    <Box
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}
    >
      <DepositPoolCard customInformation={detailInformation} />
      <Box
        id={MISSION_WIDGET_ELEMENT_ID}
        sx={{
          position: { lg: 'sticky' },
          top: {
            lg: 124,
          },
        }}
      >
        <ZapWidgetTabs
          renderChildren={(activeTab) => {
            if (activeTab === 0) {
              return (
                <ZapWidget
                  customInformation={detailInformation}
                  type="deposit"
                />
              );
            }
            return (
              <ZapWidget
                customInformation={detailInformation}
                type="withdraw"
              />
            );
          }}
        />
      </Box>
    </Box>
  );
};
