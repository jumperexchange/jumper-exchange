import { Box, Typography } from '@mui/material';
import type { BerachainIncentiveToken } from 'src/components/Berachain/BerachainType';

interface DigitCardProps {
  tokens: BerachainIncentiveToken[];
  perInput?: boolean;
  amount?: number;
}

export const TokenIncentivesData = ({
  tokens,
  perInput,
  amount,
}: DigitCardProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {tokens?.map((incentiveTokenData: BerachainIncentiveToken) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '4px',
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
                }).format(incentiveTokenData.token_amount)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
