import { createContext, useContext } from 'react';

export interface LeverageContextValue {
  leverageFactor: number;
  debouncedLeverageFactor: number;
  maxLeverageFactor: number | undefined;
  onChange: (value: number) => void;
  isTransactionSubmitting: boolean;
}

export const LeverageContext = createContext<LeverageContextValue>({
  leverageFactor: 1,
  debouncedLeverageFactor: 1,
  maxLeverageFactor: undefined,
  onChange: () => {},
  isTransactionSubmitting: false,
});

export function useLeverageContext() {
  return useContext(LeverageContext);
}
