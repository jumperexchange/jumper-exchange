export interface ContributionBaseProps {
  setIsManualValue: (isActive: boolean) => void;
  isManualValue: boolean;
  isDisabled: boolean;
  currentValue: string;
  setCurrentValue: (amount: string) => void;
}
