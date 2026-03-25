import { createContext, useContext } from 'react';
import type {
  ReactFormExtendedApi,
  FormValidateOrFn,
  FormAsyncValidateOrFn,
} from '@tanstack/react-form';
import { useForm } from '@tanstack/react-form';

export type WidgetFormValues = Record<string, unknown>;

export type WidgetFormApi<T extends WidgetFormValues = WidgetFormValues> =
  ReactFormExtendedApi<
    T,
    FormValidateOrFn<T> | undefined,
    FormValidateOrFn<T> | undefined,
    FormAsyncValidateOrFn<T> | undefined,
    FormValidateOrFn<T> | undefined,
    FormAsyncValidateOrFn<T> | undefined,
    FormValidateOrFn<T> | undefined,
    FormAsyncValidateOrFn<T> | undefined,
    FormValidateOrFn<T> | undefined,
    FormAsyncValidateOrFn<T> | undefined,
    FormAsyncValidateOrFn<T> | undefined,
    unknown
  >;

export const FormContext = createContext<WidgetFormApi | null>(null);

export function useFormContext(): WidgetFormApi {
  const form = useContext(FormContext);
  if (!form) {
    throw new Error('useFormContext must be used inside a JumperWidget');
  }
  return form;
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
