import Grid from '@mui/material/Grid';
import { USD_CURRENCY_SYMBOL } from './constants';
import { ContributionButton } from './FeeContribution.style';
import { FeeContributionBaseProps } from './FeeContribution.types';

interface PredefinedOptionsProps extends FeeContributionBaseProps {
  options: number[];
}

export const PredefinedOptions: React.FC<PredefinedOptionsProps> = ({
  isDisabled,
  options,
  currentValue,
  isManualValueSelected,
  setCurrentValue,
  setIsManualValueSelected,
}) => {
  const handleButtonClick = (amount: number) => {
    if (isDisabled) return;

    if (isManualValueSelected) {
      setIsManualValueSelected(false);
    }

    setCurrentValue(amount.toString());
  };

  return options.map((option) => (
    <Grid key={option} size={{ xs: 2, sm: 3 }}>
      <ContributionButton
        selected={
          !!currentValue &&
          !isManualValueSelected &&
          Number(currentValue) === option
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
