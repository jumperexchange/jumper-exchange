import { createContext, useContext } from 'react';
import type { z } from 'zod';

export interface FieldMeta {
  schema: z.ZodType;
  defaultValue: unknown;
}

export type FieldMetaMap = Record<string, FieldMeta>;

export const FieldMetaContext = createContext<FieldMetaMap | null>(null);

export function useFieldMeta(fieldKey: string): FieldMeta {
  const map = useContext(FieldMetaContext);
  if (!map) {
    throw new Error('useField must be used inside a JumperWidget');
  }
  const meta = map[fieldKey];
  if (!meta) {
    throw new Error(`No field registered for key "${fieldKey}"`);
  }
  return meta;
}

export type FormSchema = z.ZodObject<Record<string, z.ZodTypeAny>>;

export const FormSchemaContext = createContext<FormSchema | null>(null);

export function useFormSchema(): FormSchema {
  const schema = useContext(FormSchemaContext);
  if (!schema) {
    throw new Error('useFormValidation must be used inside a JumperWidget');
  }
  return schema;
}

export interface NavigationContextValue {
  currentViewId: string;
  goToView: (id: string) => void;
  submit: () => void;
  isSubmitting: boolean;
  error: Error | null;
  clearError: () => void;
}

export const NavigationContext = createContext<NavigationContextValue | null>(
  null,
);

export function useWidgetNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useWidgetNavigation must be used inside a JumperWidget');
  }
  return ctx;
}
