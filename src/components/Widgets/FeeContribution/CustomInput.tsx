import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { FeeContributionCardProps } from './FeeContribution';
import { ContributionCustomInput } from './FeeContribution.style';
import { USD_CURRENCY_SYMBOL } from './constants';
import {
  displayFormatter,
  formatInputAmount,
  NUM_DECIMAL_PLACES,
} from './utils';

export interface CustomInputProps
  extends Pick<
    FeeContributionCardProps,
    | 'customAmount'
    | 'contributed'
    | 'maxUsdAmount'
    | 'isCustomAmountActive'
    | 'setCustomAmount'
    | 'setIsCustomAmountActive'
  > {
  placeholder: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  customAmount,
  contributed,
  maxUsdAmount,
  placeholder,
  isCustomAmountActive,
  setCustomAmount,
  setIsCustomAmountActive,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (contributed) return;

    setIsCustomAmountActive(true);

    const { value } = event.target;

    const formattedAmount = formatInputAmount(value, NUM_DECIMAL_PLACES);
    if (formattedAmount && Number(formattedAmount) >= maxUsdAmount) {
      const formattedMaxUsdAmount = displayFormatter.format(maxUsdAmount);
      setCustomAmount(formattedMaxUsdAmount);
    } else {
      setCustomAmount(formattedAmount);
    }
  };

  const handleClick = () => {
    if (contributed) return;

    setIsCustomAmountActive(true);

    if (customAmount && Number(customAmount) > 0) {
      setCustomAmount(customAmount);
    }
  };

  const handleBlur = () => {
    setIsCustomAmountActive(false);
  };

  return (
    <Grid size={3}>
      <ContributionCustomInput
        value={customAmount ?? ''}
        aria-autocomplete="none"
        onChange={handleChange}
        onClick={handleClick}
        onBlur={handleBlur}
        placeholder={placeholder}
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
