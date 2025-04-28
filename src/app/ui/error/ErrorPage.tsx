import { Button } from '@/components/Button/Button';
import { alpha, useColorScheme, useTheme } from '@mui/material';

import { Discord } from '@/components/illustrations/Discord';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';

import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { DISCORD_URL } from '@/const/urls';
import { openInNewTab } from '@/utils/openInNewTab';
import { useTranslation } from 'react-i18next';
import {
  CenteredContainer,
  ErrorMessage,
  SupportMessage,
} from './ErrorPage.style';

interface FallbackErrorProps {
  reset: () => void;
}

const ErrorPage = ({ reset }: FallbackErrorProps) => {
  const { mode } = useColorScheme();
  const { trackEvent } = useUserTracking();
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <CenteredContainer>
      <ErrorMessage variant={'bodyLarge'}>{t('error.message')}</ErrorMessage>
      <Button
        variant="primary"
        onClick={() => {
          trackEvent({
            category: TrackingCategory.Pageload,
            action: TrackingAction.PageLoad,
            label: 'error-discord-jumper',
            data: {
              [TrackingEventParameter.PageloadSource]:
                TrackingCategory.ErrorPage,
              [TrackingEventParameter.PageloadDestination]: 'discord-jumper',
              [TrackingEventParameter.PageloadURL]: DISCORD_URL,
              [TrackingEventParameter.PageloadExternal]: true,
            },
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
            backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
            ...theme.applyStyles("light", {
              backgroundColor: (theme.vars || theme).palette.alphaDark100.main
            })
          },
          '> button:hover svg': {
            fill:
              mode === 'light'
                ? theme.palette.grey[700]
                : alpha(theme.palette.white.main, 0.88),
          },
        }}
        fullWidth={true}
      >
        <Discord color={theme.palette.text.primary} />
        <SupportMessage variant="bodyMediumStrong" component="span">
          {t('navbar.navbarMenu.support')}
        </SupportMessage>
      </Button>
    </CenteredContainer>
  );
};

export default ErrorPage;
