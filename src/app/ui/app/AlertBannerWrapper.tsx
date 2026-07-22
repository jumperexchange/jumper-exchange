import { BaseAlert } from '@/components/Alerts/BaseAlert/BaseAlert';
import { BaseAlertVariant } from '@/components/Alerts/BaseAlert/BaseAlert.styles';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import { type FC } from 'react';

import { useExtensionDetectionStatus } from '@/providers/ExtensionDetectionProvider/ExtensionDetectionProvider';
import { POCKET_UNIVERSE_EXTENSION } from '@/providers/ExtensionDetectionProvider/extensionDetectionInitialDefinitions';
import { useTranslation } from 'react-i18next';
import { useAccount } from '@jumperexchange/wallet-management';

export const AlertBannerWrapper: FC = ({}) => {
  const { t } = useTranslation();
  const { detected } = useExtensionDetectionStatus(POCKET_UNIVERSE_EXTENSION);
  const { account } = useAccount();
  const showAlert = detected && !!account?.isConnected;

  return (
    <Fade in={showAlert} timeout={400} mountOnEnter unmountOnExit>
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
          })}
          variant={BaseAlertVariant.Warning}
          sx={{
            '.MuiTypography-root': { fontWeight: 500 },
          }}
        />
      </Box>
    </Fade>
  );
};
