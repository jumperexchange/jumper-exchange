import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Typography, useTheme } from '@mui/material';
import {
  WarningMessageCard,
  WarningMessageCardTitle,
} from '@transferto/shared/src/organisms';
import { useTranslation } from 'react-i18next';
import { ButtonTransparent } from '../../atoms';
import { openInNewTab } from '../../utils';

const I18_PATH = 'alert.';
const PROD_URL = 'https://jumper.exchange';

export const TestnetAlert = () => {
  const { t: translate } = useTranslation();
  const theme = useTheme();

  return (
    <WarningMessageCard mt={theme.spacing(8)}>
      <WarningMessageCardTitle display="flex" alignItems="center" px={2} pt={2}>
        <WarningRoundedIcon
          sx={{
            marginRight: 1,
          }}
        />
        <Typography variant={'lifiHeaderXSmall'}>
          {translate(`${I18_PATH}info`)}
        </Typography>
      </WarningMessageCardTitle>
      <Typography variant={'lifiBodySmall'} pt={theme.spacing(3)}>
        {translate(`${I18_PATH}testnet`)}
      </Typography>
      <ButtonTransparent
        onClick={() => {
          openInNewTab(PROD_URL);
        }}
        style={{ marginTop: theme.spacing(3), width: '100%' }}
      >
        {translate(`${I18_PATH}switchToMainnet`)}
      </ButtonTransparent>
    </WarningMessageCard>
  );
};
