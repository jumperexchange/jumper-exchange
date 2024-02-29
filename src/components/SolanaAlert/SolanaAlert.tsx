import InfoIcon from '@mui/icons-material/Info';
import { Grid, Slide, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { InfoMessageCard, InfoMessageCardTitle } from 'src/components';

interface SolanaAlertProps {
  active: boolean;
}

export const SolanaAlert = ({ active }: SolanaAlertProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Slide
      direction="up"
      in={active}
      unmountOnExit
      appear={active}
      timeout={500}
      easing={'cubic-bezier(0.32, 0, 0.67, 0)'}
    >
      <Grid item xs={12} m={theme.spacing(3)}>
        <InfoMessageCard mt={theme.spacing(4)} mb={theme.spacing(4)}>
          <InfoMessageCardTitle
            display="flex"
            alignItems="center"
            px={2}
            pt={2}
          >
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
      </Grid>
    </Slide>
  );
};
