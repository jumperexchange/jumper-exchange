import { Typography, useTheme } from '@mui/material';
import { ButtonPrimary } from '@transferto/shared/src/atoms/ButtonPrimary.style';
import { useState } from 'react';
import { StatsCards } from '../StatsCard';
import {
  Background,
  ColoredContainer,
  ContentContainer,
  CustomColor,
  GlowTop,
} from './WelcomeWrapper.style';

export const WelcomeWrapper = ({ children }) => {
  const theme = useTheme();
  const [showWelcome, setShowWelcome] = useState(true);

  const handleGetStarted = () => {
    console.log('handleGetStarted');
    setShowWelcome(false);
  };

  return showWelcome ? (
    <Background>
      <GlowTop />
      {children}
      <ColoredContainer />
      <ContentContainer>
        <CustomColor variant={'lifiBrandHeaderXLarge'}>
          Find the best route
        </CustomColor>
        <Typography
          variant={'lifiBrandHeaderLarge'}
          mt={theme.spacing(2)}
          sx={{
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.accent1Alt.main
                : '#BEA0EB',
          }}
        >
          We’re 4x audited multi-chain liquidity aggregator
        </Typography>
        <StatsCards />
        <ButtonPrimary
          onClick={handleGetStarted}
          sx={(theme) => ({
            margin: 'auto',
            marginTop: theme.spacing(12),
            marginBottom: theme.spacing(13),
            width: '247px',
          })}
        >
          Get started
        </ButtonPrimary>
      </ContentContainer>
    </Background>
  ) : (
    children
  );
};
