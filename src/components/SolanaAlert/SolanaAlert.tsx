import InfoIcon from '@mui/icons-material/Info';
import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { InfoMessageCard, InfoMessageCardTitle } from 'src/components';
export const SolanaAlert = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <InfoMessageCard mt={theme.spacing(4)} mb={theme.spacing(4)}>
      <InfoMessageCardTitle display="flex" alignItems="center" px={2} pt={2}>
        <InfoIcon
          sx={{
            marginRight: 1,
          }}
        />
        <Typography variant={'lifiHeaderXSmall'}>
          {t('solanaAlert.title')}
        </Typography>
      </InfoMessageCardTitle>
      <Typography variant={'lifiBodySmall'} pt={theme.spacing(1.5)}>
        {t('solanaAlert.subtitle')}
      </Typography>
    </InfoMessageCard>
  );
};
