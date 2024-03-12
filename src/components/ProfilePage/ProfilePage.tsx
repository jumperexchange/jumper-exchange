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
import { useUserTracking } from 'src/hooks';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { QuestCarousel } from './QuestCarousel';
import { QuestCompletedList } from './QuestsCompletedList';
import { useOngoingQuests } from 'src/hooks/useOngoingQuests';
import { TierBox } from './TierBox';
import { AddressBox } from './AddressBox';
import {
  ProfilePageContainer,
  ProfilePageHeaderBox,
  ProfilePageTypography,
} from './ProfilePage.style';

export const ProfilePage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md' as Breakpoint));
  // const { trackPageload, trackEvent } = useUserTracking();

  const { isSuccess, points, tier, pdas, address } = useLoyaltyPass();
  const { quests } = useOngoingQuests();

  return (
    <ProfilePageContainer>
      {isDesktop ? (
        <Stack direction={'column'} spacing={4}>
          <Stack direction={'row'} spacing={4}>
            <ProfilePageHeaderBox style={{ width: '33%' }}>
              <AddressBox address={address} />
            </ProfilePageHeaderBox>
            <ProfilePageHeaderBox style={{ width: '67%', padding: '24px' }}>
              <TierBox points={points} tier={tier} />
            </ProfilePageHeaderBox>
          </Stack>
          <QuestCarousel quests={quests} />
          <QuestCompletedList
            pdas={pdas}
            dataIsFetched={isSuccess || !!address} // we might have an address but no isSuccess if the user has no loyalty pass yet
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
          <ProfilePageTypography fontSize={'18px'} lineHeight={'40px'}>
            Pass not available on mobile for now. <br /> Please connect to a
            desktop.
          </ProfilePageTypography>
        </Box>
      )}
    </ProfilePageContainer>
  );
};
