import type { Quest } from '@/types/loyaltyPass';
import {
  Box,
  type SelectChangeEvent,
  type Theme,
  useMediaQuery,
} from '@mui/material';
import { useState } from 'react';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';
import { checkInclusion } from '../ActiveSuperfestMissionsCarousel/ActiveSuperfestMissionsCarousel';
import { MissionsFilter } from '../MissionsFilter/MissionsFilter';
import { QuestCard } from '../QuestCard/QuestCard';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import {
  AvailableMissionsContainer,
  AvailableMissionsHeader,
  AvailableMissionsStack,
  AvailableMissionsTitle,
} from './AvailableMissionsList.style';

const chains = ['Optimism', 'Base', 'Mode', 'Fraxtal'];

const category = [
  'AMM',
  'Money Market',
  'Liquid Staking',
  'Derivatives',
  'Yield',
];

interface AvailableMissionsListProps {
  quests?: Quest[];
  pastCampaigns?: string[];
  loading: boolean;
  isJumperTurtleMember?: boolean;
}

export const AvailableMissionsList = ({
  quests,
  pastCampaigns,
  loading,
  isJumperTurtleMember,
}: AvailableMissionsListProps) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const [chainsFilter, setChainsFilter] = useState<string[]>([]);
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
              const imgURL = new URL(quest?.Image?.url, url.origin);
              const rewardType = quest?.CustomInformation?.['rewardType'];
              const missionType = quest?.CustomInformation?.['missionType'];
              const chains = quest?.CustomInformation?.['chains'];
              const rewardsIds = quest?.CustomInformation?.['rewardsIds'];
              //todo: exclude in a dedicated helper function
              if (chains && chainsFilter && chainsFilter.length > 0) {
                let included = false;
                for (const chain of chains) {
                  if (
                    chainsFilter
                      .map((elemChain) => elemChain.toLowerCase())
                      .includes(chain.name.toLowerCase())
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
                (!quest?.Category ||
                  (quest?.Category &&
                    !categoryFilter.includes(quest?.Category)))
              ) {
                return undefined;
              }
              let completed = false;
              if (rewardsIds && pastCampaigns) {
                completed = checkInclusion(pastCampaigns, rewardsIds);
              }
              if (
                missionType &&
                missionType === 'turtle_signature' &&
                isJumperTurtleMember
              ) {
                completed = true;
              }

              return (
                <QuestCard
                  key={`available-mission-${index}`}
                  active={true}
                  title={quest?.Title}
                  image={String(imgURL)}
                  id={quest.id}
                  label={quest?.Label}
                  points={quest?.Points}
                  link={quest?.Link}
                  startDate={quest?.StartDate}
                  endDate={quest?.EndDate}
                  platformName={quest?.quests_platform?.Name}
                  slug={quest?.Slug}
                  chains={chains}
                  rewards={quest?.CustomInformation?.['rewards']}
                  completed={completed}
                  claimingIds={quest?.CustomInformation?.['claimingIds']}
                  variableWeeklyAPY={
                    quest?.Points > 0 && rewardType === 'weekly'
                  }
                  rewardRange={quest?.CustomInformation?.['rewardRange']}
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
