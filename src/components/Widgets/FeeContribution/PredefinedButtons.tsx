import Grid from '@mui/material/Grid';
import { USD_CURRENCY_SYMBOL } from './constants';
import { ContributionButton } from './FeeContribution.style';
import { ContributionBaseProps } from './FeeContribution.types';

interface PredefinedButtonsProps extends ContributionBaseProps {
  options: number[];
}

export const PredefinedButtons: React.FC<PredefinedButtonsProps> = ({
  isDisabled,
  options,
  currentValue,
  isManualValue,
  setCurrentValue,
  setIsManualValue,
}) => {
  const handleButtonClick = (amount: number) => {
    if (isDisabled) return;

    if (isManualValue) {
      setIsManualValue(false);
    }

    setCurrentValue(amount.toString());
  };

  return options.map((option) => (
    <Grid size={3} key={option}>
      <ContributionButton
        selected={
          !!currentValue && !isManualValue && Number(currentValue) === option
        }
        onClick={() => handleButtonClick(option)}
        size="small"
      >
        {USD_CURRENCY_SYMBOL}
        {option}
      </ContributionButton>
    </Grid>
  ));
};
