import { useWallet } from '@lifi/widget';
import { useTheme } from '@mui/material';
import { Button } from 'src/components';
import { LogoLink } from '../Navbar';

import { useTranslation } from 'react-i18next';
import { Discord, Logo } from 'src/components';
import {
  DISCORD_URL,
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useUserTracking } from 'src/hooks';
import { EventTrackingTool } from 'src/types';
import { getContrastAlphaColor, openInNewTab } from 'src/utils';
import {
  CenteredContainer,
  ErrorMessage,
  NavbarContainer,
  SupportMessage,
} from './FallbackError.styles';

export function FallbackError() {
  const { trackPageload, trackEvent } = useUserTracking();
  const theme = useTheme();
  const { t } = useTranslation();
  const { account } = useWallet();
  return (
    <>
      <NavbarContainer>
        <LogoLink>
          <Logo isConnected={!!account.address} theme={theme} />
        </LogoLink>
      </NavbarContainer>
      <CenteredContainer>
        <ErrorMessage variant={'lifiBodyLarge'}>
          {t('error.message')}
        </ErrorMessage>
        <Button
          variant="primary"
          onClick={() => {
            trackEvent({
              category: TrackingCategory.Menu,
              label: 'click-discord-link',
              action: TrackingAction.OpenMenu,
              data: { [TrackingEventParameter.Menu]: 'lifi_discord' },
              disableTrackingTool: [
                EventTrackingTool.ARCx,
                EventTrackingTool.Cookie3,
              ],
            });
            trackPageload({
              source: TrackingCategory.Menu,
              destination: 'discord-lifi',
              url: DISCORD_URL,
              pageload: true,
              disableTrackingTool: [EventTrackingTool.Cookie3],
            });
            openInNewTab(DISCORD_URL);
          }}
          styles={{
            width: 'auto',
            margin: theme.spacing(1.5),
            gap: '8px',
            borderRadius: '24px',
            padding: theme.spacing(1),
            '> button:hover': {
              backgroundColor: getContrastAlphaColor(theme, '4%'),
            },
            '> button:hover svg': {
              fill:
                theme.palette.mode === 'light'
                  ? theme.palette.grey[700]
                  : theme.palette.grey[300],
            },
          }}
          fullWidth={true}
        >
          <Discord
            color={
              theme.palette.mode === 'dark'
                ? theme.palette.white.main
                : theme.palette.black.main
            }
          />
          <SupportMessage variant="lifiBodyMediumStrong" component="span">
            {t('navbar.navbarMenu.support')}
          </SupportMessage>
        </Button>
      </CenteredContainer>
    </>
  );
}
