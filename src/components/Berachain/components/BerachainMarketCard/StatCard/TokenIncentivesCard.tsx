import { Box, Breakpoint, Tooltip, Typography, useTheme } from '@mui/material';
import type { EnrichedMarketDataType } from 'royco/queries';
import InfoIcon from '@mui/icons-material/Info';
import {
  BeraChainProgressCardComponent,
  BeraChainProgressCardContent,
  BeraChainProgressCardHeader,
} from './BerachainProgressCard.style';
import TooltipIncentives from '../../BerachainWidget/TooltipIncentives';
import { BerachainIncentiveToken } from 'src/components/Berachain/BerachainType';

interface DigitCardProps {
  marketData: EnrichedMarketDataType;
  tokens: BerachainIncentiveToken[];
}

const TokenIncentivesCard = ({ marketData, tokens }: DigitCardProps) => {
  const theme = useTheme();

  return (
    <Tooltip
      title={
        tokens?.length > 0 ? <TooltipIncentives market={marketData} /> : <></>
      }
      placement="top"
      enterTouchDelay={0}
      arrow
    >
      <div style={{ flexGrow: 1 }}>
        <BeraChainProgressCardComponent
          sx={{
            height: '100%',
            padding: theme.spacing(1.5, 2),
            display: 'flex',
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              padding: theme.spacing(1.5, 2),
            },
          }}
        >
          <BeraChainProgressCardContent>
            <BeraChainProgressCardHeader display={'flex'}>
              <Typography
                variant="bodySmall"
                sx={(theme) => ({
                  typography: {
                    xs: theme.typography.bodyXSmall,
                    sm: theme.typography.bodySmall,
                  },
                })}
              >
                {'Total Incentives'}
              </Typography>
              <Tooltip title={''} placement={'top'} enterTouchDelay={0} arrow>
                <InfoIcon
                  sx={{
                    width: '16px',
                    height: '16px',
                    marginLeft: '4px',
                    color: 'inherit',
                  }}
                />
              </Tooltip>
            </BeraChainProgressCardHeader>
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
          </BeraChainProgressCardContent>
        </BeraChainProgressCardComponent>
      </div>
    </Tooltip>
  );
};

export default TokenIncentivesCard;
