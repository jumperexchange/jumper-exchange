import CheckIcon from '@mui/icons-material/Check';
import { CircularProgress, Grid } from '@mui/material';
import { CustomInput } from './CustomInput';
import { ContributionTranslations } from './FeeContribution';
import {
  ContributionButtonConfirm,
  ContributionCard,
  ContributionCardTitle,
  ContributionDescription,
} from './FeeContribution.style';
import { PredefinedButtons } from './PredefinedButtons';
import { formatInputAmount, NO_DECIMAL_PLACES } from './utils';

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
  onClose,
  onConfirm,
}) => {
  // Handle input changes
  function onChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    if (contributed) return;

    setIsCustomAmountActive(true);

    const { value } = event.target;

    const formattedAmount = formatInputAmount(value, NO_DECIMAL_PLACES);
    if (formattedAmount && Number(formattedAmount) > maxUsdAmount) {
      // @TODO: maybe we'll want to not restrict the user as in what value he can type
      // but show a tooltip/error message and/or disable the Confirm button if there are not enough funds
      setCustomAmount(maxUsdAmount.toString());
    } else {
      setCustomAmount(formattedAmount);
    }
  }

  const handleCustomClick = () => {
    if (contributed) return;

    setIsCustomAmountActive(true);

    if (customAmount && Number(customAmount) > 0) {
      setCustomAmount(customAmount);
    }
  };

  const handleCustomBlur = () => {
    setIsCustomAmountActive(false);
  };

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
        <ContributionButtonConfirm
          onClick={onConfirm}
          isTxConfirmed={contributed}
          disabled={isTransactionLoading && !contributed}
        >
          {contributed ? <CheckIcon /> : null}
          {isTransactionLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : contributed ? (
            translations.thankYou
          ) : (
            translations.confirm
          )}
        </ContributionButtonConfirm>
      ) : (
        <ContributionDescription>
          {translations.description}
        </ContributionDescription>
      )}
    </ContributionCard>
  );
};
