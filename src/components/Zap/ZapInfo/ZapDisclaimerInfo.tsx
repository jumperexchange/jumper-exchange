'use client';

import InfoIcon from '@mui/icons-material/Info';
import { alpha, Box, Skeleton, Typography } from '@mui/material';
import type { CustomInformation, Quest } from 'src/types/loyaltyPass';
import { ZapActionProtocolDisclaimer } from './ZapInfo.style';

interface ZapPageProps {
  market?: Quest;
  detailInformation?: CustomInformation;
}

export const ZapDisclaimerInfo = ({ market }: ZapPageProps) => {
  return (
    <ZapActionProtocolDisclaimer>
      <InfoIcon
        sx={(theme) => ({
          color: alpha(theme.palette.text.primary, 0.48),
        })}
      />
      <Typography variant="bodySmall">{market?.Information}</Typography>
    </ZapActionProtocolDisclaimer>
  );
};
