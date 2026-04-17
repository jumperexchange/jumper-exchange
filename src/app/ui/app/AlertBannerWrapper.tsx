import { BaseAlert } from '@/components/Alerts/BaseAlert/BaseAlert';
import { BaseAlertVariant } from '@/components/Alerts/BaseAlert/BaseAlert.styles';
import Box from '@mui/material/Box';
import { type FC } from 'react';

import { useExtension } from '@/providers/ExtensionDetectionProvider/ExtensionDetectionProvider';
import { POCKET_UNIVERSE_EXTENSION } from '@/providers/ExtensionDetectionProvider/extensionDetectionInitialDefinitions';
import { useTranslation } from 'react-i18next';
import { useAccount } from '@lifi/wallet-management';

export const AlertBannerWrapper: FC = ({}) => {
  const { t } = useTranslation();
  const { detected } = useExtension(POCKET_UNIVERSE_EXTENSION);
  const { account } = useAccount();

  if (!detected || !account?.isConnected) {
    return null;
  }

  return (
    <Box
      sx={{
        marginTop: 2,
        maxWidth: {
          xs: '100%',
          sm: 420,
        },
      }}
    >
      <BaseAlert
        title={t('alerts.extension', {
          extensionName: 'Pocket Universe',
          fee: 0.8,
        })}
        variant={BaseAlertVariant.Warning}
        sx={{
          '.MuiTypography-root': { fontWeight: 500 },
        }}
      />
    </Box>
  );
};
