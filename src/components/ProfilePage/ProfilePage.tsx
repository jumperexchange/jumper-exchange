import {
  WarningMessageCard,
  WarningMessageCardTitle,
} from '@/components/MessageCard';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { useOngoingQuests } from '@/hooks/useOngoingQuests';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import type { Theme } from '@mui/material';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AddressBox } from './AddressBox/AddressBox';
import { TierBox } from './LevelBox/TierBox';
import {
  ProfilePageContainer,
  ProfilePageHeaderBox,
} from './ProfilePage.style';
import { QuestCarousel } from './QuestCarousel/QuestCarousel';
import { QuestCompletedList } from './QuestsCompleted/QuestsCompletedList';

export const ProfilePage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const { t } = useTranslation();

  const { isSuccess, points, tier, pdas, address } = useLoyaltyPass();
  const { quests } = useOngoingQuests();

  return (
    <ProfilePageContainer>
      {isDesktop ? (
        <Stack direction={'column'} spacing={4} sx={{ marginBottom: 8 }}>
          <Stack direction={'row'} spacing={4}>
            <ProfilePageHeaderBox sx={{ width: '33%' }}>
              <AddressBox address={address} />
            </ProfilePageHeaderBox>
            <ProfilePageHeaderBox sx={{ width: '67%', padding: '24px' }}>
              <TierBox points={points} tier={tier} />
            </ProfilePageHeaderBox>
          </Stack>
          <QuestCarousel quests={quests} />
          <QuestCompletedList
            pdas={pdas}
            dataIsFetched={isSuccess || !!address} // we might have an address but no isSuccess if the user has no loyalty pass yet
          />
        </Stack>
      ) : (
        <Box sx={{ marginBottom: 8, marginTop: 16 }}>
          <WarningMessageCard sx={{ width: 350 }}>
            <WarningMessageCardTitle display="flex" alignItems="center">
              <WarningRoundedIcon
                sx={{
                  marginRight: 1,
                }}
              />
              <Typography variant={'lifiHeaderXSmall'}>
                {t('profile_page.mobileTitle')}
              </Typography>
            </WarningMessageCardTitle>
            <Typography variant={'lifiBodySmall'} pt={theme.spacing(1.5)}>
              {t('profile_page.mobileDescription')}
            </Typography>
          </WarningMessageCard>
        </Box>
      )}
    </ProfilePageContainer>
  );
};
