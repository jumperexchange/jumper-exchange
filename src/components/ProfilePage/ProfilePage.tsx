import {
  Box,
  Breakpoint,
  Container,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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

export const ProfilePage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md' as Breakpoint));
  const { trackPageload, trackEvent } = useUserTracking();

  const { isSuccess, points, tier, pdas, address } = useLoyaltyPass();
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
        marginTop: 4,
        marginBottom: 4,
        background: 'transparent',
        borderRadius: '8px',
        position: 'relative',
        width: '100% !important',
        overflow: 'hidden',
      }}
    >
      {isDesktop ? (
        <Stack direction={'column'} spacing={4}>
          <Stack direction={'row'} spacing={4}>
            <Box
              sx={{
                width: '33%',

                backgroundColor:
                  theme.palette.mode === 'light'
                    ? '#F9F5FF'
                    : alpha(theme.palette.white.main, 0.08),
                height: '312px',
                borderRadius: '24px',
              }}
            >
              <AddressBox address={address} />
            </Box>
            <Box
              sx={{
                width: '67%',
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? '#F9F5FF'
                    : alpha(theme.palette.white.main, 0.08),
                borderRadius: '24px',
                padding: '24px',
              }}
            >
              <TierBox points={points} tier={tier} />
            </Box>
          </Stack>
          <QuestCarousel quests={quests} theme={theme} />
          <QuestCompletedList
            pdas={pdas}
            dataIsFetched={isSuccess}
            theme={theme}
          />
        </Stack>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontSize: '18px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '40px' /* 125% */,
            }}
          >
            Pass not available on mobile for now. <br /> Please connect to a
            desktop.
          </Typography>
        </Box>
      )}
    </Container>
  );
};
