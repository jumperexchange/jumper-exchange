import CheckIcon from '@mui/icons-material/Check';
import { CircularProgress, Grid, InputAdornment } from '@mui/material';
import { ContributionTranslations } from './FeeContribution';
import {
  ContributionButton,
  ContributionButtonConfirm,
  ContributionCard,
  ContributionCardTitle,
  ContributionCustomInput,
  ContributionDescription,
} from './FeeContribution.style';
import * as helper from './helper';

export interface FeeContributionCardProps {
  translations: ContributionTranslations;
  contributionOptions: number[];
  amount: string;
  inputAmount: string;
  contributed: boolean;
  isTransactionLoading: boolean;
  maxUsdAmount: number;
  isCustomAmountActive: boolean;
  setAmount: (amount: string) => void;
  setInputAmount: (inputAmount: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const FeeContributionCard: React.FC<FeeContributionCardProps> = ({
  translations,
  contributionOptions,
  amount,
  inputAmount,
  contributed,
  isTransactionLoading,
  maxUsdAmount,
  isCustomAmountActive,
  setAmount,
  setInputAmount,
  onClose,
  onConfirm,
}) => {
  function onChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    if (contributed) {
      return;
    }
    const { value } = event.target;
    // First validate the input value
    const validatedValue = helper.validateInputAmount(value);
    const numericValue = Number(validatedValue);
    if (!isNaN(numericValue)) {
      if (numericValue > maxUsdAmount) {
        // Check if maxUsdAmount is bigger than the validated value
        const formattedMaxUsdAmount = maxUsdAmount.toFixed(2).toString();
        setAmount(formattedMaxUsdAmount);
        setInputAmount(formattedMaxUsdAmount);
      } else {
        setAmount(validatedValue);
        setInputAmount(validatedValue);
      }
    }
  }

  const handleButtonClick = (selectedAmount: number) => {
    if (contributed) {
      onClose();
    }
    if (!contributed && amount && Number(amount) === selectedAmount) {
      setAmount('');
    } else {
      const amountStr = selectedAmount.toString();
      setAmount(amountStr);
    }
  };

  const handleCustomClick = () => {
    if (contributed) {
      return;
    }
    if (inputAmount && Number(inputAmount) > 0) {
      setAmount(inputAmount);
    }
  };

  console.log('FeeContributionCard!!', amount, typeof amount);

  return (
    <ContributionCard className="TEST-CARD">
      <ContributionCardTitle>{translations.title}</ContributionCardTitle>
      <Grid
        container
        spacing={2}
        columnSpacing={1}
        justifyContent={'space-between'}
      >
        {contributionOptions.map((contributionAmount) => (
          <Grid size={3} key={contributionAmount}>
            <ContributionButton
              selected={!!amount && Number(amount) === contributionAmount}
              onClick={() => handleButtonClick(contributionAmount)}
              size="small"
            >
              ${contributionAmount}
            </ContributionButton>
          </Grid>
        ))}
        <Grid size={3}>
          <ContributionCustomInput
            value={inputAmount}
            aria-autocomplete="none"
            onChange={onChangeValue}
            onClick={handleCustomClick}
            onFocus={handleCustomClick}
            placeholder={translations.custom}
            isCustomAmountActive={isCustomAmountActive}
            hasInputAmount={!!inputAmount}
            slotProps={{
              input: {
                startAdornment: inputAmount ? (
                  <InputAdornment position="start" disableTypography>
                    $
                  </InputAdornment>
                ) : null,
                sx: (theme) => ({
                  input: {
                    ...(inputAmount && {
                      width: inputAmount.length * 8 + 'px',
                      paddingLeft: theme.spacing(0.5),
                    }),
                    padding: inputAmount ? '0' : '0 16px',
                  },
                }),
              },
            }}
          />
        </Grid>
      </Grid>

      {!!amount || contributed ? (
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
