export interface FeeContributionBaseProps {
  setIsManualValueSelected: (isActive: boolean) => void;
  isManualValueSelected: boolean;
  isDisabled: boolean;
  currentValue: string;
  setCurrentValue: (amount: string) => void;
}
