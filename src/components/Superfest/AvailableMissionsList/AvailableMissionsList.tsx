import type { Quest } from '@/types/loyaltyPass';
import { QuestCard } from '../QuestCard/QuestCard';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import {
  AvailableMissionsContainer,
  AvailableMissionsHeader,
  AvailableMissionsStack,
  AvailableMissionsTitle,
} from './AvailableMissionsList.style';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';
import {
  Box,
  type SelectChangeEvent,
  type Theme,
  useMediaQuery,
} from '@mui/material';
import { useState } from 'react';
import { MissionsFilter } from '../MissionsFilter/MissionsFilter';

const chains = ['Optimism', 'Base', 'Mode', 'Fraxtal'];

const rewards_list = ['OP Rewards'];

const category = ['Lending', 'Liquidity Pool', 'Staking', 'Stablecoins'];

interface QuestCompletedListProps {
  quests?: Quest[];
  loading: boolean;
}

export const AvailableMissionsList = ({
  quests,
  loading,
}: QuestCompletedListProps) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const [chainsFilter, setChainsFilter] = useState<string[]>([]);
  const [rewardsFilter, setRewardsFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const { url } = useOngoingFestMissions();

  const handleChainChange = (event: SelectChangeEvent<typeof chainsFilter>) => {
    const {
      target: { value },
    } = event;
    setChainsFilter(typeof value === 'string' ? value.split(',') : value);
  };

  const handleCategoryChange = (
    event: SelectChangeEvent<typeof categoryFilter>,
  ) => {
    const {
      target: { value },
    } = event;
    setCategoryFilter(typeof value === 'string' ? value.split(',') : value);
  };

  const handleRewardChange = (
    event: SelectChangeEvent<typeof rewardsFilter>,
  ) => {
    const {
      target: { value },
    } = event;
    setRewardsFilter(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <AvailableMissionsContainer>
      <AvailableMissionsHeader>
        <AvailableMissionsTitle>{'Available Missions'}</AvailableMissionsTitle>
        <Box display="flex">
          {isMobile ? (
            <MissionsFilter
              title="Category"
              options={category}
              activeChoices={categoryFilter}
              handleChange={handleCategoryChange}
            />
          ) : (
            <>
              <MissionsFilter
                title="Chains"
                options={chains}
                activeChoices={chainsFilter}
                handleChange={handleChainChange}
              />
              <Box marginLeft={'4px'}>
                <MissionsFilter
                  title="Rewards"
                  options={rewards_list}
                  activeChoices={rewardsFilter}
                  handleChange={handleRewardChange}
                />
              </Box>
              <Box marginLeft={'4px'}>
                <MissionsFilter
                  title="Category"
                  options={category}
                  activeChoices={categoryFilter}
                  handleChange={handleCategoryChange}
                />
              </Box>
            </>
          )}
        </Box>
      </AvailableMissionsHeader>
      <AvailableMissionsStack
        direction={'row'}
        spacing={{ xs: 2, sm: '48px' }}
        useFlexGap
        flexWrap="wrap"
      >
        {!loading && quests
          ? quests?.map((quest: Quest, index: number) => {
              const baseURL = quest.attributes.Image?.data?.attributes?.url;
              const imgURL = new URL(baseURL, url.origin);
              const rewards = quest.attributes.CustomInformation?.['rewards'];
              const chains = quest.attributes.CustomInformation?.['chains'];
              const rewardsAmount = rewards?.amount;

              //todo: exclude in a dedicated helper function
              if (rewardsFilter.length === 1) {
                if (
                  rewardsFilter.includes('OP Rewards') &&
                  (!rewardsAmount || rewardsAmount === 0)
                ) {
                  return undefined;
                }
              }
              if (chainsFilter && chainsFilter.length > 0) {
                let included = false;
                for (const chain of chains) {
                  if (
                    chainsFilter
                      .map((chain) => chain.toLowerCase())
                      .includes(chain.name)
                  ) {
                    included = true;
                    break;
                  }
                }
                if (!included) {
                  return undefined;
                }
              }
              if (
                categoryFilter &&
                categoryFilter.length > 0 &&
                (!quest.attributes.Category ||
                  (quest.attributes.Category &&
                    !categoryFilter.includes(quest.attributes.Category)))
              ) {
                return undefined;
              }

              return (
                <QuestCard
                  key={`available-mission-${index}`}
                  active={true}
                  title={quest?.attributes.Title}
                  image={`${imgURL}`}
                  points={quest?.attributes.Points}
                  link={quest?.attributes.Link}
                  startDate={quest?.attributes.StartDate}
                  endDate={quest?.attributes.EndDate}
                  platformName={
                    quest?.attributes.quests_platform?.data?.attributes?.Name
                  }
                  slug={quest?.attributes.Slug}
                  chains={chains}
                  rewards={rewards}
                />
              );
            })
          : null}
        {loading
          ? Array.from({ length: 12 }, () => 42).map((_, idx) => (
              <QuestCardSkeleton key={'skeleton-' + idx} />
            ))
          : null}
      </AvailableMissionsStack>
    </AvailableMissionsContainer>
  );
};
