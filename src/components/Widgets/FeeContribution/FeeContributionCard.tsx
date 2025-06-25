import { Grid } from '@mui/material';
import { CustomInput } from './CustomInput';
import { ContributionTranslations } from './FeeContribution';
import {
  ContributionCard,
  ContributionCardTitle,
  ContributionDescription,
} from './FeeContribution.style';
import { FeeContributionCTA } from './FeeContributionCTA';
import { PredefinedButtons } from './PredefinedButtons';

export interface FeeContributionCardProps {
  translations: ContributionTranslations;
  contributionOptions: number[];
  customAmount: string;
  predefinedAmount: string;
  contributed: boolean;
  isTransactionLoading: boolean;
  maxUsdAmount: number;
  isCustomAmountActive: boolean;
  setCustomAmount: (amount: string) => void;
  setPredefinedAmount: (amount: string) => void;
  setIsCustomAmountActive: (isCustomAmountActive: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const FeeContributionCard: React.FC<FeeContributionCardProps> = ({
  translations,
  contributionOptions,
  customAmount,
  predefinedAmount,
  contributed,
  isTransactionLoading,
  maxUsdAmount,
  isCustomAmountActive,
  setCustomAmount,
  setPredefinedAmount,
  setIsCustomAmountActive,
  onConfirm,
}) => {
  return (
    <ContributionCard>
      <ContributionCardTitle>{translations.title}</ContributionCardTitle>
      <Grid
        container
        spacing={2}
        columnSpacing={1}
        justifyContent={'space-between'}
      >
        <PredefinedButtons
          predefinedAmount={predefinedAmount}
          contributed={contributed}
          setPredefinedAmount={setPredefinedAmount}
          isCustomAmountActive={isCustomAmountActive}
          setIsCustomAmountActive={setIsCustomAmountActive}
          contributionOptions={contributionOptions}
        />
        <CustomInput
          contributed={contributed}
          setIsCustomAmountActive={setIsCustomAmountActive}
          maxUsdAmount={maxUsdAmount}
          setCustomAmount={setCustomAmount}
          customAmount={customAmount}
          translations={translations}
          isCustomAmountActive={isCustomAmountActive}
        />
      </Grid>

      {!!(customAmount || predefinedAmount) || contributed ? (
        <FeeContributionCTA
          translations={translations}
          contributed={contributed}
          isTransactionLoading={isTransactionLoading}
          onConfirm={onConfirm}
        />
      ) : (
        <ContributionDescription>
          {translations.description}
        </ContributionDescription>
      )}
    </ContributionCard>
  );
};
