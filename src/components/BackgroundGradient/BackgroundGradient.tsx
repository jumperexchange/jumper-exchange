import { Box, type CSSObject } from '@mui/material';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
  BlogBackgroundGradient,
} from '.';
import { useActiveTabStore } from 'src/stores';

interface BackgroundGradientProps {
  variant?: 'blog';
  styles?: CSSObject;
}

export const BackgroundGradient = ({
  variant,
  styles,
}: BackgroundGradientProps) => {
  //Todo: clean this logic
  const { activeTab } = useActiveTabStore();
  const url = window.location.pathname;

  return variant === 'blog' ? (
    <BlogBackgroundGradient />
  ) : url.includes('memecoins') && activeTab < 1 ? (
    //Todo: create a dedicated component
    <Box
      component="img"
      sx={{
        transform: 'translateX(-50%)',
        top: 0,
        left: '50%',
        position: 'fixed',
        width: '100%',
        height: '100vh',
        zIndex: -1,
        backgroundColor: '#000000',
        opacity: 0.8,
      }}
      alt="pepe_background"
      src="https://strapi.li.finance/uploads/pepebackground_b08236de5e.jpg"
    />
  ) : (
    <BackgroundGradientContainer sx={styles}>
      <BackgroundGradientBottomLeft />
      <BackgroundGradientBottomRight />
      <BackgroundGradientTopCenter />
    </BackgroundGradientContainer>
  );
};
