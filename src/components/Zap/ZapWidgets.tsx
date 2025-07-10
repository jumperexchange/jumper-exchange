'use client';

import { FC } from 'react';
import { ZapWidget } from './ZapWidget';
import { DepositPoolCard } from '../ZapWidget/DepositPoolCard/DepositPoolCard';
import { CustomInformation } from 'src/types/loyaltyPass';
import Box from '@mui/material/Box';

interface ZapWidgetsProps {
  detailInformation?: CustomInformation;
}
export const ZapWidgets: FC<ZapWidgetsProps> = ({ detailInformation }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <DepositPoolCard customInformation={detailInformation} />
      <ZapWidget customInformation={detailInformation} type="deposit" />
    </Box>
  );
};
