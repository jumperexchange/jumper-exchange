import { Typography, useTheme } from '@mui/material';
import { ButtonPrimary } from '@transferto/shared/src/atoms/ButtonPrimary.style';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatsCards } from '../StatsCard';
import {
  Background,
  ContentContainer,
  CustomColor,
} from './WelcomeWrapper.style';

export const WelcomeWrapper = ({ children, showWelcome, setShowWelcome }) => {
  const theme = useTheme();
  const i18Path = 'navbar.welcome.';
  const { t: translate } = useTranslation();
  const [showFadeOut, setShowFadeOut] = useState(true);

  const handleGetStarted = async () => {
    setShowFadeOut(false);
    await setTimeout(() => {
      console.log('timeout');
      setShowWelcome(false);
    }, 2000);
  };

  return (
    <>
      {showWelcome ? (
        <Background onClick={handleGetStarted}>
          <ContentContainer>
            <CustomColor variant={'lifiBrandHeaderXLarge'}>
              {translate(`${i18Path}title`)}
            </CustomColor>
            <Typography
              variant={'lifiBrandHeaderLarge'}
              mt={theme.spacing(2)}
              sx={{
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.accent1Alt.main
                    : theme.palette.primary.main,
              }}
            >
              {translate(`${i18Path}subtitle`)}
            </Typography>
            <StatsCards />
            <ButtonPrimary
              onClick={handleGetStarted}
              sx={(theme) => ({
                margin: 'auto',
                marginTop: theme.spacing(5),
                // marginBottom: theme.spacing(13),
                width: '247px',
              })}
            >
              {translate(`${i18Path}cta`)}
            </ButtonPrimary>
          </ContentContainer>
        </Background>
      ) : null}
      {children}
    </>
  );
};
