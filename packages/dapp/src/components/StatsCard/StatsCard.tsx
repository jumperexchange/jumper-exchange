import { Box, Typography, useTheme } from '@mui/material';
import { useFetchDexsAndBridges } from '../../hooks';
import { useCountUpAnimation } from '../../hooks/useCountUpAnimation';
import { useChainInfos } from '../../providers/ChainInfosProvider';
import { StatsModal } from '../StatsModal/StatsModal';
import { Card, Container } from './StatsCard.style';

interface StatsCardProps {
  number: number;
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
          mt: theme.spacing(1),
          [theme.breakpoints.up('sm')]: {
            fontSize: '16px',
          },
        }}
      >
        {title}
      </Typography>
    </Card>
  );
};

const sortByName = (data) => {
  return data?.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
};

export const StatsCards = ({
  openChainsPopper,
  setOpenChainsPopper,
  openBridgesPopper,
  setOpenBridgesPopper,
  openDexsPopper,
  setOpenDexsPopper,
}) => {
  const { data } = useFetchDexsAndBridges();
  const { chains } = useChainInfos();

  const statsData = [
    {
      title: 'Chains',
      number: chains.length || 22,
      data: sortByName(chains),
      open: openChainsPopper,
      setOpen: setOpenChainsPopper,
      handleOnClick: () => {
        setOpenChainsPopper(!openChainsPopper);
      },
    },
    {
      title: 'Bridges',
      number: data?.bridges.length || 16,
      data: sortByName(data?.bridges),
      open: openBridgesPopper,
      setOpen: setOpenBridgesPopper,
      handleOnClick: () => {
        setOpenBridgesPopper(!openBridgesPopper);
      },
    },
    {
      title: 'DEXs',
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
      {statsData?.map((el, index) => {
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
