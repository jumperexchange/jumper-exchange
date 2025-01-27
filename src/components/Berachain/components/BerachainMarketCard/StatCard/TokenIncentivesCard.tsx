import type { Breakpoint } from '@mui/material';
import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import type { EnrichedMarketDataType } from 'royco/queries';
import InfoIcon from '@mui/icons-material/Info';
import {
  BeraChainProgressCardComponent,
  BeraChainProgressCardContent,
  BeraChainProgressCardHeader,
} from './BerachainProgressCard.style';
import TooltipIncentives from '../../BerachainWidget/TooltipIncentives';
import type { BerachainIncentiveToken } from 'src/components/Berachain/BerachainType';
import { TokenIncentivesData } from '@/components/Berachain/components/BerachainMarketCard/StatCard/TokenIncentivesData';

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
                  color: '#8b8989',
                  typography: {
                    xs: theme.typography.bodyXSmall,
                    sm: theme.typography.bodySmall,
                  },
                  // important needed as the previous rules are overriding the fontSize
                  fontSize: '0.75rem!important',
                })}
              >
                {'Total Incentives'}
              </Typography>
              <Tooltip title={''} placement={'top'} enterTouchDelay={0} arrow>
                <InfoIcon
                  sx={(theme) => ({
                    color: theme.palette.alphaLight500.main,
                    width: '16px',
                    height: '16px',
                    marginLeft: '4px',
                  })}
                />
              </Tooltip>
            </BeraChainProgressCardHeader>
            <TokenIncentivesData market={marketData} />
          </BeraChainProgressCardContent>
        </BeraChainProgressCardComponent>
      </div>
    </Tooltip>
  );
};

export default TokenIncentivesCard;
