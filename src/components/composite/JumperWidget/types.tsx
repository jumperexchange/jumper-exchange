import type { ComponentType, ReactElement, ReactNode } from 'react';
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

export interface JumperWidgetStatusSheetProp {
  isOpen: boolean;
  content: StatusSheetContent;
  onClose: () => void;
  children?: ReactNode;
}

export interface BaseFieldProps {
  fieldKey: string;
  label?: string;
  placeholder?: string;
  header?: string;
}

export interface AnyFieldDefinition {
  fieldKey: string;
  schema: z.ZodType;
  defaultValue: unknown;
  deriveProps: (getValue: (key: string) => unknown) => {
    fieldProps: unknown;
    sidePanelProps: unknown;
  };
  sanitizeValue: (
    currentValue: unknown,
    derivedProps: { fieldProps: unknown; sidePanelProps: unknown },
  ) => unknown;
  renderField: (derivedFieldProps: unknown) => ReactElement;
  renderSidePanel:
    | ((derivedSidePanelProps: unknown) => ReactElement)
    | undefined;
}

export interface FieldConfig<
  TValue,
  TFP extends BaseFieldProps,
  TSP extends BaseFieldProps = TFP,
> {
  fieldKey: string;
  schema: z.ZodType<TValue>;
  defaultValue?: TValue;
  dependencies?: string[];
  FieldComponent: ComponentType<TFP>;
  SidePanelComponent?: ComponentType<TSP>;
  fieldProps: Omit<TFP, 'fieldKey'>;
  sidePanelProps?: Omit<TSP, 'fieldKey'>;
  deriveProps?: (getValue: (key: string) => unknown) => {
    fieldProps?: Partial<Omit<TFP, 'fieldKey'>>;
    sidePanelProps?: Partial<Omit<TSP, 'fieldKey'>>;
  };
  sanitizeValue?: (
    currentValue: TValue | undefined,
    derivedProps: {
      fieldProps: Omit<TFP, 'fieldKey'>;
      sidePanelProps: Omit<TSP, 'fieldKey'>;
    },
  ) => TValue | undefined;
}

export function defineField<
  TValue,
  TFP extends BaseFieldProps,
  TSP extends BaseFieldProps = TFP,
>(config: FieldConfig<TValue, TFP, TSP>): AnyFieldDefinition {
  return {
    fieldKey: config.fieldKey,
    schema: config.schema,
    defaultValue: config.defaultValue,

    deriveProps: (getValue) => {
      const derived = config.deriveProps?.(getValue) ?? {};
      return {
        fieldProps: { ...config.fieldProps, ...(derived.fieldProps ?? {}) },
        sidePanelProps: {
          ...(config.sidePanelProps ?? {}),
          ...(derived.sidePanelProps ?? {}),
        },
      };
    },

    sanitizeValue: (currentValue, derivedProps) => {
      if (!config.sanitizeValue) {
        return currentValue;
      }
      return config.sanitizeValue(
        currentValue as TValue | undefined,
        derivedProps as {
          fieldProps: Omit<TFP, 'fieldKey'>;
          sidePanelProps: Omit<TSP, 'fieldKey'>;
        },
      );
    },

    renderField: (derivedFieldProps) => {
      const Field = config.FieldComponent;
      return (
        <Field
          {...({
            fieldKey: config.fieldKey,
            ...(derivedFieldProps as object),
          } as TFP)}
        />
      );
    },

    renderSidePanel: config.SidePanelComponent
      ? (derivedSidePanelProps) => {
          const SidePanel = config.SidePanelComponent!;
          return (
            <SidePanel
              {...({
                fieldKey: config.fieldKey,
                ...(derivedSidePanelProps as object),
              } as TSP)}
            />
          );
        }
      : undefined,
  };
}

export interface ViewSubmitContext {
  goToView: (id: string) => void;
  values: Record<string, unknown>;
}

interface BaseView {
  id: string;
  title?: string;
  actions?: ReactNode;
  onSubmit?: (context: ViewSubmitContext) => Promise<void>;
}

export interface FormView extends BaseView {
  type: 'form';
  content?: ReactNode;
  fields: AnyFieldDefinition[];
}

export interface CustomView extends BaseView {
  type: 'custom';
  content: ReactNode;
}

export type WidgetView = FormView | CustomView;
