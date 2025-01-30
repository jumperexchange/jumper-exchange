import type { EnrichedMarketDataType } from 'royco/queries';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  aprCalculation,
  calculateBeraYield,
  titleSlicer,
} from '@/components/Berachain/utils';
import { useActiveMarket } from '@/components/Berachain/hooks/useActiveMarket';
import { useMemo } from 'react';
import { useTokenQuotes } from 'royco/hooks';
import { useBerachainMarketsFilterStore } from '@/components/Berachain/stores/BerachainMarketsFilterStore';

function TooltipIncentives({ market }: { market: EnrichedMarketDataType }) {
  const { t } = useTranslation();
  const { roycoStats, beraTokenQuote, roycoMarkets } =
    useBerachainMarketsFilterStore((state) => state);
  const { currentHighestOffers, marketMetadata } = useActiveMarket({
    chain_id: market.chain_id,
    market_id: market.market_id,
    market_type: market.market_type,
  });

  const highestIncentives = useMemo(() => {
    if (
      !currentHighestOffers ||
      currentHighestOffers.ip_offers.length === 0 ||
      currentHighestOffers.ip_offers[0].tokens_data.length === 0
    ) {
      return [];
    }

    return currentHighestOffers.ip_offers[0].tokens_data ?? [];
  }, [market, currentHighestOffers]);

  const apr = useMemo(() => {
    if (!market || !roycoMarkets) {
      return;
    }

    return calculateBeraYield({
      enrichedMarket: market,
      customTokenData: [beraTokenQuote],
      markets: roycoMarkets,
    });
  }, [roycoMarkets, market, beraTokenQuote]);

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Per 1
        </Typography>
        <img
          key={`berachain-market-card-token-${market?.input_token_data?.name}-${market?.input_token_data?.id}`}
          src={market?.input_token_data?.image}
          alt={`${market?.input_token_data?.name}-logo`}
          width={16}
          height={16}
          style={{
            borderRadius: '10px',
            marginLeft: '6px',
            marginRight: '2px',
          }}
        />
        <Typography variant="body2" color="textSecondary">
          {` ${titleSlicer(market?.input_token_data.symbol)}, you receive:`}
        </Typography>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={'8px'}
        marginTop={'8px'}
      >
        {[beraTokenQuote]?.map((incentiveTokenData) => (
          <Box
            key={incentiveTokenData.id}
            display={'flex'}
            flexDirection={'row'}
            marginLeft={'4px'}
            gap={'4px'}
          >
            <img
              key={`berachain-market-card-token-${incentiveTokenData?.name}-${incentiveTokenData?.id}`}
              src={incentiveTokenData?.image}
              alt={`${incentiveTokenData?.name}-logo`}
              width={16}
              height={16}
              style={{
                borderRadius: '10px',
                marginLeft: '4px',
              }}
            />
            {/*The below /100 is a test about the token value because it seems that the decimals are included, make sure it works correctly or remove it */}
            {/*{t('format.decimal', {
              value: incentiveTokenData.per_input_token,
            })}{' '}
            {incentiveTokenData.symbol}{' '}*/}
            {apr
              ? t('format.percent', {
                  notation: 'compact',
                  value: apr,
                })
              : '~%'}
          </Box>
        ))}
        {highestIncentives?.map((incentiveTokenData) => (
          <Box
            key={incentiveTokenData.id}
            display={'flex'}
            flexDirection={'row'}
            marginLeft={'4px'}
            gap={'4px'}
          >
            <img
              key={`berachain-market-card-token-${incentiveTokenData?.name}-${incentiveTokenData?.id}`}
              src={incentiveTokenData?.image}
              alt={`${incentiveTokenData?.name}-logo`}
              width={16}
              height={16}
              style={{
                borderRadius: '10px',
                marginLeft: '4px',
              }}
            />
            {/*The below /100 is a test about the token value because it seems that the decimals are included, make sure it works correctly or remove it */}
            {t('format.decimal', {
              value: incentiveTokenData.per_input_token,
            })}{' '}
            {incentiveTokenData.symbol}{' '}
          </Box>
        ))}
        {market?.external_incentives?.map((incentiveTokenData) => (
          <Box
            key={incentiveTokenData.id}
            display={'flex'}
            flexDirection={'row'}
            marginLeft={'4px'}
            gap={'4px'}
          >
            <img
              key={`berachain-market-card-token-${incentiveTokenData?.name}-${incentiveTokenData?.id}`}
              src={incentiveTokenData?.image}
              alt={`${incentiveTokenData?.name}-logo`}
              width={16}
              height={16}
              style={{
                borderRadius: '10px',
                marginLeft: '4px',
              }}
            />
            {incentiveTokenData.value}
            {' on '}
            {incentiveTokenData.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default TooltipIncentives;
