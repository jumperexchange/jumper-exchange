import { Box, Grid, Typography } from '@mui/material';
import { BerachainMarketCard } from '../BerachainMarketCard/BerachainMarketCard';
import { BerachainMarketCards } from './BerachainMarkets.style';
import { BerachainMarketsFilters } from './BerachainMarketsFilters/BerachainMarketsFilters';
import { BerachainMarketsHeader } from './BerachainMarketsHeader';
import { useEnrichedMarkets } from 'royco/hooks';
import { useBerachainMarkets } from '@/components/Berachain/hooks/useBerachainMarkets';
import type { EnrichedMarketDataType } from 'royco/queries';
import { useBerachainMarketsFilterStore } from '@/components/Berachain/stores/BerachainMarketsFilterStore';
import { useSearchParams } from 'next/navigation';
import {
  getFullTitle,
  includesCaseInsensitive,
} from '@/components/Berachain/utils';
import useBerachainFilters from '@/components/Berachain/hooks/useBerachainFilters';
import roycoEnrichedDataCached from '@/components/Berachain/components/BerachainMarkets/roycoEnrichedDataCached';

export const BerachainMarkets = () => {
  const searchParam = useSearchParams();
  const isVerified = searchParam.get('is_verified') !== 'false';
  const { data, url, findFromStrapiByUid } = useBerachainMarkets();
  const berachainFilters = useBerachainFilters();

  const {
    data: roycoData,
    isSuccess,
    isError,
  } = useEnrichedMarkets({
    is_verified: isVerified,
    sorting: [{ id: 'locked_quantity_usd', desc: true }],
    ...berachainFilters,
  });

  // TODO: move useEnrichedMarkets to a hook so we can filter it from there
  const { tokenFilter, incentiveFilter, search } =
    useBerachainMarketsFilterStore((state) => state);

  return (
    <Box>
      <BerachainMarketsHeader />
      <BerachainMarketsFilters />
      <BerachainMarketCards>
        {(!isSuccess || !roycoData || !data) &&
          Array.from({ length: 9 }, () => 42).map((_, idx) => (
            <BerachainMarketCard
              roycoData={{} as EnrichedMarketDataType}
              key={idx}
            />
          ))}
        {/*        {isError && (
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              border: '1px solid white',
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
              Boyco is having issues returning the markets. Please refresh the
              page or try again later.
            </Typography>
          </Grid>
        )}*/}
        {isSuccess &&
          Array.isArray(roycoData) &&
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
        {(isError || roycoData?.length === 0) &&
          Array.isArray(roycoEnrichedDataCached) &&
          roycoEnrichedDataCached
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
