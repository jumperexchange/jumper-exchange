import { Grid } from '@mui/system';
import { CustomInput } from './CustomInput';
import { PredefinedOptions } from './PredefinedOptions';
import { useContributionAmountContext } from 'src/providers/ContributionAmountProvider';
import { FC } from 'react';
import { TFunction } from 'i18next';

interface FeeAmountSelectorProps {
  isDisabled: boolean;
  maxUsdContribution: number;
  contributionOptions: number[];
  translationFn: TFunction;
}

export const FeeAmountSelector: FC<FeeAmountSelectorProps> = ({
  isDisabled,
  maxUsdContribution,
  contributionOptions,
  translationFn,
}) => {
  const {
    manualAmount,
    setManualAmount,
    predefinedAmount,
    setPredefinedAmount,
    isManualValueSelected,
    setIsManualValueSelected,
  } = useContributionAmountContext();

  return (
    <Grid
      container
      spacing={2}
      columnSpacing={1}
      justifyContent={'space-between'}
    >
      <PredefinedOptions
        isDisabled={isDisabled}
        options={contributionOptions}
        currentValue={predefinedAmount}
        isManualValueSelected={isManualValueSelected}
        setCurrentValue={setPredefinedAmount}
        setIsManualValueSelected={setIsManualValueSelected}
      />
      <CustomInput
        isDisabled={isDisabled}
        setIsManualValueSelected={setIsManualValueSelected}
        maxValue={maxUsdContribution}
        placeholder={translationFn('contribution.custom')}
        setCurrentValue={setManualAmount}
        currentValue={manualAmount}
        isManualValueSelected={isManualValueSelected}
      />
    </Grid>
  );
};
