import { Box, Typography, useTheme } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchDexsAndBridges } from '../../hooks';
import { useChains } from '../../hooks/useChains';
import { useCountUpAnimation } from '../../hooks/useCountUpAnimation';
import { StatsModal } from '../StatsModal/StatsModal';
import { Card, Container } from './StatsCard.style';

interface StatsCardProps {
  number: string;
  title: string;
  handleClick: () => void;
}

export const StatsCard = ({ number, title, handleClick }: StatsCardProps) => {
  const theme = useTheme();
  const counter = useCountUpAnimation({ children: number, duration: 1000 });
  return (
    <Card
      className={'stats-card'}
      onClick={handleClick}
      sx={{ cursor: 'pointer' }}
    >
      <Typography
        variant={'lifiHeaderMedium'}
        sx={{
          fontSize: '24px',
          lineHeight: '32px',
          pointerEvents: 'none',
          [theme.breakpoints.up('sm')]: {
            fontSize: '32px',
            lineHeight: '40px',
          },
        }}
      >
        {counter}
      </Typography>
      <Typography
        variant={'lifiBodySmall'}
        sx={{
          pointerEvents: 'none',
          [theme.breakpoints.up('sm')]: {
            mt: theme.spacing(1),
            fontSize: '16px',
          },
        }}
      >
        {title}
      </Typography>
    </Card>
  );
};

type DataItem = {
  name: string;
  // Other properties of the data item
};

const sortByName = (data: DataItem[]): DataItem[] => {
  return data?.sort(function (a: DataItem, b: DataItem) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
};

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

export const StatsCards = ({
  openChainsPopper,
  setOpenChainsPopper,
  openBridgesPopper,
  setOpenBridgesPopper,
  openDexsPopper,
  setOpenDexsPopper,
}: StatsCardsProps) => {
  const { data } = useFetchDexsAndBridges();
  const { chains } = useChains();
  const { t } = useTranslation();

  const statsData: StatsDataProps[] = [
    {
      title: t('navbar.statsCards.chains'),
      number: chains.length || 22,
      data: sortByName(chains),
      open: openChainsPopper,
      setOpen: setOpenChainsPopper,
      handleOnClick: () => {
        setOpenChainsPopper(!openChainsPopper);
      },
    },
    {
      title: t('navbar.statsCards.bridges'),
      number: data?.bridges.length || 16,
      data: sortByName(data?.bridges),
      open: openBridgesPopper,
      setOpen: setOpenBridgesPopper,
      handleOnClick: () => {
        setOpenBridgesPopper(!openBridgesPopper);
      },
    },
    {
      title: t('navbar.statsCards.dexs'),
      number: data?.exchanges.length || 32,
      data: sortByName(data?.exchanges),
      open: openDexsPopper,
      setOpen: setOpenDexsPopper,
      handleOnClick: () => {
        setOpenDexsPopper(!openDexsPopper);
      },
    },
  ];

  return (
    <Container>
      {statsData.map((el, index) => {
        return (
          <Box key={`stats-box-${el.title}-${index}`}>
            <StatsCard
              title={el.title}
              number={el.number}
              handleClick={el.handleOnClick}
            />
            <StatsModal
              title={el.title}
              open={el.open}
              setOpen={el.setOpen}
              data={el.data}
            />
          </Box>
        );
      })}
    </Container>
  );
};
