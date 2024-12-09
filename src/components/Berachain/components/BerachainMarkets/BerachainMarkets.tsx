import { Box } from '@mui/material';
import { useBerachainMarket } from '../../hooks/useBerachainMarket';
import { BerachainMarketCard } from '../BerachainMarketCard/BerachainMarketCard';
import { BerachainMarketCards } from './BerachainMarkets.style';
import { BerachainMarketsFilters } from './BerachainMarketsFilters/BerachainMarketsFilters';
import { BerachainMarketsHeader } from './BerachainMarketsHeader';
import { useEnrichedMarkets } from 'royco/hooks';
import { useBerachainMarkets } from '@/components/Berachain/hooks/useBerachainMarkets';

export const BerachainMarkets = () => {
  const { data, url } = useBerachainMarkets();
  console.log('-------', data, url)
  const { data: roycoData } = useEnrichedMarkets({
    is_verified: true,
    sorting: [{ id: 'locked_quantity_usd', desc: true }],
  });
  console.log('roy', roycoData);
  return (
    <Box>
      <BerachainMarketsHeader />
      <BerachainMarketsFilters />
      <BerachainMarketCards>
        {!roycoData || !data && Array.from({ length: 9 }, () => 42).map((_, idx) => (
          <BerachainMarketCard key={idx} />
        ))}
        {false && Array.isArray(roycoData)
          && roycoData?.map((roycoData, index) => {
            const card = data?.[0]
            console.log('--card', card)
            return (
              <BerachainMarketCard
                key={`berachain-market-card-${roycoData.id || 'protocol'}-${index}`}
                chainId={roycoData.chain_id}
                image={card.attributes.Image}
                title={roycoData.description}
                // slug={roycoData.id}
                slug={card.attributes.Slug}
                tokens={[]}
                apys={[roycoData.native_annual_change_ratio]}
                tvl={roycoData.locked_quantity_usd}
                type={card.attributes.CustomInformation?.type}
                url={url}
                deposited={index % 2 === 0 ? `${index * 100}$` : undefined}
              />
            )
          })}
      </BerachainMarketCards>
    </Box>
  );
};
