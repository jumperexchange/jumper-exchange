import { Box } from '@mui/material';
import { useBerachainMarket } from '../../hooks/useBerachainMarket';
import { BerachainMarketCard } from '../BerachainMarketCard/BerachainMarketCard';
import { BerachainMarketCards } from './BerachainMarkets.style';
import { BerachainMarketsFilters } from './BerachainMarketsFilters/BerachainMarketsFilters';
import { BerachainMarketsHeader } from './BerachainMarketsHeader';

export const BerachainMarkets = () => {
  const { data, url } = useBerachainMarket();
  return (
    <Box>
      <BerachainMarketsHeader />
      <BerachainMarketsFilters />
      <BerachainMarketCards>
        {data?.map((card, index) => (
          <BerachainMarketCard
            key={`berachain-market-card-${card.id || 'protocol'}-${index}`}
            // chainId={card.chain}
            image={card.attributes.Image}
            title={card.attributes.Title}
            // protocol={card.protocol}
            // tokens={card.tokens}
            // apys={card.apys}
            // tvl={card.tvl}
            url={url}
          />
        ))}
      </BerachainMarketCards>
    </Box>
  );
};
