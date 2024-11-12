import type { MarketAction, MarketActions } from './types';
import {
  isSolidityAddressType,
  isSolidityAddressValid,
  isSolidityBoolType,
  isSolidityBoolValid,
  isSolidityIntType,
  isSolidityIntValid,
  isSolidityBytesType,
  isSolidityBytesValid,
  isSolidityStringType,
  isSolidityStringValid,
  isSolidityArrayType,
  isSolidityAddressArrayType,
  isSolidityAddressArrayValid,
  isSolidityBoolArrayType,
  isSolidityBoolArrayValid,
  isSolidityIntArrayType,
  isSolidityIntArrayValid,
  isSolidityBytesArrayType,
  isSolidityBytesArrayValid,
  isSolidityStringArrayType,
  isSolidityStringArrayValid,
  refineSolidityAddressArray,
  refineSolidityIntArray,
  refineSolidityBoolArray,
  refineSolidityStringArray,
  refineSolidityBytesArray,
  refineSolidityAddress,
  refineSolidityInt,
  refineSolidityBool,
  refineSolidityString,
  refineSolidityBytes,
} from '../utils';

export type isFixedValueValidReturnType = { status: boolean; message: string };

export const isFixedValueValid = ({
  type,
  value,
}: {
  type: string;
  value: string | undefined;
}): isFixedValueValidReturnType => {
  if (isSolidityArrayType(type)) {
    const validators = {
      isSolidityAddressArrayType,
      isSolidityIntArrayType,
      isSolidityBoolArrayType,
      isSolidityStringArrayType,
      isSolidityBytesArrayType,
    };

    const validatorFunctions = {
      isSolidityAddressArrayType: isSolidityAddressArrayValid,
      isSolidityIntArrayType: isSolidityIntArrayValid,
      isSolidityBoolArrayType: isSolidityBoolArrayValid,
      isSolidityStringArrayType: isSolidityStringArrayValid,
      isSolidityBytesArrayType: isSolidityBytesArrayValid,
    };

    for (const [typeCheck, validator] of Object.entries(validators)) {
      if (validator(type)) {
        const status = validatorFunctions[
          typeCheck as keyof typeof validatorFunctions
        ](type, value);
        return {
          status,
          message: status ? `Valid input` : `Invalid input`,
        };
      }
    }

    return { status: false, message: 'Unknown solidity array type' };
  } else {
    const validators = {
      isSolidityAddressType,
      isSolidityIntType,
      isSolidityBoolType,
      isSolidityStringType,
      isSolidityBytesType,
    };

    const validatorFunctions = {
      isSolidityAddressType: isSolidityAddressValid,
      isSolidityIntType: isSolidityIntValid,
      isSolidityBoolType: isSolidityBoolValid,
      isSolidityStringType: isSolidityStringValid,
      isSolidityBytesType: isSolidityBytesValid,
    };

    for (const [typeCheck, validator] of Object.entries(validators)) {
      if (validator(type)) {
        const status = validatorFunctions[
          typeCheck as keyof typeof validatorFunctions
        ](type, value);

        return {
          status,
          message: status ? `Valid input` : `Invalid input`,
        };
      }
    }

    return { status: false, message: 'Unknown solidity type' };
  }
};

export type isDynamicValueValidReturnType = {
  status: boolean;
  message: string;
};

export const isDynamicValueValid = ({
  marketActions,
  input_type,
  dynamic_value,
}: {
  marketActions: MarketActions;
  input_type: string;
  dynamic_value:
    | {
        action_id: string;
        action_index: number;
        output_index: number;
      }
    | undefined;
}): isDynamicValueValidReturnType => {
  try {
    if (!dynamic_value) {
      return { status: false, message: 'Dynamic value is not provided' };
    }

    const { action_index, output_index } = dynamic_value;

    if (action_index > marketActions.length || action_index < 0) {
      return {
        status: false,
        message: 'Reference Action index is out of bounds',
      };
    }

    const refAction = marketActions[action_index];

    if (!refAction) {
      return { status: false, message: 'Reference Action not found' };
    }

    const { contract_function } = refAction;

    if (contract_function.outputs.length !== 1) {
      return {
        status: false,
        message: 'Multiple outputs are not supported',
      };
    }

    if (output_index !== 0) {
      return {
        status: false,
        message: 'Output index is invalid',
      };
    }

    const output = contract_function.outputs[output_index];

    if (!output) {
      return {
        status: false,
        message: 'Reference action does not have required output',
      };
    }

    const { type: output_type } = output;

    if (input_type !== output_type) {
      return {
        status: false,
        message: 'Input type does not match output type',
      };
    }

    return { status: true, message: 'Dynamic value is valid' };
  } catch (error) {
    return { status: false, message: 'Unknown error' };
  }
};

