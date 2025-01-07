import { Box, Typography } from '@mui/material';
import type { BerachainIncentiveToken } from 'src/components/Berachain/BerachainType';
import TokenIncentivesCard from '@/components/Berachain/components/BerachainMarketCard/StatCard/TokenIncentivesCard';

interface DigitCardProps {
  tokens: BerachainIncentiveToken[];
}

export const TokenIncentivesData = ({ tokens }: DigitCardProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {tokens?.map((incentiveTokenData: BerachainIncentiveToken) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '4px',
          }}
          key={incentiveTokenData?.id}
        >
          <Typography
            variant="titleXSmall"
            sx={(theme) => ({
              typography: {
                xs: theme.typography.titleXSmall,
                sm: theme.typography.titleXSmall,
              },
            })}
          >
            {Intl.NumberFormat('en-US', {
              notation: 'compact',
              useGrouping: true,
              minimumFractionDigits: 0,
              maximumFractionDigits: 1,
            }).format(incentiveTokenData.token_amount)}{' '}
          </Typography>
          <img
            key={`berachain-market-card-token-${incentiveTokenData?.name}-${incentiveTokenData?.id}`}
            src={incentiveTokenData?.image}
            alt={`${incentiveTokenData?.name}-logo`}
            width={24}
            height={24}
            style={{
              borderRadius: '10px',
              marginLeft: '4px',
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default TokenIncentivesCard;
