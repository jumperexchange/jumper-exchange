import { Protocol, Token } from 'src/types/jumper-backend';

export type EarnCardVariant = 'compact' | 'list-item';

export interface EarnCardProps {
  variant?: EarnCardVariant;
  fullWidth?: boolean;
  recommended?: boolean;
  tags?: string[];
  lockupPeriod?: {
    label: string;
    tooltip: string;
    value: number;
    valueFormatted: string;
  };
  apy?: {
    label: string;
    tooltip: string;
    value: number;
    valueFormatted: string;
  };
  tvl?: {
    label: string;
    tooltip: string;
    value: number;
    valueFormatted: string;
  };
  assets: {
    label: string;
    tooltip: string;
    tokens: Token[];
  };
  protocol: Protocol;
  link?: {
    url: string;
    label: string;
  };
  primaryAction?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
}
