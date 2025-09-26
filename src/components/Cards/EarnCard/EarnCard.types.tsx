import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';

export type EarnCardVariant = 'compact' | 'list-item' | 'top';

export interface EarnCardNotEmptyProps {
  variant?: EarnCardVariant;
  fullWidth?: boolean;
  data: EarnOpportunityWithLatestAnalytics;
  isLoading?: boolean;
  primaryAction?: React.ReactNode;
  onClick?: () => void;
}

export interface EarnCardEmptyAndLoadingProps {
  variant?: EarnCardVariant;
  fullWidth?: boolean;
  data: null;
  isLoading: true;
  primaryAction?: React.ReactNode;
  onClick?: () => void;
}

export type EarnCardProps =
  | EarnCardNotEmptyProps
  | EarnCardEmptyAndLoadingProps;
