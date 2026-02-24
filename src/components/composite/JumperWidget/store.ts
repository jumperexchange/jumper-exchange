import { createContext, useContext } from 'react';
import { useStore } from '@tanstack/react-form';
import {
  createStore,
  useStore as useZustandStore,
  type StoreApi,
} from 'zustand';
import { useFormContext, useWidgetNavigation } from './context';
import type { InferFieldValues, TypedFieldDefinition } from './types';

export interface WidgetUIStore {
  activeField: string | null;
  setActiveField: (key: string | null) => void;
}

export const WidgetStoreContext = createContext<StoreApi<WidgetUIStore> | null>(
  null,
);

export function useWidgetStoreInstance(): StoreApi<WidgetUIStore> {
  const store = useContext(WidgetStoreContext);
  if (!store) {
    throw new Error('Must be used inside a JumperWidget');
  }
  return store;
}

export function createWidgetStore(): StoreApi<WidgetUIStore> {
  return createStore<WidgetUIStore>((set) => ({
    activeField: null,
    setActiveField: (key) => set({ activeField: key }),
  }));
}

export function useWidgetStore<T>(
  selector: (state: { values: Record<string, unknown> }) => T,
): T {
  const form = useFormContext();
  return useStore(form.store, (s) =>
    selector({ values: s.values as Record<string, unknown> }),
  );
}

function normalizeFieldErrors(rawErrors: unknown[]): string[] {
  return rawErrors.map((err) =>
    err !== null &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
      ? (err as { message: string }).message
      : String(err),
  );
}

export function useField<T>(fieldKey: string) {
  const form = useFormContext();
  const uiStore = useWidgetStoreInstance();

  const value = useStore(form.store, (s) => s.values[fieldKey]) as
    | T
    | undefined;
  const rawErrors = useStore(
    form.store,
    (s) => (s.fieldMeta[fieldKey]?.errors ?? []) as unknown[],
  );
  const errors = normalizeFieldErrors(rawErrors);
  const isTouched = useStore(
    form.store,
    (s) => s.fieldMeta[fieldKey]?.isTouched ?? false,
  );
  const activeField = useZustandStore(uiStore, (s) => s.activeField);

  return {
    value: value as T,
    /**
     * Validation error strings. Previously `field.error` (ZodError);
     * now `field.errors` (string[]) — update call sites accordingly:
     *   Before: `field.error.issues[0].message`
     *   After:  `field.errors[0]`
     */
    errors,
    isValid: errors.length === 0,
    isActive: activeField === fieldKey,
    isTouched,
    setValue: (newValue: T) => {
      form.setFieldValue(fieldKey, newValue);
      // Mark as touched manually since we bypass native blur events
      form.setFieldMeta(fieldKey, (prev) => ({ ...prev, isTouched: true }));
    },
    openSidePanel: () => uiStore.getState().setActiveField(fieldKey),
    closeSidePanel: () => uiStore.getState().setActiveField(null),
  };
}

// ─── Form-level validation ────────────────────────────────────────────────────

export function useFormValidation() {
  const form = useFormContext();
  const canSubmit = useStore(form.store, (s) => s.canSubmit);
  const isTouched = useStore(form.store, (s) =>
    Object.values(s.fieldMeta).some(
      (m: unknown) => (m as { isTouched?: boolean })?.isTouched ?? false,
    ),
  );
  return { isValid: canSubmit, isTouched };
}

// ─── Submission ───────────────────────────────────────────────────────────────

export function useWidgetSubmit() {
  const { submit, isSubmitting, error, clearError } = useWidgetNavigation();
  return { submit, isSubmitting, error, clearError };
}

export function createTypedHooks<
  T extends Record<string, TypedFieldDefinition<unknown>>,
>(
  _fields: T,
): {
  useValues: () => InferFieldValues<T>;
  useValue: <K extends keyof T>(key: K) => InferFieldValues<T>[K];
} {
  return {
    useValues: () => useWidgetStore((s) => s.values) as InferFieldValues<T>,

    useValue: <K extends keyof T>(key: K) =>
      useWidgetStore((s) => s.values[key as string]) as InferFieldValues<T>[K],
  };
}
