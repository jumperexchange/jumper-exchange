import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ParseKeys, TFunction } from 'i18next';
import type { FC } from 'react';
import { Trans } from 'react-i18next';

export const ZapDepositSuccessMessage: FC<{
  partnerName: string;
  t: TFunction;
  messageKey?: ParseKeys<'translation'>;
}> = ({ partnerName, t, messageKey }) => {
  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Typography
        variant="bodyMedium"
        sx={{
          color: 'text.secondary',
        }}
      >
        <Trans<ParseKeys<'translation'>>
          i18nKey={messageKey || 'widget.zap.depositSuccess'}
          values={{ partnerName }}
          components={{ bold: <b /> }}
          t={t}
        />
      </Typography>
    </Box>
  );
};
