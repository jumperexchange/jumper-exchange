import type { AbiFunction, Address } from 'abitype';

export type TypedAbiFunction = Pick<
  AbiFunction,
  'name' | 'inputs' | 'outputs' | 'type'
>;

export type MarketAction = {
  id: string;
  contract_address: string;
  contract_name?: string;
  contract_function: TypedAbiFunction;
  inputs: Array<{
    input_type: 'fixed' | 'dynamic';
    fixed_value?: string;
    dynamic_value?: {
      action_id: string;
      action_index: number;
      output_index: number;
    };
  }>;
};

export type MarketActions = Array<MarketAction>;
