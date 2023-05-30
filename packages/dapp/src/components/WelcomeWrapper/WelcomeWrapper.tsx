import { Breakpoint, Slide, Typography, useTheme } from '@mui/material';
import { ButtonPrimary } from '@transferto/shared/src/atoms/ButtonPrimary.style';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
  const [openChainsPopper, setOpenChainsPopper] = useState(false);
  const [openBridgesPopper, setOpenBridgesPopper] = useState(false);
  const [openDexsPopper, setOpenDexsPopper] = useState(false);

  return (
    <>
      {showWelcome ? (
        <Background
          className="welcome-background"
          onClick={(event) => {
            !openChainsPopper &&
              !openBridgesPopper &&
              !openDexsPopper &&
              handleGetStarted(event);
          }}
        >
          <Slide direction="up" in={!showFadeOut} unmountOnExit appear={false}>
            <ContentContainer>
              <CustomColor variant={'lifiBrandHeaderMedium'}>
                {translate(`${i18Path}title`)}
              </CustomColor>
              <Typography
                variant={'lifiBrandBodyLarge'}
                mt={theme.spacing(4)}
                sx={{
                  color:
                    theme.palette.mode === 'dark'
                      ? theme.palette.accent1Alt.main
                      : theme.palette.primary.main,
                  '& > .link-lifi': {
                    fontWeight: 700,
                  },
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    fontSize: '24px',
                    fontWeight: 400,
                    lineHeight: '32px',
                    mt: theme.spacing(2),
                  },
                }}
              >
                {
                  <Trans
                    i18nKey={`${i18Path}subtitle`}
                    components={[
                      // eslint-disable-next-line jsx-a11y/anchor-has-content
                      <a
                        className={'link-lifi'}
                        href="https://li.fi"
                        style={{ color: 'inherit' }}
                        target={'_blank'}
                        rel="noreferrer"
                      />,
                    ]}
                  />
                }
              </Typography>
              <StatsCards
                openChainsPopper={openChainsPopper}
                setOpenChainsPopper={setOpenChainsPopper}
                openBridgesPopper={openBridgesPopper}
                setOpenBridgesPopper={setOpenBridgesPopper}
                openDexsPopper={openDexsPopper}
                setOpenDexsPopper={setOpenDexsPopper}
              />
              <ButtonPrimary
                onClick={handleGetStarted}
                sx={(theme) => ({
                  margin: 'auto',
                  marginTop: theme.spacing(5),
                  height: '48px',
                  width: '192px',
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    height: '56px',
                    width: '247px',
                  },
                })}
              >
                <Typography
                  variant={'lifiBodyMediumStrong'}
                  sx={{
                    [theme.breakpoints.up('sm' as Breakpoint)]: {
                      fontSize: '18px',
                      lineHeight: '24px',
                    },
                  }}
                >
                  {translate(`${i18Path}cta`)}
                </Typography>
              </ButtonPrimary>
            </ContentContainer>
          </Slide>
        </Background>
      ) : null}
      {children}
    </>
  );
};
