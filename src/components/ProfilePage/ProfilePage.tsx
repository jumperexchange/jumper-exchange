import { Container, Typography, useTheme } from '@mui/material';
import { Trans } from 'react-i18next';
import { appendUTMParametersToLink, openInNewTab } from '../../utils';
import { LIFI_URL, TrackingAction, TrackingCategory } from 'src/const';
import { useUserTracking } from 'src/hooks';
import { EventTrackingTool } from 'src/types';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';

const lifiUrl = appendUTMParametersToLink(LIFI_URL, {
  utm_campaign: 'jumper_to_lifi',
  utm_medium: 'powered_by',
});

export const ProfilePage = () => {
  const theme = useTheme();
  const { trackPageload, trackEvent } = useUserTracking();

  const { isConnected, points, tier, pdas } = useLoyaltyPass();

  console.log('-------------');
  console.log(points);
  console.log(tier);
  console.log(pdas);

  return (
    <Container>
      <Typography>hello world</Typography>
    </Container>
  );
};
