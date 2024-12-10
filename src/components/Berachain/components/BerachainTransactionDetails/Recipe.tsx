import { Typography } from '@mui/material';
import ActionFlow from '@/components/Berachain/components/BerachainTransactionDetails/ActionFlow';
import { useActiveMarket } from '../../hooks/useActiveMarket';

function Recipe() {
  console.log('recipe type')

  const {
    isLoading,
    marketMetadata,
    currentMarketData,
    previousMarketData,
    propsReadMarket,
    propsActionsDecoderEnterMarket,
    propsActionsDecoderExitMarket,
  } = useActiveMarket();

  return (
    <div className="mb-2 grid grid-cols-2 gap-x-1 md:gap-x-3">
      <div>
        <Typography>Deposit Script</Typography>

        <div
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
        </div>
      </div>

      <div>
        <SecondaryLabel>Withdrawal Script</SecondaryLabel>

        <div
          className={cn(
            BASE_MARGIN_TOP.SM,
            "max-h-[200px] overflow-x-hidden overflow-y-scroll rounded-lg border p-1"
          )}
        >
          <ActionFlow
            size="xs"
            actions={propsActionsDecoderExitMarket.data ?? []}
            showAlertIcon={false}
          />
        </div>
      </div>
    </div>
  )

}

export default Recipe;
