import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { FeeContributionCardProps } from './FeeContribution';
import { ContributionCustomInput } from './FeeContribution.style';
import { USD_CURRENCY_SYMBOL } from './constants';
import { formatInputAmount, NO_DECIMAL_PLACES } from './utils';

export interface CustomInputProps
  extends Pick<
    FeeContributionCardProps,
    | 'translations'
    | 'customAmount'
    | 'contributed'
    | 'maxUsdAmount'
    | 'isCustomAmountActive'
    | 'setCustomAmount'
    | 'setIsCustomAmountActive'
  > {}

export const CustomInput: React.FC<CustomInputProps> = ({
  translations,
  customAmount,
  contributed,
  maxUsdAmount,
  isCustomAmountActive,
  setCustomAmount,
  setIsCustomAmountActive,
}) => {
  const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (contributed) return;

    setIsCustomAmountActive(true);

    const { value } = event.target;

    const formattedAmount = formatInputAmount(value, NO_DECIMAL_PLACES);
    if (formattedAmount && Number(formattedAmount) > maxUsdAmount) {
      setCustomAmount(maxUsdAmount.toString());
    } else {
      setCustomAmount(formattedAmount);
    }
  };

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
  );
};
