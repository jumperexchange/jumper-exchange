'use client';

import { Bouncer } from './Bouncer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const BannerContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  padding: theme.spacing(1.5, 2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 1400,
}));

const BannerText = styled(Typography)({
  fontWeight: 600,
});

export const BlockedBanner = () => {
  const { t } = useTranslation();

  return (
    <Bouncer blocked>
      <BannerContainer>
        <BannerText variant="bodySmall">
          {t('bouncer.bannerMessage')}
        </BannerText>
      </BannerContainer>
    </Bouncer>
  );
};
