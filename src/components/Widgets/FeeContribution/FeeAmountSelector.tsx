import { CustomInput } from './CustomInput';
import { PredefinedOptions } from './PredefinedOptions';
import { useContributionAmountContext } from 'src/providers/ContributionAmountProvider';
import type { FC } from 'react';
import type { TFunction } from 'i18next';
import Grid from '@mui/material/Grid';

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
      sx={{
        justifyContent: 'space-between',
      }}
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
