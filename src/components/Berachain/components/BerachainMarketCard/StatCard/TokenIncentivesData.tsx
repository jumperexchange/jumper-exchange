import { Box, Chip, Tooltip, Typography } from '@mui/material';
import type { BerachainIncentiveToken } from 'src/components/Berachain/BerachainType';
import TooltipIncentives from '@/components/Berachain/components/BerachainWidget/TooltipIncentives';
import type { EnrichedMarketDataType } from 'royco/queries';
import {
  aprCalculation,
  divideBy,
  titleSlicer,
} from '@/components/Berachain/utils';
import { useActiveMarket } from '@/components/Berachain/hooks/useActiveMarket';
import { useMemo } from 'react';
import { RoycoMarketType } from 'royco/market';
import { useEnrichedRoycoStats, useTokenQuotes } from 'royco/hooks';
import { useTranslation } from 'react-i18next';

interface DigitCardProps {
  market: EnrichedMarketDataType;
  perInput?: boolean;
  amount?: number;
}

export const TokenIncentivesData = ({
  market,
  perInput,
  amount,
}: DigitCardProps) => {
  const { t } = useTranslation();
  const { currentHighestOffers, marketMetadata, currentMarketData } =
    useActiveMarket({
      chain_id: market.chain_id,
      market_id: market.market_id,
      market_type: market.market_type,
    });
  const { data: roycoStats } = useEnrichedRoycoStats();

  const BERA_TOKEN_ID = '1-0xbe9abe9abe9abe9abe9abe9abe9abe9abe9abe9a';
  const beraTokenQuotes = useTokenQuotes({
    token_ids: [BERA_TOKEN_ID],
  });

  // @ts-expect-error
  const [highestIncentives] = useMemo(() => {
    if (marketMetadata.market_type === RoycoMarketType.recipe.id) {
      if (
        !currentHighestOffers ||
        currentHighestOffers.ip_offers.length === 0 ||
        currentHighestOffers.ip_offers[0].tokens_data.length === 0
      ) {
        return [];
      }

      return currentHighestOffers.ip_offers[0].tokens_data ?? [];
    }
  }, [currentMarketData, currentHighestOffers, marketMetadata]);

  const token = useMemo(() => {
    return market.input_token_data;
  }, [market?.input_token_data]);

  const apr = useMemo(() => {
    if (!market?.locked_quantity_usd || !roycoStats?.total_tvl) {
      return;
    }

    return aprCalculation(market.locked_quantity_usd, roycoStats.total_tvl);
  }, [market?.locked_quantity_usd, roycoStats?.total_tvl])

  const tokens = market?.incentive_tokens_data;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
        }}
      >
        {tokens?.map((incentiveTokenData: BerachainIncentiveToken) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '8px',
              gap: 1,
            }}
            key={incentiveTokenData?.id}
          >
            <img
              key={`berachain-market-card-token-${incentiveTokenData?.name}-${incentiveTokenData?.id}`}
              src={incentiveTokenData?.image}
              alt={`${incentiveTokenData?.name}-logo`}
              width={24}
              height={24}
              style={{
                borderRadius: '10px',
              }}
            />
            <Typography
              variant="titleXSmall"
              sx={(theme) => ({
                typography: {
                  xs: theme.typography.titleXSmall,
                  sm: theme.typography.titleXSmall,
                },
                fontSize: '1rem!important',
              })}
            >
              {perInput && amount
                ? Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    useGrouping: true,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 1,
                  }).format((highestIncentives?.per_input_token ?? 0) * amount)
                : Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    useGrouping: true,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(highestIncentives?.per_input_token ?? 0)}
            </Typography>
            {/*          <Typography
            variant="titleXSmall"
            sx={(theme) => ({
              typography: {
                xs: theme.typography.titleXSmall,
                sm: theme.typography.titleXSmall,
              },
              fontSize: '0.75rem!important',
            })}
          >per {titleSlicer(token.symbol, 14)}
          </Typography>*/}
          </Box>
        ))}
        {beraTokenQuotes.data?.map(
          (incentiveTokenData: BerachainIncentiveToken & any) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '8px',
                gap: 1,
              }}
              key={incentiveTokenData?.id}
            >
              <img
                key={`berachain-market-card-token-${incentiveTokenData?.name}-${incentiveTokenData?.id}`}
                src={incentiveTokenData?.image}
                alt={`${incentiveTokenData?.name}-logo`}
                width={24}
                height={24}
                style={{
                  borderRadius: '10px',
                }}
              />
              <Typography
                variant="titleXSmall"
                sx={(theme) => ({
                  typography: {
                    xs: theme.typography.titleXSmall,
                    sm: theme.typography.titleXSmall,
                  },
                  fontSize: '1rem!important',
                })}
              >
                {!apr ? '~%' : t('format.percent', {
                  value: apr,
                  useGrouping: true,
                  maximumFractionDigits: 2
                })}
              </Typography>
              {/*          <Typography
            variant="titleXSmall"
            sx={(theme) => ({
              typography: {
                xs: theme.typography.titleXSmall,
                sm: theme.typography.titleXSmall,
              },
              fontSize: '0.75rem!important',
            })}
          >per {titleSlicer(token.symbol, 14)}
          </Typography>*/}
            </Box>
          ),
        )}
      </Box>
      {market?.external_incentives.length > 0 && (
        <Tooltip
          title={<TooltipIncentives market={market} />}
          placement={'top'}
          enterTouchDelay={0}
          arrow
        >
          <Chip
            label={`+${market.external_incentives.length} more`}
            variant="outlined"
            sx={{ backgroundColor: '#313131', height: 24, fontSize: '0.75rem' }}
          />
        </Tooltip>
      )}
    </Box>
  );
};
