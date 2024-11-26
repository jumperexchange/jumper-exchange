import type { ExtendedChain } from '@lifi/sdk';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { Box, Typography } from '@mui/material';
import {
  BerachainMarketCardDepositBox,
  BerachainMarketCardDepositInfo,
  BerachainMarketCardDepositToken,
} from './BerachainMarketCardDeposit.style';
interface BerachainMarketCardDepositProps {
  chain?: ExtendedChain;
}

const BerachainMarketCardDeposit = ({
  chain,
}: BerachainMarketCardDepositProps) => {
  return (
    // chain &&
    // chain?.logoURI && (
    <BerachainMarketCardDepositBox>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Typography variant="bodyXSmallStrong">
          {chain?.name || 'BASE'}
        </Typography>
        {/* <Image src={chain.logoURI} alt={chain.name} width={20} height={20} /> */}
        <AltRouteIcon sx={{ transform: 'rotate(90deg)' }} />
        <BerachainMarketCardDepositToken variant="bodyXSmallStrong">
          USDC
        </BerachainMarketCardDepositToken>
      </Box>
      <BerachainMarketCardDepositInfo>
        <Typography variant="bodyXSmallStrong">$3200.04 deposited</Typography>
      </BerachainMarketCardDepositInfo>
    </BerachainMarketCardDepositBox>
    // )
  );
};

export default BerachainMarketCardDeposit;
