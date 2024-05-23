import { useAccounts } from '@/hooks/useAccounts';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { useOngoingQuests } from '@/hooks/useOngoingQuests';
import { Stack } from '@mui/material';
import { useMercleNft } from 'src/hooks/useMercleNft';
import { AddressBox } from './AddressBox/AddressBox';
import { TierBox } from './LevelBox/TierBox';
import {
  ProfilePageContainer,
  ProfilePageHeaderBox,
} from './ProfilePage.style';
import { QuestCarousel } from './QuestCarousel/QuestCarousel';
import { QuestCompletedList } from './QuestsCompleted/QuestsCompletedList';

export const ProfilePage = () => {
  const { account } = useAccounts();
  const { isLoading, points, tier, pdas } = useLoyaltyPass();
  const { imageLink } = useMercleNft({ userAddress: account?.address });
  const { quests, isQuestLoading } = useOngoingQuests();

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
        <QuestCarousel quests={quests} loading={isQuestLoading} />
        <QuestCompletedList pdas={pdas} loading={isLoading} />
      </Stack>
    </ProfilePageContainer>
  );
};
