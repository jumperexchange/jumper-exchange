import { Box, Grid, Typography } from '@mui/material';
import { BerachainMarketCard } from '../BerachainMarketCard/BerachainMarketCard';
import { BerachainMarketCards } from './BerachainMarkets.style';
import { BerachainMarketsFilters } from './BerachainMarketsFilters/BerachainMarketsFilters';
import { BerachainMarketsHeader } from './BerachainMarketsHeader';
import { useBerachainMarkets } from '@/components/Berachain/hooks/useBerachainMarkets';
import type { EnrichedMarketDataType } from 'royco/queries';
import { useBerachainMarketsFilterStore } from '@/components/Berachain/stores/BerachainMarketsFilterStore';
import { useSearchParams } from 'next/navigation';
import { getFullTitle, includesCaseInsensitive } from '@/components/Berachain/utils';
import useBerachainFilters from '@/components/Berachain/hooks/useBerachainFilters';

export const BerachainMarkets = () => {
  const searchParam = useSearchParams();
  const isVerified = searchParam.get('is_verified') !== 'false';
  const { data, url, findFromStrapiByUid } = useBerachainMarkets();
  const berachainFilters = useBerachainFilters();
  const { roycoMarkets: roycoData } = useBerachainMarketsFilterStore(
    (state) => state,
  );

  // TODO: move useEnrichedMarkets to a hook so we can filter it from there
  const { tokenFilter, baffleOnly, incentiveFilter, search } =
    useBerachainMarketsFilterStore((state) => state);

  return (
    <Box>
      <Grid
        item
        xs={12}
        md={12}
        sx={{
          border: '1px solid #383433',
          width: '100%',
          textAlign: 'center',
          gridColumn: '1 / -1',
          padding: 1,
          borderRadius: 2,
          marginBottom: 1,
        }}
      >
        <Typography
          sx={(theme) => ({
            color: theme.palette.text.primary,
          })}
        >
          Boyco ends on Feb 3rtd 12AM UTC.
        </Typography>
      </Grid>
      <BerachainMarketsHeader />
      <BerachainMarketsFilters />
      <BerachainMarketCards>
        {(!Array.isArray(roycoData) || roycoData.length === 0 || !data) &&
          Array.from({ length: 9 }, () => 42).map((_, idx) => (
            <BerachainMarketCard
              roycoData={{} as EnrichedMarketDataType}
              key={idx}
            />
          ))}
        {/*        {true && (
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              border: '1px solid #383433',
              width: '100%',
              textAlign: 'center',
              gridColumn: '1 / -1',
              padding: 8,
              borderRadius: 2,
            }}
          >
            <Typography
              sx={(theme) => ({
                color: theme.palette.text.primary,
              })}
            >
              Bera with us. Boyco markets are seeing high demand. Bears are on
              it.
            </Typography>
          </Grid>
        )*/}
        {Array.isArray(roycoData) &&
          roycoData?.length > 0 &&
          roycoData
            .filter(
              (data) => !tokenFilter.includes(data.input_token_data?.symbol),
            )
            .filter((data) => {
              const dataIncentives =
                data.incentive_tokens_data?.map((s) => s.symbol) ?? [];
              return !dataIncentives.some((symbol) =>
                incentiveFilter.includes(symbol),
              );
            })
            .filter((data) => {
              const card = findFromStrapiByUid(data.market_id!);

              const fullTitle = getFullTitle(data, card);

              return search ? includesCaseInsensitive(fullTitle, search) : true;
            })
            .filter((data) => {
              return !!findFromStrapiByUid(data.market_id!);
            })
            .map((roycoData, index) => {
              if (!roycoData?.id) {
                return;
              }
              const card = findFromStrapiByUid(roycoData.market_id!);

              const fullTitle = getFullTitle(roycoData, card);

              return (
                <BerachainMarketCard
                  extraRewards={
                    card?.attributes.CustomInformation?.extraRewards
                  }
                  key={`berachain-market-card-${roycoData.id || 'protocol'}-${index}`}
                  roycoData={roycoData}
                  // chainId={roycoData.chain_id}
                  image={card?.attributes?.Image}
                  title={fullTitle}
                  // slug={roycoData.id}
                  // slug={card.attributes?.Slug}
                  tokens={[]}
                  // netApy={roycoData.native_annual_change_ratio}
                  // @ts-ignore
                  // apys={roycoData.native_annual_change_ratios} // existing but not typed :(
                  // tvl={roycoData.locked_quantity_usd}
                  type={card.attributes?.CustomInformation?.type}
                  url={url}
                />
              );
            })}
      </BerachainMarketCards>
    </Box>
  );
};
