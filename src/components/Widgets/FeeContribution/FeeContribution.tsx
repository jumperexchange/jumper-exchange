import Grid from '@mui/material/Grid';
import { TFunction } from 'i18next';
import { useCallback, useMemo, useState } from 'react';
import { useContributionStore } from 'src/stores/contribution/ContributionStore';
import { CustomInput } from './CustomInput';
import {
  ContributionCard,
  ContributionCardTitle,
  ContributionDescription,
  ContributionWrapper,
} from './FeeContribution.style';
import { FeeContributionCTA } from './FeeContributionCTA';
import { FeeContributionDrawer } from './FeeContributionDrawer';
import { PredefinedOptions } from './PredefinedOptions';
import {
  useContributionData,
  useSendContribution,
  useContributionAmounts,
} from './hooks';

export interface FeeContributionProps {
  translationFn: TFunction;
}

const FeeContribution: React.FC<FeeContributionProps> = ({ translationFn }) => {
  const [isOpen, setIsOpen] = useState(true);

  const { contributed, contributionDisplayed } = useContributionStore(
    (state) => state,
  );

  const {
    amount,
    manualAmount,
    setManualAmount,
    predefinedAmount,
    setPredefinedAmount,
    isManualValueSelected,
    setIsManualValueSelected,
  } = useContributionAmounts();

  const closeContributionDrawer = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const { sendContribution, isTransactionLoading } = useSendContribution(
    amount,
    closeContributionDrawer,
  );

  const { maxUsdContribution, contributionOptions } = useContributionData();

  if (!contributionDisplayed) {
    return null;
  }

  const shouldShowCTA = !!amount || isManualValueSelected || contributed;

  return (
    <ContributionWrapper showContribution={isOpen}>
      <FeeContributionDrawer isOpen={isOpen}>
        <ContributionCard>
          <ContributionCardTitle>
            {translationFn('contribution.title')}
          </ContributionCardTitle>
          <Grid
            container
            spacing={2}
            columnSpacing={1}
            justifyContent={'space-between'}
          >
            <PredefinedOptions
              isDisabled={contributed}
              options={contributionOptions}
              currentValue={predefinedAmount}
              isManualValueSelected={isManualValueSelected}
              setCurrentValue={setPredefinedAmount}
              setIsManualValueSelected={setIsManualValueSelected}
            />
            <CustomInput
              isDisabled={contributed}
              setIsManualValueSelected={setIsManualValueSelected}
              maxValue={maxUsdContribution}
              placeholder={translationFn('contribution.custom')}
              setCurrentValue={setManualAmount}
              currentValue={manualAmount}
              isManualValueSelected={isManualValueSelected}
            />
          </Grid>

          {shouldShowCTA ? (
            <FeeContributionCTA
              contributed={contributed}
              isTransactionLoading={isTransactionLoading}
              handleClick={sendContribution}
              translationFn={translationFn}
            />
          ) : (
            <ContributionDescription>
              {translationFn('contribution.description')}
            </ContributionDescription>
          )}
        </ContributionCard>
      </FeeContributionDrawer>
    </ContributionWrapper>
  );
};

export default FeeContribution;
