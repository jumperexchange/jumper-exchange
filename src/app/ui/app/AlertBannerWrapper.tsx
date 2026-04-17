import { BaseAlert } from '@/components/Alerts/BaseAlert/BaseAlert';
import { BaseAlertVariant } from '@/components/Alerts/BaseAlert/BaseAlert.styles';
import Box from '@mui/material/Box';
import { useEffect, type FC } from 'react';

import {
  chromeExtensionInjectedDetector,
  eip6963AnnounceProviderDetector,
  pocketUniverseDatasetCsnDetector,
  useExtensionDetection,
  useExtension,
} from '@/providers/ExtensionDetectionProvider/ExtensionDetectionProvider';
import { useTranslation } from 'react-i18next';
import { useAccount } from '@lifi/wallet-management';

const POCKET_UNIVERSE_EXTENSION = 'pocket';
const POCKET_UNIVERSE_EXTENSION_ID = 'gacgndbocaddlemdiaadajmlggabdeod';

const pocketUniverseDetectors = [
  chromeExtensionInjectedDetector(POCKET_UNIVERSE_EXTENSION_ID),
  eip6963AnnounceProviderDetector({ nameIncludes: 'Pocket Universe' }, 8000),
  pocketUniverseDatasetCsnDetector(100),
];

export const AlertBannerWrapper: FC = ({}) => {
  const { t } = useTranslation();
  const { register } = useExtensionDetection();
  const { detected } = useExtension(POCKET_UNIVERSE_EXTENSION);
  const { account } = useAccount();

  useEffect(() => {
    if (detected) {
      return;
    }

    register({
      name: POCKET_UNIVERSE_EXTENSION,
      detectors: pocketUniverseDetectors,
    });
  }, [register, detected]);

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
