import { createElement, type ReactNode } from 'react';
import type { z } from 'zod';
import type { StatusBottomSheetProps } from '@/components/composite/StatusBottomSheet/StatusBottomSheet';

export type StatusSheetContent = Pick<
  StatusBottomSheetProps,
  | 'title'
  | 'description'
  | 'callToAction'
  | 'callToActionType'
  | 'secondaryCallToAction'
  | 'status'
  | 'onClick'
  | 'onSecondaryClick'
>;
export interface BaseFieldProps {
  fieldKey: string;
  label?: string;
}

export interface SanitizeListener<TValue> {
  watchKey: string;
  sanitize: (args: {
    currentValue: TValue | undefined;
    getValue: (key: string) => unknown;
  }) => TValue | undefined;
}

export interface FieldConfig<TValue, TFieldProps, TSidePanelProps> {
  fieldKey: string;
  schema: z.ZodType<TValue>;
  defaultValue?: TValue;
  fieldProps: Partial<TFieldProps>;
  sidePanelProps?: Partial<TSidePanelProps>;
  deriveProps?: (getValue: (key: string) => unknown) => {
    fieldProps?: Partial<TFieldProps>;
    sidePanelProps?: Partial<TSidePanelProps>;
  };
  sanitizeOn?: SanitizeListener<TValue>[];
  sanitizeOnMount?: boolean;
  FieldComponent: React.ComponentType<TFieldProps & BaseFieldProps>;
  SidePanelComponent?: React.ComponentType<TSidePanelProps & BaseFieldProps>;
}

export type AnyFieldDefinition = {
  fieldKey: string;
  schema: z.ZodType;
  defaultValue?: unknown;
  sanitizeOn?: SanitizeListener<unknown>[];
  sanitizeOnMount?: boolean;
  deriveProps?: (getValue: (key: string) => unknown) => {
    fieldProps?: Record<string, unknown>;
    sidePanelProps?: Record<string, unknown>;
  };
  renderField: (derivedProps?: Record<string, unknown>) => ReactNode;
  renderSidePanel?: (derivedProps?: Record<string, unknown>) => ReactNode;
};

declare const __valueType: unique symbol;

/**
 * A field definition that carries `TValue` as a phantom type brand.
 *
 * The `__valueType` symbol is never written at runtime — it exists solely to
 * let TypeScript propagate the field's value type through a
 * `Record<string, TypedFieldDefinition<unknown>>` so that `InferFieldValues`
 * can reconstruct the full values map without any manual type-casting.
 *
 * Because `TypedFieldDefinition<TValue>` extends `AnyFieldDefinition`, typed
 * definitions are assignable to `AnyFieldDefinition[]` view field arrays.
 */
export type TypedFieldDefinition<TValue> = AnyFieldDefinition & {
  readonly [__valueType]: TValue;
};

/**
 * Derives the typed values map from a record of `TypedFieldDefinition`s.
 * Each key maps to `TValue | undefined` (fields may not yet have a value).
 *
 * @example
 * const fields = {
 *   chain: defineChainSingleSelectField(...),
 *   amount: defineAmountField(...),
 * };
 * type Values = InferFieldValues<typeof fields>;
 * // { chain: ChainSingleSelectValue | undefined; amount: AmountValue | undefined }
 */
export type InferFieldValues<
  T extends Record<string, TypedFieldDefinition<unknown>>,
> = {
  [K in keyof T]: T[K] extends TypedFieldDefinition<infer V>
    ? V | undefined
    : never;
};

export interface ViewSubmitContext {
  goToView: (id: string) => void;
  values: Record<string, unknown>;
}

interface BaseView {
  id: string;
  title?: string;
  content?: ReactNode;
  actions?: ReactNode;
  onSubmit?: (args: ViewSubmitContext) => Promise<void>;
}

export interface FormView extends BaseView {
  type: 'form';
  fields: AnyFieldDefinition[];
}

export interface CustomView extends BaseView {
  type: 'custom';
}

export type WidgetView = FormView | CustomView;

export interface JumperWidgetStatusSheetProp {
  isOpen: boolean;
  content: StatusSheetContent;
  onClose: () => void;
  children?: ReactNode;
}
