'use client';
import { Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { BannerContainer } from './Banner.style';

export const Banner = () => {
  const theme = useTheme();

  return (
    <a
      href="https://wrapped.jumper.exchange"
      target="_blank"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <BannerContainer>
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
          color={theme.palette.accent1.main}
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '20px',
          }}
        >
          {' '}
          Your 2024 Jumper Wrapped is here. Wrap your year{' '}
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
