import {
  createContext,
  useContext,
  useMemo,
  useState,
  FC,
  PropsWithChildren,
} from 'react';

export interface ContributionAmountState {
  amount: string;
  manualAmount: string;
  setManualAmount: (val: string) => void;
  predefinedAmount: string;
  setPredefinedAmount: (val: string) => void;
  isManualValueSelected: boolean;
  setIsManualValueSelected: (val: boolean) => void;
}

export const ContributionAmountContext =
  createContext<ContributionAmountState | null>(null);

export const useContributionAmountContext = () => {
  const context = useContext(ContributionAmountContext);
  if (!context) {
    throw new Error(
      'ContributionAmountContext must be used within its provider',
    );
  }
  return context;
};

export const ContributionAmountProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [manualAmount, setManualAmount] = useState('');
  const [predefinedAmount, setPredefinedAmount] = useState('');
  const [isManualValueSelected, setIsManualValueSelected] = useState(false);

  const amount = useMemo(
    () => (isManualValueSelected ? manualAmount : predefinedAmount),
    [manualAmount, predefinedAmount, isManualValueSelected],
  );

  const value = useMemo(
    () => ({
      amount,
      manualAmount,
      setManualAmount,
      predefinedAmount,
      setPredefinedAmount,
      isManualValueSelected,
      setIsManualValueSelected,
    }),
    [amount, manualAmount, predefinedAmount, isManualValueSelected],
  );

  return (
    <ContributionAmountContext.Provider value={value}>
      {children}
    </ContributionAmountContext.Provider>
  );
};
