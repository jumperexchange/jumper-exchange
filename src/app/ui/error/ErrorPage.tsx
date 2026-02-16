import { Button } from '@/components/Button/Button';
import { useTheme } from '@mui/material';

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
import { HeaderHeight } from '@/const/headerHeight';

interface FallbackErrorProps {
  reset: () => void;
}

const ErrorPage = ({ reset }: FallbackErrorProps) => {
  const { trackEvent } = useUserTracking();
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <CenteredContainer
      sx={{
        height: {
          xs: `calc(100vh - ${HeaderHeight.XS}px)`,
          sm: `calc(100vh - ${HeaderHeight.SM}px)`,
          md: `calc(100vh - ${HeaderHeight.MD}px)`,
        },
      }}
    >
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
        }}
        fullWidth={true}
      >
        <Discord />
        <SupportMessage variant="bodyMediumStrong" component="span">
          {t('navbar.navbarMenu.support')}
        </SupportMessage>
      </Button>
    </CenteredContainer>
  );
};

export default ErrorPage;
