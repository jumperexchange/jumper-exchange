import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Typography, useTheme } from '@mui/material';
import {
  WarningMessageCard,
  WarningMessageCardTitle,
} from '@transferto/shared/src/organisms';
import { useTranslation } from 'react-i18next';
import { ButtonTransparent } from '../../atoms';
import { openInNewTab } from '../../utils';

const PROD_URL = 'https://jumper.exchange';

export const TestnetAlert = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <WarningMessageCard mt={theme.spacing(8)}>
      <WarningMessageCardTitle display="flex" alignItems="center" px={2} pt={2}>
        <WarningRoundedIcon
          sx={{
            marginRight: 1,
          }}
        />
        <Typography variant={'lifiHeaderXSmall'}>{t('alert.info')}</Typography>
      </WarningMessageCardTitle>
      <Typography variant={'lifiBodySmall'} pt={theme.spacing(3)}>
        {t('alert.testnet')}
      </Typography>
      <ButtonTransparent
        onClick={() => {
          openInNewTab(PROD_URL);
        }}
        style={{ marginTop: theme.spacing(3), width: '100%' }}
      >
        {t('alert.switchToMainnet')}
      </ButtonTransparent>
    </WarningMessageCard>
  );
};
