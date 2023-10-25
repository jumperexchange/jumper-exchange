import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { WarningMessageCard, WarningMessageCardTitle } from '..';
import { ButtonTransparent } from '../../atoms';
import { appendUTMParametersToLink, openInNewTab } from '../../utils';

export const TestnetAlert = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const PROD_URL = appendUTMParametersToLink('https://jumper.exchange/', {
    utm_medium: 'testnet_banner',
    utm_campaign: 'testnet_to_jumper',
  });

  const handleClick = () => {
    openInNewTab(PROD_URL);
  };

  return (
    <WarningMessageCard mt={theme.spacing(4)}>
      <WarningMessageCardTitle display="flex" alignItems="center" px={2} pt={2}>
        <WarningRoundedIcon
          sx={{
            marginRight: 1,
          }}
        />
        <Typography variant={'lifiHeaderXSmall'}>{t('alert.info')}</Typography>
      </WarningMessageCardTitle>
      <Typography variant={'lifiBodySmall'} pt={theme.spacing(1.5)}>
        {t('alert.testnet')}
      </Typography>
      <ButtonTransparent
        onClick={handleClick}
        style={{ marginTop: theme.spacing(1.5), width: '100%' }}
      >
        {t('alert.switchToMainnet')}
      </ButtonTransparent>
    </WarningMessageCard>
  );
};
