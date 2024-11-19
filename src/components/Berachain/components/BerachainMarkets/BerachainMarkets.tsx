import { Box } from '@mui/material';
import { useBerachainMarket } from '../../hooks/useBerachainMarket';
import { BerachainMarketCard } from '../BerachainMarketCard/BerachainMarketCard';
import { BerachainMarketCards } from './BerachainMarkets.style';
import { BerachainMarketsFilters } from './BerachainMarketsFilters/BerachainMarketsFilters';
import { BerachainMarketsHeader } from './BerachainMarketsHeader';

export const BerachainMarkets = () => {
  const data = useBerachainMarket();

  return (
    <Box>
      <BerachainMarketsHeader />
      <BerachainMarketsFilters />
      <BerachainMarketCards>
        {data?.map((card) => (
          <BerachainMarketCard
            chainId={card.chain}
            protocol={card.protocol}
            tokens={card.tokens}
            apys={card.apys}
            tvl={card.tvl}
          />
        ))}
      </BerachainMarketCards>
    </Box>
  );
};
