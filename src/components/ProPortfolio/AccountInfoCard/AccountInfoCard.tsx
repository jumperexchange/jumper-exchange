import type { AccountSummary } from '@/types/pro-portfolio';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export interface AccountInfoCardProps {
  account: AccountSummary;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const AccountInfoCard = ({ account }: AccountInfoCardProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: (theme.vars || theme).palette.surface2.main,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      {/* Wallet header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: (theme.vars || theme).palette.accent1Alt.main,
            fontSize: 14,
          }}
        >
          {(account.ensName ?? account.address).slice(0, 2).toUpperCase()}
        </Avatar>
        <Box>
          {account.ensName && (
            <Typography variant="bodyMediumStrong">
              {account.ensName}
            </Typography>
          )}
          <Typography variant="bodySmall" color="text.secondary">
            {truncateAddress(account.address)}
          </Typography>
        </Box>
        <Typography
          variant="bodyLargeStrong"
          sx={{ ml: 'auto', fontVariantNumeric: 'tabular-nums' }}
        >
          $
          {account.totalBalanceUsd.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })}
        </Typography>
      </Box>

      {/* Chain breakdown */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Typography variant="bodySmallStrong" color="text.secondary">
          Chain Breakdown
        </Typography>
        {account.chainBreakdown.map((chain) => (
          <Box key={chain.chainId}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {chain.chainLogo && (
                  <Avatar
                    src={chain.chainLogo}
                    sx={{ width: 20, height: 20 }}
                  />
                )}
                <Typography variant="bodySmall">{chain.chainName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="bodySmall"
                  sx={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  $
                  {chain.balanceUsd.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </Typography>
                <Typography
                  variant="bodyXSmall"
                  color="text.secondary"
                  sx={{ width: 42, textAlign: 'right' }}
                >
                  {chain.percentage.toFixed(1)}%
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={chain.percentage}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: `color-mix(in srgb, ${(theme.vars || theme).palette.accent1.main} 15%, transparent)`,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 2,
                  bgcolor: (theme.vars || theme).palette.accent1.main,
                },
              }}
            />
          </Box>
        ))}
      </Box>

      {/* DeFi Positions Summary */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          pt: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="bodySmallStrong" color="text.secondary">
          DeFi Positions
        </Typography>

        <Box
          sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}
        >
          <Box>
            <Typography variant="bodyXSmall" color="text.secondary">
              Net Value
            </Typography>
            <Typography
              variant="bodySmallStrong"
              sx={{ fontVariantNumeric: 'tabular-nums' }}
            >
              $
              {account.defiPositionsSummary.netValueUsd.toLocaleString(
                'en-US',
                { minimumFractionDigits: 2 },
              )}
            </Typography>
          </Box>
          <Box>
            <Typography variant="bodyXSmall" color="text.secondary">
              Positions
            </Typography>
            <Typography variant="bodySmallStrong">
              {account.defiPositionsSummary.positionCount}
            </Typography>
          </Box>
          <Box>
            <Typography variant="bodyXSmall" color="text.secondary">
              Protocols
            </Typography>
            <Typography variant="bodySmallStrong">
              {account.defiPositionsSummary.protocolCount}
            </Typography>
          </Box>
        </Box>

        {/* Top protocols */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {account.defiPositionsSummary.topProtocols.map((protocol) => (
            <Box
              key={protocol.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {protocol.logo && (
                  <Avatar src={protocol.logo} sx={{ width: 20, height: 20 }} />
                )}
                <Typography variant="bodySmall">{protocol.name}</Typography>
              </Box>
              <Typography
                variant="bodySmall"
                sx={{ fontVariantNumeric: 'tabular-nums' }}
              >
                $
                {protocol.valueUsd.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}{' '}
                ({protocol.percentage.toFixed(1)}%)
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
