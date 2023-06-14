import { Box, Breakpoint, Slide, Typography, useTheme } from '@mui/material';
import { ButtonPrimary } from '@transferto/shared/src/atoms/ButtonPrimary.style';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { NavbarHeight } from '../Navbar/Navbar.style';
import { StatsCards } from '../StatsCard';
import { ContentContainer, CustomColor } from './WelcomeWrapper.style';

export const WelcomeWrapper = ({
  children,
  showWelcome,

  handleGetStarted,
}) => {
  const theme = useTheme();
  const i18Path = 'navbar.welcome.';
  const { t: translate } = useTranslation();
  const [openChainsPopper, setOpenChainsPopper] = useState(false);
  const [openBridgesPopper, setOpenBridgesPopper] = useState(false);
  const [openDexsPopper, setOpenDexsPopper] = useState(false);

  return (
    <Box
      sx={{
        maxHeight: showWelcome && `calc( 100vh - ${NavbarHeight.XS} )`,
        overflow: showWelcome ? 'visible' : 'hidden',

        [theme.breakpoints.up('sm' as Breakpoint)]: {
          maxHeight: showWelcome
            ? `calc( 100vh - ${NavbarHeight.SM} )`
            : 'auto',
        },
        [theme.breakpoints.up('md' as Breakpoint)]: {
          maxHeight: showWelcome
            ? `calc( 100vh - ${NavbarHeight.LG} )`
            : 'auto',
        },

        '&:after': {
          content: showWelcome && '" "',
          top: 0,
          position: 'absolute',
          left: 0,
          zIndex: -1,
          right: 0,
          bottom: 0,
          background:
            showWelcome && theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, rgba(26, 16, 51, 0) 0%, #1A1033 21.15%)'
              : showWelcome && theme.palette.mode === 'light'
              ? 'linear-gradient(180deg, rgba(243, 235, 255, 0) 0%, #f3ebffd4 21.15%)'
              : 'unset',
        },
      }}
    >
      {children}
      <Slide
        direction="up"
        unmountOnExit
        appear={false}
        timeout={400}
        in={showWelcome}
      >
        <ContentContainer
          showWelcome={showWelcome}
          onClick={(event) => {
            !openChainsPopper &&
              !openBridgesPopper &&
              !openDexsPopper &&
              handleGetStarted(event);
          }}
        >
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
                color: 'inherit',
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
                marginTop: theme.spacing(8),
                height: '56px',
                borderRadius: '28px',
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
    </Box>
  );
};
