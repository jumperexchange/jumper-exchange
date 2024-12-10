import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { EnrichedMarketDataType } from 'royco/queries';
import { RoycoMarketType } from 'royco/market';
import Recipe from './Recipe';
import Vault from './Vault';

function BerachainTransactionDetails({ market }: { market: EnrichedMarketDataType }) {
  return (
    <Box>
      <Typography variant="body2" color="textSecondary">Transaction Details</Typography>
      {market.market_type === RoycoMarketType.recipe.value && <Recipe market={market} />}
      {market.market_type === RoycoMarketType.vault.value && <Vault market={market} />}
    </Box>
  )
}

export default BerachainTransactionDetails;
