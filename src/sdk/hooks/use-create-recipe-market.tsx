import type { MarketActions } from '../market';
import { useActionsEncoder } from './use-actions-encoder';
import type { REWARD_STYLE } from '../constants';
import { NULL_ADDRESS } from '../constants';
import { ContractMap } from '../contracts';

export const useCreateRecipeMarket = ({
  chainId = 0,
  enterMarketActions,
  exitMarketActions,
  lockupTime,
  inputToken = NULL_ADDRESS as string,
  frontendFee,
  rewardStyle,
}: {
  chainId: number;
  inputToken: string;
  lockupTime: string;
  frontendFee: string;
  enterMarketActions: MarketActions;
  exitMarketActions: MarketActions;
  rewardStyle: REWARD_STYLE;
}) => {
  // Check is market is ready to be created
  let isReady = false;

  // Options to pass to writeContract()
  let writeContractOptions = null;

  // Get smart contract
  const recipeContract =
    ContractMap[chainId as keyof typeof ContractMap]?.RecipeMarketHub ??
    undefined;

  // Encoded commands and states for market
  const enterMarket = useActionsEncoder({ marketActions: enterMarketActions });
  const exitMarket = useActionsEncoder({ marketActions: exitMarketActions });

  // If all data is ready, set isReady to true and set writeContractOptions
  if (recipeContract && enterMarket.data && exitMarket.data) {
    isReady = true;

    writeContractOptions = {
      address: recipeContract.address,
      abi: recipeContract.abi,
      functionName: 'createMarket',
      args: [
        inputToken,
        lockupTime,
        frontendFee, // 1e18 = 100%
        {
          weirollCommands: enterMarket.data.commands,
          weirollState: enterMarket.data.state,
        },
        {
          weirollCommands: exitMarket.data.commands,
          weirollState: exitMarket.data.state,
        },
        rewardStyle, // 0 = Upfront, 1 = Arrear, 2 = Forfeitable
      ],
    };
  }

  return {
    isReady,
    writeContractOptions,
  };
};
