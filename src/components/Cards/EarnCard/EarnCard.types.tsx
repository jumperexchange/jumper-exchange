import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';

export type EarnCardVariant = 'compact' | 'list-item' | 'top';

export interface EarnCardProps {
  variant?: EarnCardVariant;
  fullWidth?: boolean;
  data: EarnOpportunityWithLatestAnalytics;
  primaryAction?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
}
