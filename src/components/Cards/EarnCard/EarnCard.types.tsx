import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';

export type EarnCardVariant = 'compact' | 'list-item' | 'overview';

interface CommonEarnCardProps {
  variant?: EarnCardVariant;
  fullWidth?: boolean;
  primaryAction?: React.ReactNode;
  headerBadge?: React.ReactNode;
  href?: string;
}

export interface EarnCardNotEmptyProps extends CommonEarnCardProps {
  data: EarnOpportunityWithLatestAnalytics;
  isLoading?: boolean;
}

export interface EarnCardEmptyAndLoadingProps extends CommonEarnCardProps {
  data: null;
  isLoading: true;
}

export type EarnCardProps =
  | EarnCardNotEmptyProps
  | EarnCardEmptyAndLoadingProps;
