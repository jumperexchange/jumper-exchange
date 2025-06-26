import Grid from '@mui/material/Grid';
import { USD_CURRENCY_SYMBOL } from './constants';
import { ContributionButton } from './FeeContribution.style';

interface PredefinedButtonsProps {
  contributionOptions: number[];
  currentValue: string;
  isCustomAmountActive: boolean;
  contributed: boolean;
  setCurrentValue: (amount: string) => void;
  setIsCustomAmountActive: (isActive: boolean) => void;
}

export const PredefinedButtons: React.FC<PredefinedButtonsProps> = ({
  contributed,
  contributionOptions,
  currentValue,
  isCustomAmountActive,
  setCurrentValue,
  setIsCustomAmountActive,
}) => {
  const handleButtonClick = (amount: number) => {
    if (contributed) return;
    if (currentValue === amount.toString()) {
      setCurrentValue('');
      return;
    }
    setIsCustomAmountActive(false);
    setCurrentValue(amount.toString());
  };

  return contributionOptions.map((contributionAmount) => (
    <Grid size={3} key={contributionAmount}>
      <ContributionButton
        selected={
          !!currentValue &&
          !isCustomAmountActive &&
          Number(currentValue) === contributionAmount
        }
        onClick={() => handleButtonClick(contributionAmount)}
        size="small"
      >
        {USD_CURRENCY_SYMBOL}
        {contributionAmount}
      </ContributionButton>
    </Grid>
  ));
};
