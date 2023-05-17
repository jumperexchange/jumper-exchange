import { Slide, Typography, useTheme } from '@mui/material';
import { ButtonPrimary } from '@transferto/shared/src/atoms/ButtonPrimary.style';
import { useTranslation } from 'react-i18next';
import { StatsCards } from '../StatsCard';
import {
  Background,
  ContentContainer,
  CustomColor,
} from './WelcomeWrapper.style';

export const WelcomeWrapper = ({
  children,
  showWelcome,
  showFadeOut,
  handleGetStarted,
}) => {
  const theme = useTheme();
  const i18Path = 'navbar.welcome.';
  const { t: translate } = useTranslation();

  return (
    <>
      {showWelcome ? (
        <Background>
          <Slide direction="up" in={!showFadeOut} unmountOnExit appear={false}>
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
                  width: '247px',
                })}
              >
                {translate(`${i18Path}cta`)}
              </ButtonPrimary>
            </ContentContainer>
          </Slide>
        </Background>
      ) : null}
      {children}
    </>
  );
};
