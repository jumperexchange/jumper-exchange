import type { SxProps, Theme } from '@mui/material/styles';
import type { TypographyProps } from '@mui/material/Typography';
import type { Balance, PortfolioBalance, PricedToken } from '@/types/tokens';

export interface BaseTokenAmountProps {
  amountUSDVariant?: TypographyProps['variant'];
  amountVariant?: TypographyProps['variant'];
  compact?: boolean;
  gap?: number;
  amountUSDDataTestId?: string;
  amountDataTestId?: string;
  sx?: SxProps<Theme>;
}

export type SingleTokenAmountProps = BaseTokenAmountProps & {
  balance: Balance<PricedToken>;
};

export type AggregatedTokenAmountProps = BaseTokenAmountProps & {
  balances: PortfolioBalance<PricedToken>[];
};

export type TokenAmountProps =
  | SingleTokenAmountProps
  | AggregatedTokenAmountProps;
