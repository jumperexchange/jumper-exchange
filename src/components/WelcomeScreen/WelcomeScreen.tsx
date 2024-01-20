import type { Breakpoint } from '@mui/material';
import { Slide, Typography, useTheme } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ButtonPrimary, ToolCards } from 'src/components';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useUserTracking } from 'src/hooks';
import { useSettingsStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { appendUTMParametersToLink } from 'src/utils';
import { shallow } from 'zustand/shallow';
import {
  ContentWrapper,
  CustomColor,
  Overlay,
  WelcomeContent,
} from './WelcomeScreen.style';

const auditsWelcomeUrl = appendUTMParametersToLink(
  'https://docs.li.fi/smart-contracts/audits',
  {
    utm_campaign: 'jumper_to_docs',
    utm_medium: 'welcome_screen',
  },
);
const lifiWelcomeUrl = appendUTMParametersToLink('https://li.fi/', {
  utm_campaign: 'jumper_to_lifi',
  utm_medium: 'welcome_screen',
});

export const WelcomeScreen = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [welcomeScreenClosed, onWelcomeScreenClosed] = useSettingsStore(
    (state) => [state.welcomeScreenClosed, state.onWelcomeScreenClosed],
    shallow,
  );

  const { trackPageload, trackEvent } = useUserTracking();
  const [openChainsToolModal, setOpenChainsToolModal] = useState(false);
  const [openBridgesToolModal, setOpenBridgesToolModal] = useState(false);
  const [openDexsToolModal, setOpenDexsToolModal] = useState(false);

  useEffect(() => {
    if (!welcomeScreenClosed) {
      trackEvent({
        category: TrackingCategory.WelcomeScreen,
        label: 'open-welcome-screen',
        action: TrackingAction.OpenWelcomeMessageScreen,
        disableTrackingTool: [
          EventTrackingTool.ARCx,
          EventTrackingTool.Cookie3,
        ],
      });
    }
  }, [trackEvent, welcomeScreenClosed]);

  const handleAuditClick = () => {
    trackEvent({
      category: TrackingCategory.WelcomeScreen,
      label: 'open-welcome-message-link',
      action: TrackingAction.OpenWelcomeMessageLink,
      data: { [TrackingEventParameter.WelcomeMessageLink]: '4x_audited' },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    trackPageload({
      source: TrackingCategory.WelcomeScreen,
      destination: 'docs-sc-audits',
      url: auditsWelcomeUrl,
      pageload: true,
      disableTrackingTool: [EventTrackingTool.Cookie3],
    });
  };

  const handleLIFIClick = () => {
    trackEvent({
      category: TrackingCategory.WelcomeScreen,
      label: 'open-welcome-message-link',
      action: TrackingAction.OpenWelcomeMessageLink,
      data: { [TrackingEventParameter.WelcomeMessageLink]: 'LIFI' },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    trackPageload({
      source: TrackingCategory.WelcomeScreen,
      destination: 'lifi-website',
      url: lifiWelcomeUrl,
      pageload: true,
      disableTrackingTool: [EventTrackingTool.Cookie3],
    });
  };

  const handleGetStarted: MouseEventHandler<HTMLButtonElement> = (event) => {
    const classList = (event.target as HTMLElement).classList;
    if (
      classList.contains?.('stats-card') ||
      classList.contains?.('link-lifi')
    ) {
      return;
    } else {
      event.stopPropagation();
      onWelcomeScreenClosed(true);
      trackEvent({
        category: TrackingCategory.WelcomeScreen,
        action: TrackingAction.CloseWelcomeScreen,
        label: 'enter_welcome_screen',
        disableTrackingTool: [
          EventTrackingTool.ARCx,
          EventTrackingTool.Cookie3,
        ],
      });
    }
  };

  return (
    <Overlay showWelcome={!welcomeScreenClosed || false}>
      <Slide
        direction="up"
        unmountOnExit
        appear={false}
        timeout={400}
        in={!welcomeScreenClosed}
      >
        <ContentWrapper showWelcome={!welcomeScreenClosed}>
          <WelcomeContent>
            <CustomColor variant={'lifiHeaderMedium'}>
              {t('navbar.welcome.title')}
            </CustomColor>
            <Typography
              variant={'lifiBodyLarge'}
              sx={{
                marginTop: 2,
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.accent1Alt.main
                    : theme.palette.primary.main,
                '& > .link-lifi': {
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                },
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  fontSize: '24px',
                  fontWeight: 400,
                  lineHeight: '32px',
                },
              }}
            >
              {
                <Trans
                  i18nKey={'navbar.welcome.subtitle' as string & never[]}
                  components={[
                    // fix: allow component with "no content"
                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                    <a
                      className={'link-lifi'}
                      href={auditsWelcomeUrl}
                      target={'_blank'}
                      rel="noreferrer"
                      onClick={handleAuditClick}
                    />,
                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                    <a
                      className={'link-lifi'}
                      href={lifiWelcomeUrl}
                      onClick={handleLIFIClick}
                      target={'_blank'}
                      rel="noreferrer"
                    />,
                  ]}
                />
              }
            </Typography>
            <ToolCards
              openChainsToolModal={openChainsToolModal}
              setOpenChainsToolModal={setOpenChainsToolModal}
              openBridgesToolModal={openBridgesToolModal}
              setOpenBridgesToolModal={setOpenBridgesToolModal}
              openDexsToolModal={openDexsToolModal}
              setOpenDexsToolModal={setOpenDexsToolModal}
            />
            <ButtonPrimary
              onClick={handleGetStarted}
              sx={(theme) => ({
                height: 48,
                width: 192,
                margin: theme.spacing(4, 'auto'),
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  margin: theme.spacing(6, 'auto'),
                  height: 56,
                  borderRadius: '28px',
                  width: 247,
                },
              })}
            >
              <Typography
                variant={'lifiBodyMediumStrong'}
                sx={{
                  maxHeight: 40,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    fontSize: '18px',
                    maxHeight: 48,
                    lineHeight: '24px',
                  },
                }}
              >
                {t('navbar.welcome.cta')}
              </Typography>
            </ButtonPrimary>
          </WelcomeContent>
        </ContentWrapper>
      </Slide>
    </Overlay>
  );
};
