import CheckIcon from '@mui/icons-material/Check';
import { CircularProgress, Grid, InputAdornment } from '@mui/material';
import { USD_CURRENCY_SYMBOL } from './constants';
import { ContributionTranslations } from './FeeContribution';
import {
  ContributionButton,
  ContributionButtonConfirm,
  ContributionCard,
  ContributionCardTitle,
  ContributionCustomInput,
  ContributionDescription,
} from './FeeContribution.style';
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
  const handleButtonClick = (selectedAmount: number) => {
    if (contributed) {
      onClose();
      return;
    }

    setIsCustomAmountActive(false);

    // no change if amount is already set to the selected amount
    if (
      !contributed &&
      predefinedAmount &&
      Number(predefinedAmount) === selectedAmount
    ) {
      return;
    }

    const formattedAmount = formatInputAmount(
      selectedAmount.toString(),
      NO_DECIMAL_PLACES,
    );
    setPredefinedAmount(formattedAmount);
  };

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
        {contributionOptions.map((contributionAmount) => (
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
        ))}
        <Grid size={3}>
          <ContributionCustomInput
            value={customAmount ?? ''}
            aria-autocomplete="none"
            onChange={onChangeValue}
            onClick={handleCustomClick}
            onBlur={handleCustomBlur}
            placeholder={!isCustomAmountActive ? translations.custom : ''}
            isCustomAmountActive={isCustomAmountActive}
            hasInputAmount={!!customAmount && isCustomAmountActive}
            slotProps={{
              input: {
                startAdornment:
                  isCustomAmountActive || customAmount ? (
                    <InputAdornment position="start" disableTypography>
                      {USD_CURRENCY_SYMBOL}
                    </InputAdornment>
                  ) : null,
                sx: (theme) => ({
                  input: {
                    ...(customAmount && {
                      width: customAmount.length * 8 + 'px',
                      paddingLeft: theme.spacing(0.5),
                    }),
                    padding: customAmount ? '0' : '0 16px',
                  },
                }),
              },
            }}
          />
        </Grid>
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
