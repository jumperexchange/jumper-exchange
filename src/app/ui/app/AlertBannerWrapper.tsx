import { BaseAlert } from '@/components/Alerts/BaseAlert/BaseAlert';
import { BaseAlertVariant } from '@/components/Alerts/BaseAlert/BaseAlert.styles';
import Box from '@mui/material/Box';
import { useEffect, type FC } from 'react';

import {
  chromeExtensionInjectedDetector,
  messageHandshakeDetector,
  useExtensionDetection,
  useExtension,
} from '@/providers/ExtensionDetectionProvider/ExtensionDetectionProvider';
import { useTranslation } from 'react-i18next';

const POCKET_UNIVERSE_EXTENSION = 'pocket';

/** Chrome Web Store ID — appears in `chrome-extension://…` URLs for injected assets. */
const POCKET_UNIVERSE_EXTENSION_ID = 'gacgndbocaddlemdiaadajmlggabdeod';

const pocketUniverseDetectors = [
  chromeExtensionInjectedDetector(POCKET_UNIVERSE_EXTENSION_ID),
  messageHandshakeDetector(
    { type: 'jumper-extension-detection', action: 'probe' },
    '*',
    1000,
  ),
];

export const AlertBannerWrapper: FC = ({}) => {
  const { t } = useTranslation();
  const { register } = useExtensionDetection();
  const { detected } = useExtension(POCKET_UNIVERSE_EXTENSION);

  useEffect(() => {
    if (detected) {
      return;
    }

    register({
      name: POCKET_UNIVERSE_EXTENSION,
      detectors: pocketUniverseDetectors,
    });
  }, [register, detected]);

  if (!detected) {
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
          extensionName: 'Example Extension',
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
