import { TFunction } from 'i18next';
import { useCallback, useState } from 'react';
import { useContributionStore } from 'src/stores/contribution/ContributionStore';
import {
  ContributionCard,
  ContributionCardTitle,
  ContributionDescription,
  ContributionWrapper,
} from './FeeContribution.style';
import { FeeContributionCTA } from './FeeContributionCTA';
import { FeeContributionDrawer } from './FeeContributionDrawer';
import { useContributionData, useSendContribution } from './hooks';
import {
  ContributionAmountProvider,
  useContributionAmountContext,
} from 'src/providers/ContributionAmountProvider';
import { FeeAmountSelector } from './FeeAmountSelector';

export interface FeeContributionProps {
  translationFn: TFunction;
}

const InnerFeeContribution: React.FC<FeeContributionProps> = ({
  translationFn,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { contributed, contributionDisplayed } = useContributionStore((s) => s);
  const { maxUsdContribution, contributionOptions } = useContributionData();

  const { isManualValueSelected, amount } = useContributionAmountContext();

  const closeDrawer = useCallback(() => setIsOpen(false), []);
  const { sendContribution, isTransactionLoading } =
    useSendContribution(closeDrawer);

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

          <FeeAmountSelector
            isDisabled={contributed}
            translationFn={translationFn}
            maxUsdContribution={maxUsdContribution}
            contributionOptions={contributionOptions}
          />

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

const FeeContribution: React.FC<FeeContributionProps> = ({ translationFn }) => {
  return (
    <ContributionAmountProvider>
      <InnerFeeContribution translationFn={translationFn} />
    </ContributionAmountProvider>
  );
};

export default FeeContribution;
