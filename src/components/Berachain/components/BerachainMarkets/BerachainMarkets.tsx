import { Box, Typography } from '@mui/material';
import { BerachainMarketsHeader } from './BerachainMarketsHeader';
import { BerachainRedirection } from './BerachainRedirection';

export const BerachainMarkets = () => {
  // const searchParam = useSearchParams();
  // const isVerified = searchParam.get('is_verified') !== 'false';
  // const { data, url, findFromStrapiByUid } = useBerachainMarkets();
  // const berachainFilters = useBerachainFilters();
  // const { roycoMarkets: roycoData } = useBerachainMarketsFilterStore(
  //   (state) => state,
  // );

  // TODO: move useEnrichedMarkets to a hook so we can filter it from there
  // const { tokenFilter, baffleOnly, incentiveFilter, search } =
  //   useBerachainMarketsFilterStore((state) => state);

  return (
    <Box>
      <Box
        sx={{
          border: '1px solid #383433',
          textAlign: 'center',
          padding: 1,
          borderRadius: 2,
          marginBottom: 1,
          marginX: 'auto',
          width: '350px',
        }}
      >
        <Typography
          sx={(theme) => ({
            color: '#FF8425',
          })}
        >
          Boyco ended on Feb 2nd at 11:59 pm UTC.
        </Typography>
      </Box>
      <BerachainMarketsHeader />
      <BerachainRedirection />
      {/* <BerachainMarketsFilters /> */}
      {/* <BerachainMarketCards>
        {(!Array.isArray(roycoData) || roycoData.length === 0 || !data) &&
          Array.from({ length: 9 }, () => 42).map((_, idx) => (
            <BerachainMarketCard
              roycoData={{} as EnrichedMarketDataType}
              key={idx}
            />
          ))} */}
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
      {/* {Array.isArray(roycoData) &&
          roycoData?.length > 0 &&
          roycoData
            .filter((data) => {
              if (tokenFilter.length === 0) {
                return true;
              }
              return tokenFilter.includes(data.input_token_data?.symbol);
            })
            .filter((data) => {
              if (incentiveFilter.length === 0) {
                return true;
              }
              const dataIncentives =
                data.incentive_tokens_data?.map((s) => s.symbol) ?? [];
              return dataIncentives.some((symbol) =>
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
            .filter((data) => {
              const card = findFromStrapiByUid(data.market_id!);
              return baffleOnly
                ? card?.attributes.CustomInformation?.extraRewards
                : true;
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
      </BerachainMarketCards> */}
    </Box>
  );
};
