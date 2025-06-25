import CheckIcon from '@mui/icons-material/Check';
import { CircularProgress, Grid, InputAdornment } from '@mui/material';
import { useMemo } from 'react';
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

const { SHOW_DECIMAL_PLACES } = helper;

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
  // Create the input handler with both Zod validation and Intl formatting
  const inputHandler = useMemo(
    () => helper.createInputAmountSchema(maxUsdAmount),
    [maxUsdAmount],
  );

  // Format display value for the input field
  const displayValue = useMemo(() => {
    return inputAmount ? inputHandler.formatForDisplay(inputAmount) : '';
  }, [inputAmount, inputHandler]);

  // Handle input changes
  function onChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    if (contributed) return;

    const { value } = event.target;
    // Parse and validate the input
    const parsedValue = inputHandler.parseInput(value);

    // Update both the raw and display values
    setAmount(parsedValue);
    setInputAmount(parsedValue);
  }

  const handleButtonClick = (selectedAmount: number) => {
    if (contributed) {
      onClose();
      return;
    }

    // no change if amount is already set to the selected amount
    if (!contributed && amount && Number(amount) === selectedAmount) {
      return;
    }

    const amountStr = selectedAmount.toFixed(SHOW_DECIMAL_PLACES);
    setAmount(amountStr);
    setInputAmount(amountStr);
  };

  const handleCustomClick = () => {
    if (contributed) return;

    if (inputAmount && Number(inputAmount) > 0) {
      setAmount(inputAmount);
    }
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
            value={displayValue}
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
                    ...(displayValue && {
                      width: displayValue.length * 8 + 'px',
                      paddingLeft: theme.spacing(0.5),
                    }),
                    padding: displayValue ? '0' : '0 16px',
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