export type isMarketActionValidReturnType = {
  status: boolean;
  message: string;
};

export const isMarketActionValid = ({
  marketActions,
  marketAction,
}: {
  marketActions: MarketActions;
  marketAction: MarketAction;
}): isMarketActionValidReturnType => {
  try {
    const { inputs: inputsRequired } = marketAction.contract_function;
    const { inputs: inputsProvided } = marketAction;

    if (inputsRequired.length !== inputsProvided.length) {
      throw new Error('Required inputs are not provided');
    }

    inputsRequired.forEach((inputRequired, index) => {
      const inputProvided = inputsProvided[index];

      if (inputProvided.input_type === 'fixed') {
        const result = isFixedValueValid({
          type: inputRequired.type,
          value: inputProvided.fixed_value,
        });

        if (!result.status) {
          throw new Error(result.message);
        }
      } else {
        const result = isDynamicValueValid({
          marketActions,
          input_type: inputRequired.type,
          dynamic_value: inputProvided.dynamic_value,
        });

        if (!result.status) {
          throw new Error(result.message);
        }
      }
    });

    return { status: true, message: 'Success' };
  } catch (error: any) {
    return {
      status: false,
      message: error.message ?? 'Unknown error',
    };
  }
};

export type isMarketActionScriptValidReturnType = {
  status: boolean;
  message: string;
  cause: string;
};

export const isMarketActionScriptValid = ({
  marketActions,
}: {
  marketActions: MarketActions;
}): isMarketActionScriptValidReturnType => {
  try {
    marketActions.forEach((marketAction, marketActionIndex) => {
      const { status, message } = isMarketActionValid({
        marketActions,
        marketAction,
      });

      if (!status) {
        const error = new Error(message);
        (error as any).cause =
          `Market Action at index "${marketActionIndex}" with id "${marketAction.id}" is invalid.`;
        throw error;
      }
    });

    return {
      status: true,
      message: 'Valid market action script',
      cause: 'All market actions are valid',
    };
  } catch (error: any) {
    return {
      status: false,
      message: error.message ?? 'Unknown error',
      cause: error.cause ?? 'Unknown cause',
    };
  }
};

export type getRefineFixedValueReturnType = {
  status: boolean;
  message: string;
  value: undefined | string | string[] | boolean | boolean[];
};

export const getRefinedFixedValue = ({
  type,
  value,
}: {
  type: string;
  value: string | undefined;
}): getRefineFixedValueReturnType => {
  try {
    if (isSolidityArrayType(type)) {
      const validators = {
        isSolidityAddressArrayType,
        isSolidityIntArrayType,
        isSolidityBoolArrayType,
        isSolidityStringArrayType,
        isSolidityBytesArrayType,
      };

      const validatorFunctions = {
        isSolidityAddressArrayType: refineSolidityAddressArray,
        isSolidityIntArrayType: refineSolidityIntArray,
        isSolidityBoolArrayType: refineSolidityBoolArray,
        isSolidityStringArrayType: refineSolidityStringArray,
        isSolidityBytesArrayType: refineSolidityBytesArray,
      };

      for (const [typeCheck, validator] of Object.entries(validators)) {
        if (validator(type)) {
          if (!value) {
            throw new Error('Value is not provided');
          }

          const status = validatorFunctions[
            typeCheck as keyof typeof validatorFunctions
          ](type, value);

          return {
            status: status ? true : false,
            message: status ? `Valid` : `Invalid`,
            value: status ? status : undefined,
          };
        }
      }

      return {
        status: false,
        message: 'Unknown solidity array type',
        value: undefined,
      };
    } else {
      const validators = {
        isSolidityAddressType,
        isSolidityIntType,
        isSolidityBoolType,
        isSolidityStringType,
        isSolidityBytesType,
      };

      const validatorFunctions = {
        isSolidityAddressType: refineSolidityAddress,
        isSolidityIntType: refineSolidityInt,
        isSolidityBoolType: refineSolidityBool,
        isSolidityStringType: refineSolidityString,
        isSolidityBytesType: refineSolidityBytes,
      };

      for (const [typeCheck, validator] of Object.entries(validators)) {
        if (validator(type)) {
          if (!value) {
            throw new Error('Value is not provided');
          }

          const status = validatorFunctions[
            typeCheck as keyof typeof validatorFunctions
          ](type, value);

          return {
            status: status ? true : false,
            message: status ? `Valid` : `Invalid`,
            value: status ? status : undefined,
          };
        }
      }

      return {
        status: false,
        message: 'Unknown solidity type',
        value: undefined,
      };
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message ?? 'Unknown error',
      value: undefined,
    };
  }
};
