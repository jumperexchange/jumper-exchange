import { useAccount } from '@lifi/wallet-management';
import generateKey from 'src/app/lib/generateKey';
import { useMerklRewardsOnCampaigns } from 'src/hooks/useMerklRewardsOnCampaigns';
import { useMissionsAPY } from 'src/hooks/useMissionsAPY';
import { type Quest } from 'src/types/loyaltyPass';
import { Box } from '@mui/material';
import { QuestsContainer } from '../QuestPage/QuestPage.style';

interface CampaignPageProps {
  quest?: Quest;
  baseUrl?: string;
}

export const CampaignComponentPage = ({
  quest,
  baseUrl,
}: CampaignPageProps) => {
  const attributes = quest?.attributes;
  const CTAs = quest?.attributes?.CustomInformation?.['CTA'];
  const missionType = quest?.attributes?.CustomInformation?.['missionType'];
  const rewardType = attributes?.CustomInformation?.['rewardType'];
  const rewardRange = attributes?.CustomInformation?.['rewardRange'];
  const rewards = quest?.attributes.CustomInformation?.['rewards'];
  const points = quest?.attributes?.Points;

  const { account } = useAccount();
  const { pastCampaigns } = useMerklRewardsOnCampaigns({
    userAddress: account?.address,
  });
  const { CTAsWithAPYs } = useMissionsAPY(CTAs);

  // a) Fetch the right information from the slug using Strapi
  // b) Display the top component with some metric and a background banner
  // c) Reuse component to showcase only the fetch with a specific label (same as the slug)

  return (
    <QuestsContainer>
      <Box>Campaign Page</Box>
      <Box>Header</Box>
      <Box>Show active mission</Box>
    </QuestsContainer>
  );
};
