import type { SxProps, Theme } from '@mui/material/styles';
import type { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { TypographyProps } from '@mui/material/Typography';
import type { ResponsiveValue } from '@/types/responsive';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';

export enum BalanceCardSize {
  SM = 'sm',
  MD = 'md',
}

export interface BalanceCardProps {
  balances: PortfolioBalance<WalletToken>[];
  size?: BalanceCardSize;
  onSelect?: (balance: PortfolioBalance<WalletToken>) => void;
  shouldShowExpandedEndDivider?: boolean;
}

export interface BalanceStackItemProps {
  balance: PortfolioBalance<WalletToken>;
  config: BalanceStackConfig;
  isClickable: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export interface BalanceStackConfig {
  tokenSize: AvatarSize;
  chainsSize: AvatarSize;
  titleVariant: TypographyProps['variant'];
  descriptionVariant: TypographyProps['variant'];
  infoContainerGap: number;
  itemSx?: SxProps<Theme>;
}

export interface BalanceCardConfig {
  primary: BalanceStackConfig & { inlineChainsSize: AvatarSize };
  expanded: BalanceStackConfig;
  dividerSpacing: number;
  paddingBottom: number;
  chainsLimit: ResponsiveValue<number>;
  chainsSpacing: number;
}
