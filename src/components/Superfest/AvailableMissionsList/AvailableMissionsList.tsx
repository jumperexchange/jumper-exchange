import { useAccounts } from '@/hooks/useAccounts';
import type { Quest } from '@/types/loyaltyPass';
import { useTranslation } from 'react-i18next';
import { QuestCard } from '../QuestCard/QuestCard';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import {
  AvailableMissionsContainer,
  AvailableMissionsHeader,
  AvailableMissionsStack,
  AvailableMissionsTitle,
} from './AvailableMissionsList.style';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';
import { Box, Theme, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { SoraTypography } from '../Superfest.style';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      backgroundColor: '#fff0ca',
    },
  },
};

const chains = ['Optimism', 'Base', 'Mode', 'Fraxtal'];

const Rewards_list = ['OP Rewards', 'No OP Rewards'];

const category = ['Lending', 'Liquidity Pool', 'Staking', 'Stablecoins'];

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface QuestCompletedListProps {
  quests?: Quest[];
  loading: boolean;
}

export const AvailableMissionsList = ({
  quests,
  loading,
}: QuestCompletedListProps) => {
  const theme = useTheme();
  const [chainsFilter, setChainsFilter] = useState<string[]>([]);
  const [rewardsFilter, setRewardsFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [filteredQuests, setFilteredQuests] = useState<Quest[]>([]);
  const [filterLoading, setFiltedLoading] = useState<boolean>(false);
  const { url } = useOngoingFestMissions();

  const [personName, setPersonName] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    // setFiltedLoading(true);
    // let _filterQuests = quests.maps()
    // setFiltedLoading(false);
  }, [chainsFilter, rewardsFilter, categoryFilter]);

  return (
    <AvailableMissionsContainer>
      <AvailableMissionsHeader>
        <AvailableMissionsTitle>{'Available Missions'}</AvailableMissionsTitle>
        <Box>
          <FormControl sx={{ width: 120 }}>
            <Select
              multiple
              displayEmpty
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <SoraTypography>Chains</SoraTypography>;
                }

                return selected.join(', ');
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {chains.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, personName, theme)}
                >
                  <Checkbox checked={personName.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 120, ml: '4px' }}>
            <Select
              multiple
              displayEmpty
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <SoraTypography>Rewards</SoraTypography>;
                }

                return selected.join(', ');
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {Rewards_list.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, personName, theme)}
                >
                  <Checkbox checked={personName.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 120, ml: '4px' }}>
            <Select
              multiple
              displayEmpty
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <SoraTypography>Category</SoraTypography>;
                }

                return selected.join(', ');
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {category.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, personName, theme)}
                >
                  <Checkbox checked={personName.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </AvailableMissionsHeader>
      <AvailableMissionsStack
        direction={'row'}
        spacing={{ xs: 2, sm: 4 }}
        useFlexGap
        flexWrap="wrap"
      >
        {!loading && !filterLoading && quests
          ? quests?.map((quest: Quest, index: number) => {
              const baseURL = quest.attributes.Image?.data?.attributes?.url;
              const imgURL = new URL(baseURL, url.origin);
              const rewards = quest.attributes.CustomInformation?.['rewards'];
              const chains = quest.attributes.CustomInformation?.['chains'];
              const rewardsAmount = rewards?.amount;

              //todo: exclude in a dedicated helper function
              if (rewardsFilter && (!rewardsAmount || rewardsAmount === 0)) {
                return undefined;
              }
              if (
                rewardsFilter === false &&
                rewardsAmount &&
                rewardsAmount > 0
              ) {
                return undefined;
              }
              if (chainsFilter && chainsFilter.length > 0) {
                let included = false;
                for (const chain of chains) {
                  if (chainsFilter.includes(chain.name)) {
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
                quest.attributes.Category &&
                !categoryFilter.includes(quest.attributes.Category)
              ) {
                return undefined;
              }

              return (
                <QuestCard
                  key={`available-mission-${index}`}
                  active={true}
                  title={quest?.attributes.Title}
                  image={`
                    ${new URL(
                      quest.attributes.Image?.data?.attributes?.url,
                      url.origin,
                    )}`}
                  points={quest?.attributes.Points}
                  link={quest?.attributes.Link}
                  startDate={quest?.attributes.StartDate}
                  endDate={quest?.attributes.EndDate}
                  platformName={
                    quest?.attributes.quests_platform?.data?.attributes?.Name
                  }
                  platformImage={`${imgURL}`}
                  slug={quest?.attributes.Slug}
                  chains={chains}
                  rewards={rewards}
                />
              );
            })
          : null}
        {loading || filterLoading
          ? Array.from({ length: 12 }, () => 42).map((_, idx) => (
              <QuestCardSkeleton key={'skeleton-' + idx} />
            ))
          : null}
      </AvailableMissionsStack>
    </AvailableMissionsContainer>
  );
};
