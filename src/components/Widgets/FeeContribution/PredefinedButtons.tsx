import Grid from '@mui/material/Grid';
import { USD_CURRENCY_SYMBOL } from './constants';
import { FeeContributionCardProps } from './FeeContribution';
import { ContributionButton } from './FeeContribution.style';

export interface PredefinedButtonsProps
  extends Pick<
    FeeContributionCardProps,
    | 'contributionOptions'
    | 'predefinedAmount'
    | 'setPredefinedAmount'
    | 'isCustomAmountActive'
    | 'setIsCustomAmountActive'
    | 'contributed'
  > {}

export const PredefinedButtons: React.FC<PredefinedButtonsProps> = ({
  contributionOptions,
  predefinedAmount,
  setPredefinedAmount,
  isCustomAmountActive,
  setIsCustomAmountActive,
  contributed,
}) => {
  const handleButtonClick = (amount: number) => {
    if (contributed) return;

    setIsCustomAmountActive(false);
    setPredefinedAmount(amount.toString());
  };

  return contributionOptions.map((contributionAmount) => (
    <Grid size={3} key={contributionAmount}>
      <ContributionButton
        selected={
          !!predefinedAmount &&
          !isCustomAmountActive &&
          Number(predefinedAmount) === contributionAmount
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
