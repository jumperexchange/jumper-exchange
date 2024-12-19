import { useAccount } from '@lifi/wallet-management';
import generateKey from 'src/app/lib/generateKey';
import { useMerklRewardsOnCampaigns } from 'src/hooks/useMerklRewardsOnCampaigns';
import { useMissionsAPY } from 'src/hooks/useMissionsAPY';
import { type Quest } from 'src/types/loyaltyPass';
import { Box } from '@mui/material';
import { QuestsContainer } from '../QuestPage/QuestPage.style';

interface QuestsMissionPageVar {
  quest: Quest;
  baseUrl: string;
  activeCampaign?: string;
  path: string;
}

export const CampaignComponentPage = ({
  quest,
  baseUrl,
  activeCampaign,
  path,
}: QuestsMissionPageVar) => {
  const attributes = quest?.attributes;
  const CTAs = quest?.attributes?.CustomInformation?.['CTA'];
  const missionType = quest?.attributes?.CustomInformation?.['missionType'];
  const rewardType = attributes?.CustomInformation?.['rewardType'];
  const rewardRange = attributes?.CustomInformation?.['rewardRange'];
  const rewards = quest.attributes.CustomInformation?.['rewards'];
  const points = quest?.attributes?.Points;

  const { account } = useAccount();
  const { pastCampaigns } = useMerklRewardsOnCampaigns({
    userAddress: account?.address,
  });
  const { CTAsWithAPYs } = useMissionsAPY(CTAs);

  return (
    <QuestsContainer>
      <Box>Campaign Page</Box>
      <Box>Header</Box>
      <Box>Show active mission</Box>
    </QuestsContainer>
  );
};
