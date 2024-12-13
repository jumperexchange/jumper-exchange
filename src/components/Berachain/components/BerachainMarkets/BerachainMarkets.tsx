import { Box } from '@mui/material';
import { useBerachainMarket } from '../../hooks/useBerachainMarket';
import { BerachainMarketCard } from '../BerachainMarketCard/BerachainMarketCard';
import { BerachainMarketCards } from './BerachainMarkets.style';
import { BerachainMarketsFilters } from './BerachainMarketsFilters/BerachainMarketsFilters';
import { BerachainMarketsHeader } from './BerachainMarketsHeader';
import { useEnrichedMarkets } from 'royco/hooks';
import { useBerachainMarkets } from '@/components/Berachain/hooks/useBerachainMarkets';
import type { EnrichedMarketDataType } from 'royco/queries';

export const BerachainMarkets = () => {
  const { data, url, findFromStrapiByUid } = useBerachainMarkets();
  const { data: roycoData } = useEnrichedMarkets({
    is_verified: false,
    // chain_id: 11155111,
    sorting: [{ id: 'locked_quantity_usd', desc: true }],
  });

  return (
    <Box>
      <BerachainMarketsHeader />
      <BerachainMarketsFilters />
      <BerachainMarketCards>
        {!roycoData ||
          (!data &&
            Array.from({ length: 9 }, () => 42).map((_, idx) => (
              <BerachainMarketCard
                roycoData={{} as EnrichedMarketDataType}
                key={idx}
              />
            )))}
        {Array.isArray(roycoData) &&
          roycoData?.map((roycoData, index) => {
            if (!roycoData?.id) {
              return;
            }
            const card = findFromStrapiByUid(roycoData.market_id!);
            return (
              <BerachainMarketCard
                key={`berachain-market-card-${roycoData.id || 'protocol'}-${index}`}
                roycoData={roycoData}
                // chainId={roycoData.chain_id}
                image={card?.attributes.Image}
                // title={roycoData.name}
                // slug={roycoData.id}
                // slug={card.attributes.Slug}
                tokens={[]}
                // netApy={roycoData.native_annual_change_ratio}
                // @ts-ignore
                // apys={roycoData.native_annual_change_ratios} // existing but not typed :(
                // tvl={roycoData.locked_quantity_usd}
                type={card.attributes.CustomInformation?.type}
                url={url}
              />
            );
          })}
      </BerachainMarketCards>
    </Box>
  );
};
