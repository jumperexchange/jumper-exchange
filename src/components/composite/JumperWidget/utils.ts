import z from 'zod';
import type { AmountValue, AmountSchemaOptions } from './components/Amount';
import { Amount, createAmountSchema } from './components/Amount';
import type {
  BalancesMultiSelectSchemaOptions,
  BalancesMultiSelectValue,
} from './components/Balances';
import {
  BalancesMultiSelectField,
  BalancesMultiSelectSidePanel,
  createBalancesMultiSelectSchema,
} from './components/Balances';
import type {
  ChainSingleSelectValue,
  ChainSingleSelectSchemaOptions,
} from './components/Chain';
import {
  ChainSingleSelectField,
  createChainSingleSelectSchema,
  ChainSingleSelectSidePanel,
} from './components/Chain';
import type {
  DisplayTokenChainValue,
  DisplayTokenChainSchemaOptions,
} from './components/DisplayTokenChain';
import {
  DisplayTokenChain,
  createDisplayTokenChainSchema,
} from './components/DisplayTokenChain';
import type {
  NumericSelectValue,
  NumericSelectSchemaOptions,
} from './components/NumericSelect';
import {
  NumericSelectField,
  createNumericSelectSchema,
} from './components/NumericSelect';
import type {
  TokenMultiSelectValue,
  TokenSingleSelectValue,
  TokenSingleSelectSchemaOptions,
  TokenMultiSelectSchemaOptions,
} from './components/Token';
import {
  TokenMultiSelectField,
  createTokenMultiSelectSchema,
  TokenMultiSelectSidePanel,
  TokenSingleSelectField,
  createTokenSingleSelectSchema,
  TokenSingleSelectSidePanel,
} from './components/Token';
import type {
  AnyFieldDefinition,
  BaseFieldProps,
  FieldConfig,
  SanitizeListener,
  TypedFieldDefinition,
} from './types';
import { DisplayAmount } from './components/DisplayAmount';
import { createElement } from 'react';
import type { TFunction } from 'i18next';

/**
 * Creates a typed field definition from a config object.
 * Returns `TypedFieldDefinition<TValue>` so the value type is preserved for
 * use with `createTypedHooks` and `InferFieldValues`.
 */
export function defineField<
  TValue,
  TFieldProps extends BaseFieldProps,
  TSidePanelProps extends BaseFieldProps,
>(
  config: FieldConfig<TValue, TFieldProps, TSidePanelProps>,
): TypedFieldDefinition<TValue> {
  const {
    fieldKey,
    schema,
    defaultValue,
    fieldProps,
    sidePanelProps,
    deriveProps,
    sanitizeOn,
    sanitizeOnMount,
    FieldComponent,
    SidePanelComponent,
  } = config;

  return {
    fieldKey,
    schema,
    defaultValue,
    sanitizeOn: sanitizeOn as SanitizeListener<unknown>[] | undefined,
    sanitizeOnMount,
    deriveProps,
    renderField: (derivedProps) =>
      createElement(FieldComponent, {
        ...(fieldProps as TFieldProps),
        ...(derivedProps as Partial<TFieldProps>),
        fieldKey,
      }),
    renderSidePanel: SidePanelComponent
      ? (derivedProps) =>
          createElement(SidePanelComponent, {
            ...(sidePanelProps as TSidePanelProps),
            ...(derivedProps as Partial<TSidePanelProps>),
            fieldKey,
          })
      : undefined,
  } as TypedFieldDefinition<TValue>;
}

export const defineAmountField = (
  config: Omit<
    FieldConfig<AmountValue, React.ComponentProps<typeof Amount>, never>,
    'schema' | 'FieldComponent' | 'fieldKey'
  > & {
    fieldKey?: string;
    schemaOptions?: AmountSchemaOptions;
    t: TFunction;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'amount',
    schema: createAmountSchema(config.t, config.schemaOptions),
    FieldComponent: Amount,
  });

