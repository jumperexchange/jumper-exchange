import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { StatsModal } from 'src/components';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useChains, useFetchDexsAndBridges, useUserTracking } from 'src/hooks';
import { EventTrackingTool, type DataItem } from 'src/types';
import { sortByName } from 'src/utils';
import { StatsCardsContainer as Container, StatsCard } from '.';
interface StatsDataProps {
  title: string;
  number: string;
  data: DataItem[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleOnClick: () => void;
}

interface StatsCardsProps {
  openChainsPopper: boolean;
  setOpenChainsPopper: Dispatch<SetStateAction<boolean>>;
  openBridgesPopper: boolean;
  setOpenBridgesPopper: Dispatch<SetStateAction<boolean>>;
  openDexsPopper: boolean;
  setOpenDexsPopper: Dispatch<SetStateAction<boolean>>;
}

const CHAINS_INDEX = 0;
const BRIDGES_INDEX = 1;
const DEXS_INDEX = 2;

export const StatsCards = ({
  openChainsPopper,
  setOpenChainsPopper,
  openBridgesPopper,
  setOpenBridgesPopper,
  openDexsPopper,
  setOpenDexsPopper,
}: StatsCardsProps) => {
  const { exchanges, bridges } = useFetchDexsAndBridges();
  const { chains } = useChains();
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();

  const statsData: StatsDataProps[] = [
    {
      title: t('navbar.statsCards.chains'),
      number: chains?.length || 0,
      data: sortByName(chains),
      open: openChainsPopper,
      setOpen: setOpenChainsPopper,
      handleOnClick: () => {
        trackEvent({
          category: TrackingCategory.WelcomeScreen,
          action: TrackingAction.OpenStatsModal,
          label: 'chains_stats',
          data: { [TrackingEventParameter.StatsModal]: 'chains_stats' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
        });
        setOpenChainsPopper(!openChainsPopper);
      },
    },
    {
      title: t('navbar.statsCards.bridges'),
      number: bridges?.length || 0,
      data: sortByName(bridges),
      open: openBridgesPopper,
      setOpen: setOpenBridgesPopper,
      handleOnClick: () => {
        trackEvent({
          category: TrackingCategory.WelcomeScreen,
          action: TrackingAction.OpenStatsModal,
          label: 'bridges_stats',
          data: { [TrackingEventParameter.StatsModal]: 'bridges_stats' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
        });
        setOpenBridgesPopper(!openBridgesPopper);
      },
    },
    {
      title: t('navbar.statsCards.dexs'),
      number: exchanges?.length || 0,
      data: sortByName(exchanges),
      open: openDexsPopper,
      setOpen: setOpenDexsPopper,
      handleOnClick: () => {
        trackEvent({
          category: TrackingCategory.WelcomeScreen,
          action: TrackingAction.OpenStatsModal,
          label: 'dexes_stats',
          data: { [TrackingEventParameter.StatsModal]: 'dexes_stats' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
        });
        setOpenDexsPopper(!openDexsPopper);
      },
    },
  ];

  return (
    <Container>
      {/* Chains */}
      <StatsCard
        title={statsData[CHAINS_INDEX].title}
        number={statsData[CHAINS_INDEX].number}
        handleClick={statsData[CHAINS_INDEX].handleOnClick}
      />
      <StatsModal
        title={statsData[CHAINS_INDEX].title}
        open={statsData[CHAINS_INDEX].open}
        setOpen={statsData[CHAINS_INDEX].setOpen}
        data={statsData[CHAINS_INDEX].data}
      />
      {/* Bridges */}
      <StatsCard
        title={statsData[BRIDGES_INDEX].title}
        number={statsData[BRIDGES_INDEX].number}
        handleClick={statsData[BRIDGES_INDEX].handleOnClick}
      />
      <StatsModal
        title={statsData[BRIDGES_INDEX].title}
        open={statsData[BRIDGES_INDEX].open}
        setOpen={statsData[BRIDGES_INDEX].setOpen}
        data={statsData[BRIDGES_INDEX].data}
      />
      {/* DEXs */}
      <StatsCard
        title={statsData[DEXS_INDEX].title}
        number={statsData[DEXS_INDEX].number}
        handleClick={statsData[DEXS_INDEX].handleOnClick}
      />
      <StatsModal
        title={statsData[DEXS_INDEX].title}
        open={statsData[DEXS_INDEX].open}
        setOpen={statsData[DEXS_INDEX].setOpen}
        data={statsData[DEXS_INDEX].data}
      />
    </Container>
  );
};
