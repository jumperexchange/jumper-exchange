import { Box, Chip, Tooltip, Typography } from '@mui/material';
import type { BerachainIncentiveToken } from 'src/components/Berachain/BerachainType';
import TooltipIncentives from '@/components/Berachain/components/BerachainWidget/TooltipIncentives';
import type { EnrichedMarketDataType } from 'royco/queries';
import { divideBy } from '@/components/Berachain/utils';

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
  const tokens = market?.incentive_tokens_data;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
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
            })}
          >
            {perInput && amount
              ? Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  useGrouping: true,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 1,
                }).format(incentiveTokenData.per_input_token * amount)
              : Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  useGrouping: true,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 1,
                }).format(divideBy(incentiveTokenData.token_amount))}
          </Typography>
        </Box>
      ))}
      {market?.external_incentives.length > 0 && (
        <Tooltip
          title={<TooltipIncentives market={market} />}
          placement={'top'}
          enterTouchDelay={0}
          arrow
        >
          <Chip
            label={`+${market.external_incentives.length} rewards`}
            variant="outlined"
            sx={{ backgroundColor: '#313131', height: 24, fontSize: '0.75rem' }}
          />
        </Tooltip>
      )}
    </Box>
  );
};
