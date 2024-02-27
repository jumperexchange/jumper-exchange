import { Container, Stack, Typography, useTheme } from '@mui/material';
import { Trans } from 'react-i18next';
import { appendUTMParametersToLink, openInNewTab } from '../../utils';
import { LIFI_URL, TrackingAction, TrackingCategory } from 'src/const';
import { useUserTracking } from 'src/hooks';
import { EventTrackingTool } from 'src/types';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { QuestCarousel } from './QuestCarousel';
import { QuestCompletedList } from './QuestsCompletedList';
import { useOngoingQuests } from 'src/hooks/useOngoingQuests';

export const ProfilePage = () => {
  const theme = useTheme();
  const { trackPageload, trackEvent } = useUserTracking();

  const { isConnected, points, tier, pdas, address } = useLoyaltyPass();
  const { quests, isSuccess } = useOngoingQuests();

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
        padding: 0,
      }}
    >
      <Stack direction={'column'} spacing={4}>
        <Container>
          {/* FIRST PART TOP */}
          <Stack direction={'row'} spacing={4}>
            <Container
              sx={{
                width: '50%',
                border: 1,
                borderColor: 'blue',
                backgroundColor: '#f9f5ff',
                height: '312px',
                padding: 0,
                borderRadius: '24px',
              }}
            >
              <Container
                sx={{ height: '50%', backgroundColor: 'red', width: '100%' }}
              >
                <Typography>background</Typography>
              </Container>
              <Container>
                <Typography>Image</Typography>
              </Container>
              <Container>
                <Typography>
                  {address
                    ? address?.slice(0, 6) +
                      '...' +
                      address?.slice(address.length - 4, address.length)
                    : null}
                </Typography>
              </Container>
            </Container>
            <Container
              sx={{
                border: 1,
                gridRow: '2/3',
                borderColor: 'blue',
                backgroundColor: '#f9f5ff',
                borderRadius: '24px',
              }}
            >
              <Container
                sx={{
                  border: 1,
                  backgroundColor: '#ffffff',
                  height: '99%',
                  width: '99%',
                  borderRadius: '24px',
                }}
              >
                <Typography>Tier</Typography>
                <Stack direction={'row'} spacing={1}>
                  <Stack direction={'row'} spacing={1}>
                    <Typography>{points ?? null}</Typography>
                    <Typography>{'points'}</Typography>
                  </Stack>
                  <Typography>{tier ?? null}</Typography>
                </Stack>
              </Container>
            </Container>
          </Stack>
        </Container>

        {/* Mission CAROUSSEL */}
        <QuestCarousel quests={quests} />
        <QuestCompletedList pdas={pdas} />
      </Stack>
    </Container>
  );
};
