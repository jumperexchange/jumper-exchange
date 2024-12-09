import { Box } from '@mui/material';
import { useBerachainMarket } from '../../hooks/useBerachainMarket';
import { BerachainMarketCard } from '../BerachainMarketCard/BerachainMarketCard';
import { BerachainMarketCards } from './BerachainMarkets.style';
import { BerachainMarketsFilters } from './BerachainMarketsFilters/BerachainMarketsFilters';
import { BerachainMarketsHeader } from './BerachainMarketsHeader';

export const BerachainMarkets = () => {
  const { data, isLoading, url } = useBerachainMarket();
  return (
    <Box>
      <BerachainMarketsHeader />
      <BerachainMarketsFilters />
      <BerachainMarketCards>
        {data && !isLoading
          ? data?.map((card, index) => (
              <BerachainMarketCard
                key={`berachain-market-card-${card.id || 'protocol'}-${index}`}
                chainId={card.protocolInfos?.chain}
                image={card.attributes.Image}
                title={card.attributes.Title}
                slug={card.attributes.Slug}
                tokens={card.protocolInfos?.tokens}
                apys={card.protocolInfos?.apys}
                tvl={card.protocolInfos?.tvl}
                type={card.attributes.CustomInformation?.type}
                url={url}
                deposited={index % 2 === 0 ? `${index * 100}$` : undefined}
              />
            ))
          : Array.from({ length: 9 }, () => 42).map((_, idx) => (
              <BerachainMarketCard key={idx} />
            ))}
      </BerachainMarketCards>
    </Box>
  );
};
