import { getExplorerUrl } from '../utils';
import type { TypedAbiFunction } from './types';
import { keccak256, toFunctionSignature } from 'viem';

export type TypedAbiElement = Pick<
  TypedAbiFunction,
  'name' | 'inputs' | 'outputs'
> & {
  type: string;
};

export const decodeCommand = ({
  command,
}: {
  command: string;
}): {
  contract_address: string;
  contract_function: string;
  calldata: string;
} => {
  const unhexedCommand = command.startsWith('0x') ? command.slice(2) : command;

  const contract_function = `0x${unhexedCommand.slice(0, 8)}`;
  const contract_address = `0x${unhexedCommand.slice(24, 64)}`;
  const calldata = `0x${unhexedCommand.slice(64)}`;

  /**
   * @note Following decoded results are not being used in the current implementation but will be added in the future.
   */
  const flags = unhexedCommand.slice(8, 10);
  const input_args = unhexedCommand.slice(10, 22);
  const output_args = unhexedCommand.slice(22, 24);

  return {
    contract_address,
    contract_function,
    calldata,
  };
};

export type decodeActionsReturnType = {
  status: boolean;
  actions: Array<{
    id: string;
    chain_id: number;
    explorer_url: string;
    contract_address: string;
    contract_function: string;
    calldata: string;
    contract_name?: string;
    function_name?: string;
    function_signature?: string;
  }> | null;
  message: string;
  cause: string | null;
};

export const decodeActions = ({
  chain_id,
  script,
  abis,
  contract_map,
}: {
  chain_id: number;
  script: {
    commands: string[];
    state: string[];
  };
  abis?: Array<TypedAbiElement>;
  contract_map?: Record<
    string,
    {
      contract_name: string;
    }
  >;
}): decodeActionsReturnType => {
  try {
    const { commands } = script;

    if (commands.length === 0) {
      return {
        status: true,
        actions: [],
        message: 'Empty Script',
        cause: null,
      };
    }

    const actions = commands.map((command) => {
      const { contract_address, contract_function, calldata } = decodeCommand({
        command,
      });

      const contract_id = `${chain_id}-${contract_address}`.toLowerCase();
      let contract_name = undefined;
      let function_name = undefined;
      let function_signature = undefined;

      const explorer_url = getExplorerUrl({
        chainId: chain_id,
        value: contract_address,
        type: 'address',
      });

      if (abis) {
        for (const abi of abis) {
          if (abi.type === 'function') {
            const inputs = abi.inputs.map((input) => input.type).join(',');
            const raw_signature = `${abi.name}(${inputs})` as `0x${string}`;
            const functionSelector = keccak256(raw_signature).slice(0, 10);

            if (functionSelector === contract_function) {
              // @ts-ignore
              function_signature = toFunctionSignature(abi);
              function_name = abi.name;

              break;
            }
          }
        }
      }

      if (contract_map) {
        for (const key in contract_map) {
          if (key.toLowerCase() === contract_id) {
            contract_name = contract_map[key].contract_name;

            break;
          }
        }
      }

      return {
        id: contract_id,
        chain_id,
        contract_address,
        contract_function,
        calldata,
        contract_name,
        function_name,
        explorer_url,
        function_signature,
      };
    });

    return {
      status: true,
      actions,
      message: 'Success',
      cause: null,
    };
  } catch (error: any) {
    return {
      status: false,
      actions: null,
      message: error.message ?? 'Unknown error',
      cause: error.cause ?? 'Unknown cause',
    };
  }
};
