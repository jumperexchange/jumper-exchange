import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TFunction } from 'i18next';
import { FC } from 'react';
import { Trans } from 'react-i18next';

export const ZapDepositSuccessMessage: FC<{
  partnerName: string;
  t: TFunction;
}> = ({ partnerName, t }) => {
  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Typography variant="bodyMedium" color="text.secondary">
        <Trans
          i18nKey="widget.zap.depositSuccess"
          values={{ partnerName }}
          components={{ bold: <b /> }}
          t={t}
        />
      </Typography>
    </Box>
  );
};
