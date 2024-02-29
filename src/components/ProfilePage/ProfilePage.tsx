import { Box, Container, Stack, Typography, useTheme } from '@mui/material';
import { Trans } from 'react-i18next';
import { appendUTMParametersToLink, openInNewTab } from '../../utils';
import { LIFI_URL, TrackingAction, TrackingCategory } from 'src/const';
import { useUserTracking } from 'src/hooks';
import { EventTrackingTool } from 'src/types';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { QuestCarousel } from './QuestCarousel';
import { QuestCompletedList } from './QuestsCompletedList';
import { useOngoingQuests } from 'src/hooks/useOngoingQuests';
import { useLoyaltyPassStore } from 'src/stores';
import { TierBox } from './TierBox';
import { AddressBox } from './AddressBox';

const SECONDS_IN_A_DAY = 86400;

export const ProfilePage = () => {
  const theme = useTheme();
  const { trackPageload, trackEvent } = useUserTracking();

  const { points, tier, pdas, address } = useLoyaltyPass();
  const { quests } = useOngoingQuests();

  console.log('-------------');
  console.log(points);
  console.log(tier);
  console.log(pdas);
  console.log('-------------');
  console.log('QUESTS');
  console.log(quests);

  return (
    <Container
      sx={{
        background: 'transparent',
        borderRadius: '8px',
        position: 'relative',
        width: '100% !important',
        overflow: 'hidden',
        margin: 'auto',
      }}
    >
      <Stack direction={'column'} spacing={4}>
        <Stack direction={'row'} spacing={4}>
          <Box
            sx={{
              width: '33%',
              backgroundColor: '#f9f5ff',
              height: '312px',
              borderRadius: '24px',
            }}
          >
            <AddressBox address={address} />
          </Box>
          <Box
            sx={{
              width: '67%',
              backgroundColor: '#f9f5ff',
              borderRadius: '24px',
              padding: '24px',
            }}
          >
            <TierBox points={points} tier={tier} />
          </Box>
        </Stack>
        <QuestCarousel quests={quests} />
        <QuestCompletedList pdas={pdas} />
      </Stack>
    </Container>
  );
};
