import { Box, Typography } from '@mui/material';
import ActionFlow from '@/components/Berachain/components/BerachainTransactionDetails/ActionFlow';
import { useActiveMarket } from '../../hooks/useActiveMarket';
import type { EnrichedMarketDataType } from 'royco/queries';
import Grid from '@mui/material/Unstable_Grid2';

function Recipe({ market, type }: { market: EnrichedMarketDataType, type: 'deposit' | 'withdraw' }) {
  const {
    isLoading,
    marketMetadata,
    currentMarketData,
    previousMarketData,
    propsReadMarket,
    propsActionsDecoderEnterMarket,
    propsActionsDecoderExitMarket,
    // } = useActiveMarket(market.chain_id, market.market_type, market.market_id);
  } = useActiveMarket(
    1,
    market.market_type,
    '0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b',
  );

  return (
    <Grid
      container
      spacing={{ xs: 1, md: 3 }}
      mb={2}
      className="mb-2 grid grid-cols-2 gap-x-1 md:gap-x-3"
    >
      {type === 'deposit' && (
        <Grid xs={12}>
          <Typography variant="body2" color="textSecondary">
            Deposit Script
          </Typography>
          <Box
            sx={(theme) => ({
              maxHeight: 200, // Matches max-h-[200px]
              overflowX: 'hidden', // Matches overflow-x-hidden
              overflowY: 'auto', // Matches overflow-y-scroll
              border: 1, // Matches border
              borderRadius: '8px', // Matches rounded-lg
              padding: 1, // Matches p-1
              borderColor: theme.palette.text.primary,
            })}
            // className={cn(
            //   // BASE_MARGIN_TOP.SM,
            //   "max-h-[200px] overflow-x-hidden overflow-y-scroll rounded-lg border p-1"
            // )}
          >
            <ActionFlow
              size="xs"
              actions={propsActionsDecoderEnterMarket.data ?? []}
              showAlertIcon={false}
            />
          </Box>
        </Grid>
      )}
      {type === 'withdraw' && (
        <Grid xs={12}>
          <Typography variant="body2" color="textSecondary">
            Withdrawal Script
          </Typography>

          <Box
            sx={(theme) => ({
              maxHeight: 200, // Matches max-h-[200px]
              overflowX: 'hidden', // Matches overflow-x-hidden
              overflowY: 'auto', // Matches overflow-y-scroll
              border: 1, // Matches border
              borderRadius: '8px', // Matches rounded-lg
              padding: 1, // Matches p-1
              borderColor: theme.palette.text.primary,
            })}
            // className={cn(
            //   BASE_MARGIN_TOP.SM,
            //   "max-h-[200px] overflow-x-hidden overflow-y-scroll rounded-lg border p-1"
            // )}
          >
            <ActionFlow
              size="xs"
              actions={propsActionsDecoderExitMarket.data ?? []}
              showAlertIcon={false}
            />
          </Box>
        </Grid>
      )}
    </Grid>
  );
}

export default Recipe;
