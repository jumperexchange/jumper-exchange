import { Box, Typography, useTheme } from '@mui/material';
import { useChainInfos } from '../../providers/ChainInfosProvider';
import { useDexsAndBridgesInfos } from '../../providers/DexsAndBridgesInfosProvider';
import { StatsModal } from '../StatsModal/StatsModal';
import { Card, Container } from './StatsCard.style';

interface StatsCardProps {
  number: number;
  title: string;
  handleClick: () => void;
}

export const StatsCard = ({ number, title, handleClick }: StatsCardProps) => {
  const theme = useTheme();
  return (
    <Card
      className={'stats-card'}
      onClick={handleClick}
      sx={{ cursor: 'pointer' }}
    >
      <Typography
        variant={'lifiBrandHeaderXLarge'}
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
        {number}
      </Typography>
      <Typography
        variant={'lifiBrandHeaderLarge'}
        sx={{
          fontSize: '10px',
          lineHeight: '16px',
          pointerEvents: 'none',
          [theme.breakpoints.up('sm')]: {
            fontSize: '16px',
            lineHeight: '20px',
          },
        }}
      >
        {title}
      </Typography>
    </Card>
  );
};

export const StatsCards = ({
  openChainsPopper,
  setOpenChainsPopper,
  openBridgesPopper,
  setOpenBridgesPopper,
  openDexsPopper,
  setOpenDexsPopper,
}) => {
  const { data } = useDexsAndBridgesInfos();
  const { chains } = useChainInfos();

  const statsData = [
    {
      title: 'Chains',
      number: chains.length || 22,
      data: chains,
      open: openChainsPopper,
      setOpen: setOpenChainsPopper,
      handleOnClick: () => {
        setOpenChainsPopper(!openChainsPopper);
      },
    },
    {
      title: 'Bridges',
      number: data.bridges.length || 16,
      data: data.bridges,
      open: openBridgesPopper,
      setOpen: setOpenBridgesPopper,
      handleOnClick: () => {
        setOpenBridgesPopper(!openBridgesPopper);
      },
    },
    {
      title: 'DEXs',
      number: data.exchanges.length || 32,
      data: data.exchanges,
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
