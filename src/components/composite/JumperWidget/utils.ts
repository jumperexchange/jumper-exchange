import type { AmountValue } from './components/Amount';
import { Amount, amountSchema } from './components/Amount';
import type { BalancesMultiSelectValue } from './components/Balances';
import {
  BalancesMultiSelectField,
  balancesMultiSelectSchema,
  BalancesMultiSelectSidePanel,
} from './components/Balances';
import type { ChainSingleSelectValue } from './components/Chain';
import {
  ChainSingleSelectField,
  chainSingleSelectSchema,
  ChainSingleSelectSidePanel,
} from './components/Chain';
import type { DisplayTokenChainValue } from './components/DisplayTokenChain';
import {
  DisplayTokenChain,
  displayTokenChainSchema,
} from './components/DisplayTokenChain';
import type { NumericSelectValue } from './components/NumericSelect';
import {
  NumericSelectField,
  numericSelectSchema,
} from './components/NumericSelect';
import type {
  TokenMultiSelectValue,
  TokenSingleSelectValue,
} from './components/Token';
import {
  TokenMultiSelectField,
  tokenMultiSelectSchema,
  TokenMultiSelectSidePanel,
  TokenSingleSelectField,
  tokenSingleSelectSchema,
  TokenSingleSelectSidePanel,
} from './components/Token';
import type { FieldConfig } from './types';
import { defineField } from './types';

export const defineAmountField = (
  config: Omit<
    FieldConfig<AmountValue, React.ComponentProps<typeof Amount>, never>,
    'schema' | 'FieldComponent'
  > & {
    fieldKey?: string;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'amount',
    schema: amountSchema,
    FieldComponent: Amount,
  });

export const defineBalancesMultiSelectField = (
  config: Omit<
    FieldConfig<
      BalancesMultiSelectValue,
      React.ComponentProps<typeof BalancesMultiSelectField>,
      React.ComponentProps<typeof BalancesMultiSelectSidePanel>
    >,
    'schema' | 'FieldComponent' | 'SidePanelComponent'
  > & {
    fieldKey?: string;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'balances',
    schema: balancesMultiSelectSchema,
    FieldComponent: BalancesMultiSelectField,
    SidePanelComponent: BalancesMultiSelectSidePanel,
  });

export const defineChainSingleSelectField = (
  config: Omit<
    FieldConfig<
      ChainSingleSelectValue,
      React.ComponentProps<typeof ChainSingleSelectField>,
      React.ComponentProps<typeof ChainSingleSelectSidePanel>
    >,
    'schema' | 'FieldComponent' | 'SidePanelComponent'
  > & {
    fieldKey?: string;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'chain',
    schema: chainSingleSelectSchema,
    FieldComponent: ChainSingleSelectField,
    SidePanelComponent: ChainSingleSelectSidePanel,
  });

export const defineTokenSingleSelectField = (
  config: Omit<
    FieldConfig<
      TokenSingleSelectValue,
      React.ComponentProps<typeof TokenSingleSelectField>,
      React.ComponentProps<typeof TokenSingleSelectSidePanel>
    >,
    'schema' | 'FieldComponent' | 'SidePanelComponent'
  > & {
    fieldKey?: string;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'token',
    schema: tokenSingleSelectSchema,
    FieldComponent: TokenSingleSelectField,
    SidePanelComponent: TokenSingleSelectSidePanel,
  });

export const defineTokenMultiSelectField = (
  config: Omit<
    FieldConfig<
      TokenMultiSelectValue,
      React.ComponentProps<typeof TokenMultiSelectField>,
      React.ComponentProps<typeof TokenMultiSelectSidePanel>
    >,
    'schema' | 'FieldComponent' | 'SidePanelComponent'
  > & {
    fieldKey?: string;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'tokens',
    schema: tokenMultiSelectSchema,
    FieldComponent: TokenMultiSelectField,
    SidePanelComponent: TokenMultiSelectSidePanel,
  });

export const defineDisplayTokenChainField = (
  config: Omit<
    FieldConfig<
      DisplayTokenChainValue,
      React.ComponentProps<typeof DisplayTokenChain>,
      never
    >,
    'schema' | 'FieldComponent'
  > & {
    fieldKey?: string;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'token-chain',
    schema: displayTokenChainSchema,
    FieldComponent: DisplayTokenChain,
  });

export const defineNumericSelectField = (
  config: Omit<
    FieldConfig<
      NumericSelectValue,
      React.ComponentProps<typeof NumericSelectField>,
      never
    >,
    'schema' | 'FieldComponent'
  > & {
    fieldKey?: string;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'numeric-select',
    schema: numericSelectSchema,
    FieldComponent: NumericSelectField,
  });