export const defineBalancesMultiSelectField = (
  config: Omit<
    FieldConfig<
      BalancesMultiSelectValue,
      React.ComponentProps<typeof BalancesMultiSelectField>,
      React.ComponentProps<typeof BalancesMultiSelectSidePanel>
    >,
    'schema' | 'FieldComponent' | 'SidePanelComponent' | 'fieldKey'
  > & {
    fieldKey?: string;
    schemaOptions?: BalancesMultiSelectSchemaOptions;
    t: TFunction;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'balances',
    schema: createBalancesMultiSelectSchema(config.t, config.schemaOptions),
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
    'schema' | 'FieldComponent' | 'SidePanelComponent' | 'fieldKey'
  > & {
    fieldKey?: string;
    schemaOptions?: ChainSingleSelectSchemaOptions;
    t: TFunction;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'chain',
    schema: createChainSingleSelectSchema(config.t, config.schemaOptions),
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
    'schema' | 'FieldComponent' | 'SidePanelComponent' | 'fieldKey'
  > & {
    fieldKey?: string;
    schemaOptions?: TokenSingleSelectSchemaOptions;
    t: TFunction;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'token',
    schema: createTokenSingleSelectSchema(config.t, config.schemaOptions),
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
    'schema' | 'FieldComponent' | 'SidePanelComponent' | 'fieldKey'
  > & {
    fieldKey?: string;
    schemaOptions?: TokenMultiSelectSchemaOptions;
    t: TFunction;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'tokens',
    schema: createTokenMultiSelectSchema(config.t, config.schemaOptions),
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
    'schema' | 'FieldComponent' | 'fieldKey'
  > & {
    fieldKey?: string;
    schemaOptions?: DisplayTokenChainSchemaOptions;
    t: TFunction;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'token-chain',
    schema: createDisplayTokenChainSchema(config.t, config.schemaOptions),
    FieldComponent: DisplayTokenChain,
  });

export const defineNumericSelectField = (
  config: Omit<
    FieldConfig<
      NumericSelectValue,
      React.ComponentProps<typeof NumericSelectField>,
      never
    >,
    'schema' | 'FieldComponent' | 'fieldKey'
  > & {
    fieldKey?: string;
    schemaOptions?: NumericSelectSchemaOptions;
    t: TFunction;
  },
) =>
  defineField({
    ...config,
    fieldKey: config.fieldKey ?? 'numeric-select',
    schema: createNumericSelectSchema(config.t, config.schemaOptions),
    FieldComponent: NumericSelectField,
  });

export const defineDisplayAmountField = (
  config: Omit<
    FieldConfig<undefined, React.ComponentProps<typeof DisplayAmount>, never>,
    'schema' | 'FieldComponent' | 'fieldKey'
  > & {
    fieldKey?: string;
  },
) =>
  defineField({
    ...config,
    schema: z.undefined(),
    fieldKey: config.fieldKey ?? 'display-amount',
    FieldComponent: DisplayAmount,
  });

export interface ComputedFieldConfig<TValue = unknown> {
  fieldKey: string;
  /**
   * Field keys this computation depends on.
   * The field will recompute whenever any dependency changes, and once on
   * mount to establish the initial value.
   */
  dependencies?: string[];
  compute: (getValue: (key: string) => unknown) => TValue;
  schema?: z.ZodType<TValue>;
}

/**
 * Defines a field whose value is entirely derived from other fields.
 * Renders nothing; consumers read the value via `useWidgetStore(s => s.values.key)`.
 */
export const defineComputedField = <TValue = unknown>(
  config: ComputedFieldConfig<TValue>,
): AnyFieldDefinition => {
  const { fieldKey, compute, schema = z.any(), dependencies = [] } = config;

  return {
    fieldKey,
    schema,
    defaultValue: undefined,
    deriveProps: undefined,
    sanitizeOn: dependencies.map((watchKey) => ({
      watchKey,
      sanitize: ({ getValue }) => compute(getValue) as unknown,
    })),
    sanitizeOnMount: true,
    renderField: () => null,
    renderSidePanel: undefined,
  };
};

/**
 * Converts a field's `sanitizeOn` config into TanStack Form listener props.
 *
 * Each listener in `sanitizeOn` contributes a watch key. When any watched key
 * changes (or on mount when `runOnMount` is true), all sanitizers run in order.
 * Only calls `fieldApi.setValue` when the result actually differs from the
 * current value, preventing unnecessary renders and loop convergence in ≤2 calls.
 */
export const buildFieldListeners = (
  sanitizeOn: SanitizeListener<unknown>[] | undefined,
  runOnMount?: boolean,
) => {
  if (!sanitizeOn?.length) {
    return undefined;
  }

  const handler = ({
    value,
    fieldApi,
  }: {
    value: unknown;
    fieldApi: {
      form: { getFieldValue: (key: string) => unknown };
      setValue: (v: unknown) => void;
    };
  }) => {
    let current = value;
    for (const listener of sanitizeOn) {
      const next = listener.sanitize({
        currentValue: current,
        getValue: (key) => fieldApi.form.getFieldValue(key),
      });
      if (next !== current) {
        current = next;
      }
    }
    if (current !== value) {
      fieldApi.setValue(current);
    }
  };

  return {
    onChangeListenTo: sanitizeOn.map((s) => s.watchKey),
    onChange: handler,
    ...(runOnMount ? { onMount: handler } : {}),
  };
};
