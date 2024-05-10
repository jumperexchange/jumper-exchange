import { useAccounts } from '@/hooks/useAccounts';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { useOngoingQuests } from '@/hooks/useOngoingQuests';
import type { Theme } from '@mui/material';
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AddressBox } from './AddressBox/AddressBox';
import { TierBox } from './LevelBox/TierBox';
import {
  ProfilePageContainer,
  ProfilePageHeaderBox,
} from './ProfilePage.style';
import { QuestCarousel } from './QuestCarousel/QuestCarousel';
import { QuestCompletedList } from './QuestsCompleted/QuestsCompletedList';
import { useMercleNft } from 'src/hooks/useMercleNft';

export const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const { t } = useTranslation();

  const { account } = useAccounts();
  const { isLoading, points, tier, pdas } = useLoyaltyPass();
  const { imageLink } = useMercleNft({ userAddress: account?.address });
  const { quests } = useOngoingQuests();

  return (
    <ProfilePageContainer>
      <Stack direction={'column'} spacing={{ xs: 2, sm: 4 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 4 }}
        >
          <ProfilePageHeaderBox sx={{ display: 'flex', flex: 1 }}>
            <AddressBox
              address={account?.address}
              isEVM={account?.chainType === 'EVM'}
              imageLink={imageLink}
            />
          </ProfilePageHeaderBox>
          <ProfilePageHeaderBox
            sx={{ display: 'flex', flex: 2, padding: { xs: 0, sm: 3 } }}
          >
            <TierBox points={points} tier={tier} loading={isLoading} />
          </ProfilePageHeaderBox>
        </Stack>
        <QuestCarousel quests={quests} />
        <QuestCompletedList pdas={pdas} loading={isLoading} />
      </Stack>
    </ProfilePageContainer>
  );
};
