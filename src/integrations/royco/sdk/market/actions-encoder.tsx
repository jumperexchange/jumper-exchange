import { ethers } from 'ethers';
import type { MarketActions } from './types';
import { Contract as WeirollContract, Planner } from '@weiroll/weiroll.js';
import { getRefinedFixedValue, isMarketActionScriptValid } from './validators';

export type encodeActionsReturnType = {
  status: boolean;
  message: string;
  script: {
    commands: string[];
    state: string[];
  } | null;
  cause: string | null;
};

export const encodeActions = ({
  marketActions,
}: {
  marketActions: MarketActions;
}): encodeActionsReturnType => {
  try {
    const isValid = isMarketActionScriptValid({ marketActions });

    if (!isValid.status) {
      const error = new Error(isValid.message);
      (error as any).cause = isValid.cause;
      throw error;
    }

    const planner = new Planner();

    let action_results = new Array(marketActions.length).fill(0);

    for (let i = 0; i < marketActions.length; i++) {
      const marketAction = marketActions[i];

      const { contract_address, contract_function, inputs } = marketAction;

      const ethersContract = new ethers.Contract(contract_address, [
        contract_function,
      ]);

      const commandFlag = 1; // static call
      const weirollContract = WeirollContract.createContract(
        ethersContract,
        commandFlag,
      );

      const mappedInputs = inputs.map((input, inputIndex) => {
        if (input.input_type === 'fixed') {
          const refinedValue = getRefinedFixedValue({
            type: contract_function.inputs[inputIndex].type,
            value: input.fixed_value as string,
          });

          if (refinedValue.value === undefined) {
            const error = new Error(refinedValue.message);
            (error as any).cause =
              `Invalid input value for action ${i}, input ${inputIndex}`;
            throw error;
          }

          return refinedValue.value;
        } else if (input.input_type === 'dynamic') {
          const { action_index } = input.dynamic_value as {
            action_index: number;
          };

          return action_results[action_index];
        }
      });

      action_results[i] = planner.add(
        weirollContract[contract_function.name](...mappedInputs),
      );
    }

    const { commands, state } = planner.plan();

    return {
      status: true,
      message: 'Success',
      script: {
        commands,
        state,
      },
      cause: null,
    };
  } catch (error: any) {
    return {
      status: false,
      message: error.message || 'Unknown error',
      script: null,
      cause: error.cause || 'Unknown cause',
    };
  }
};
