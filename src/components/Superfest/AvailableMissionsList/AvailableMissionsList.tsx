import { useAccounts } from '@/hooks/useAccounts';
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
import Image from 'next/image';

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
  const [rewardsFilter, setRewardsFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const { url } = useOngoingFestMissions();

  const [personName, setPersonName] = useState<string[]>([]);

  const handleChainChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setChainsFilter(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleCategoryChange = (
    event: SelectChangeEvent<typeof personName>,
  ) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    setCategoryFilter(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleRewardChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setRewardsFilter(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <AvailableMissionsContainer>
      <AvailableMissionsHeader>
        <AvailableMissionsTitle>{'Available Missions'}</AvailableMissionsTitle>
        <Box>
          <FormControl sx={{ width: 120 }}>
            <Select
              multiple
              displayEmpty
              value={chainsFilter}
              onChange={handleChainChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                return <SoraTypography fontWeight={700}>Chains</SoraTypography>;
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
              onClose={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {chains.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, chainsFilter, theme)}
                >
                  <Checkbox checked={chainsFilter.indexOf(name) > -1} />
                  <Image
                    src={`https://strapi.li.finance/uploads/fraxtal_bbaa1cb0cd.png`}
                    alt="Effigy Wallet Icon"
                    width={16}
                    height={16}
                    priority={false}
                    style={{ marginRight: '4px' }}
                  />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 120, ml: '4px' }}>
            <Select
              multiple
              displayEmpty
              value={rewardsFilter}
              onChange={handleRewardChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                return (
                  <SoraTypography fontWeight={700}>Rewards</SoraTypography>
                );
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
              onClose={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {Rewards_list.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, rewardsFilter, theme)}
                >
                  <Checkbox checked={rewardsFilter.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 120, ml: '4px' }}>
            <Select
              multiple
              displayEmpty
              value={categoryFilter}
              onChange={handleCategoryChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                return (
                  <SoraTypography fontWeight={700}>Category</SoraTypography>
                );
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
              onClose={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {category.map((name) => (
                <MenuItem
                  key={name}
                  value={name.toLowerCase().replaceAll(' ', '-')}
                  style={getStyles(name, categoryFilter, theme)}
                >
                  <Checkbox
                    checked={
                      categoryFilter.indexOf(
                        name.toLowerCase().replaceAll(' ', '-'),
                      ) > -1
                    }
                  />
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
                } else if (
                  rewardsFilter.includes('No OP Rewards') &&
                  rewardsAmount &&
                  rewardsAmount > 0
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
              console.log('---------');
              console.log(categoryFilter);
              console.log(quest.attributes.Category);
              console.log(
                categoryFilter &&
                  categoryFilter.length > 0 &&
                  quest.attributes.Category &&
                  !categoryFilter.includes(quest.attributes.Category),
              );
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
        {loading
          ? Array.from({ length: 12 }, () => 42).map((_, idx) => (
              <QuestCardSkeleton key={'skeleton-' + idx} />
            ))
          : null}
      </AvailableMissionsStack>
    </AvailableMissionsContainer>
  );
};
