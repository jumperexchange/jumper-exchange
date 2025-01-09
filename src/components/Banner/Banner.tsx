'use client';
import type { Theme } from '@mui/material';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { BannerContainer } from './Banner.style';
import { useUserTracking } from 'src/hooks/userTracking';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';

export const Banner = () => {
  const theme = useTheme();
  const { trackEvent } = useUserTracking();

  const handleClick = () => {
    trackEvent({
      category: TrackingCategory.Banner,
      action: TrackingAction.ClickBanner,
      label: 'click-banner-cta',
      data: {
        [TrackingEventParameter.ActiveCampaign]: '',
      },
    });
  };

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <a
      href="https://jumper.exchange"
      target="_blank"
      style={{ textDecoration: 'none', color: 'inherit' }}
      rel="noreferrer"
    >
      <BannerContainer onClick={handleClick}>
        <Image
          alt="jumper-logo"
          width={24}
          height={24}
          style={{ marginRight: 8 }}
          src={
            theme.palette.mode === 'dark'
              ? 'https://strapi.jumper.exchange/uploads/jumper_04f15d06be.svg'
              : 'https://strapi.jumper.exchange/uploads/jumper_57348536c0.svg'
          }
        />
        <Typography
          color={
            theme.palette.mode === 'dark'
              ? '#FFFFFFD6'
              : theme.palette.accent1.main
          }
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '20px',
          }}
        >
          {' '}
          {isSmallScreen ? '' : ''}{' '}
        </Typography>
        <Image
          alt="arrow-icon"
          width={24}
          height={24}
          style={{ marginLeft: 8 }}
          src={
            theme.palette.mode === 'dark'
              ? 'https://strapi.jumper.exchange/uploads/button_darkl_70bedec2df.svg'
              : 'https://strapi.jumper.exchange/uploads/theme_c92ac9f474.svg'
          }
        />
      </BannerContainer>
    </a>
  );
};
