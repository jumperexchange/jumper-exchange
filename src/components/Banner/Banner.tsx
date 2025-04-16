'use client';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import type { Theme } from '@mui/material';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useUserTracking } from 'src/hooks/userTracking';
import { BannerContainer } from './Banner.style';
import { useColorScheme } from '@mui/material';

export const Banner = () => {
  const theme = useTheme();
  const { trackEvent } = useUserTracking();
  const { mode } = useColorScheme();


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
      style={{
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        zIndex: 1,
      }}
      rel="noreferrer"
    >
      <BannerContainer onClick={handleClick}>
        <Image
          alt="jumper-logo"
          width={24}
          height={24}
          style={{ marginRight: 8 }}
          src={
            mode === 'light'
              ? 'https://strapi.jumper.exchange/uploads/jumper_57348536c0.svg'
              : 'https://strapi.jumper.exchange/uploads/jumper_04f15d06be.svg'
          }
        />
        <Typography
          sx={(theme) => ({
            color:
              '#FFFFFFD6',
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '20px',
            ...theme.applyStyles("light", {
              color: theme.palette.accent1.main
            })
          })}
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
            mode === 'light'
              ? 'https://strapi.jumper.exchange/uploads/theme_c92ac9f474.svg'
              : 'https://strapi.jumper.exchange/uploads/button_darkl_70bedec2df.svg'
          }
        />
      </BannerContainer>
    </a>
  );
};
