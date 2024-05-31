'use client';
import { CustomColor } from '@/components/CustomColorTypography.style';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { EventTrackingTool } from '@/types/userTracking';
import { appendUTMParametersToLink } from '@/utils/append-utm-params-to-link';
import { Slide, useTheme } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next/TransWithoutContext';
import { ToolCards } from './ToolCard/ToolCards';
import {
  ContentWrapper,
  Overlay,
  WelcomeContent,
  WelcomeScreenButton,
  WelcomeScreenButtonLabel,
  WelcomeScreenSubtitle,
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

interface WelcomeScreenProps {
  closed: boolean;
}

export const WelcomeScreen = ({ closed }: WelcomeScreenProps) => {
  const theme = useTheme();
  const { welcomeScreenClosed, setWelcomeScreenClosed } =
    useWelcomeScreen(closed);
  const { t } = useTranslation();
  const { trackPageload, trackEvent } = useUserTracking();
  const [openChainsToolModal, setOpenChainsToolModal] = useState(false);
  const [openBridgesToolModal, setOpenBridgesToolModal] = useState(false);
  const [openDexsToolModal, setOpenDexsToolModal] = useState(false);
  useEffect(() => {
    if (welcomeScreenClosed) {
      trackEvent({
        category: TrackingCategory.WelcomeScreen,
        label: 'open-welcome-screen',
        action: TrackingAction.ShowWelcomeMessageScreen,
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
      if (!welcomeScreenClosed) {
        setWelcomeScreenClosed(true);
        trackEvent({
          category: TrackingCategory.WelcomeScreen,
          action: TrackingAction.CloseWelcomeScreen,
          label: 'enter_welcome_screen',
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
          enableAddressable: true,
        });
      }
    }
  };

  return (
    <Overlay showWelcome={!welcomeScreenClosed}>
      <Slide
        direction="up"
        unmountOnExit
        appear={false}
        timeout={400}
        in={!welcomeScreenClosed}
      >
        <ContentWrapper showWelcome={!welcomeScreenClosed}>
          <WelcomeContent>
            <CustomColor as="h1" variant={'lifiHeaderMedium'}>
              {t('navbar.welcome.title')}
            </CustomColor>
            <WelcomeScreenSubtitle variant={'lifiBodyLarge'}>
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
            </WelcomeScreenSubtitle>
            <ToolCards
              openChainsToolModal={openChainsToolModal}
              setOpenChainsToolModal={setOpenChainsToolModal}
              openBridgesToolModal={openBridgesToolModal}
              setOpenBridgesToolModal={setOpenBridgesToolModal}
              openDexsToolModal={openDexsToolModal}
              setOpenDexsToolModal={setOpenDexsToolModal}
            />
            <WelcomeScreenButton onClick={handleGetStarted}>
              <WelcomeScreenButtonLabel variant={'lifiBodyMediumStrong'}>
                {t('navbar.welcome.cta')}
              </WelcomeScreenButtonLabel>
            </WelcomeScreenButton>
          </WelcomeContent>
          {/* <FeaturedArticle
            showIntro={true}
            showAllButton={true}
            styles={{
              background: `linear-gradient(0deg, transparent, ${
                theme.palette.mode === 'light'
                  ? theme.palette.white.main
                  : theme.palette.accent1Alt.main
              })`,
            }}
          /> */}
        </ContentWrapper>
      </Slide>
    </Overlay>
  );
};
