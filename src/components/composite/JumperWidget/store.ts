import { createContext, useContext } from 'react';
import { createStore, useStore, type StoreApi } from 'zustand';
import type { z } from 'zod';
import { useFieldMeta, useFormSchema, useWidgetNavigation } from './context';

export interface WidgetStore {
  values: Record<string, unknown>;
  activeField: string | null;
  setValue: (key: string, value: unknown) => void;
  setValues: (updates: Record<string, unknown>) => void;
  getValue: (key: string) => unknown;
  setActiveField: (key: string | null) => void;
}

export const WidgetStoreContext = createContext<StoreApi<WidgetStore> | null>(
  null,
);

export function useWidgetStoreInstance(): StoreApi<WidgetStore> {
  const store = useContext(WidgetStoreContext);
  if (!store) {
    throw new Error('Must be used inside a JumperWidget');
  }
  return store;
}

export function createWidgetStore(): StoreApi<WidgetStore> {
  return createStore<WidgetStore>((set, get) => ({
    values: {},
    activeField: null,
    setValue: (key, value) =>
      set((s) => ({ values: { ...s.values, [key]: value } })),
    setValues: (updates) =>
      set((s) => ({ values: { ...s.values, ...updates } })),
    getValue: (key) => get().values[key],
    setActiveField: (key) => set({ activeField: key }),
  }));
}

export function useWidgetStore<T>(selector: (state: WidgetStore) => T): T {
  return useStore(useWidgetStoreInstance(), selector);
}

export function useField<T>(fieldKey: string) {
  const { schema, defaultValue } = useFieldMeta(fieldKey);
  const store = useWidgetStoreInstance();

  const storedValue = useStore(store, (s) => s.values[fieldKey]);
  const activeField = useStore(store, (s) => s.activeField);

  // @TODO: maybe merge these
  const raw = storedValue ?? defaultValue;
  const parsed = (schema as z.ZodType<T>).safeParse(raw);
  const value = parsed.success ? (parsed.data as T) : undefined;

  return {
    value,
    isValid: parsed.success,
    isActive: activeField === fieldKey,
    setValue: (newValue: T) => store.getState().setValue(fieldKey, newValue),
    openSidePanel: () => store.getState().setActiveField(fieldKey),
    closeSidePanel: () => store.getState().setActiveField(null),
  };
}

export function useFormValidation() {
  const formSchema = useFormSchema();
  const values = useWidgetStore((s) => s.values);
  const result = formSchema.safeParse(values);
  return {
    isValid: result.success,
    errors: result.success ? null : result.error.flatten().fieldErrors,
  };
}

export function useWidgetSubmit() {
  const { submit, isSubmitting, error, clearError } = useWidgetNavigation();
  return { submit, isSubmitting, error, clearError };
}
