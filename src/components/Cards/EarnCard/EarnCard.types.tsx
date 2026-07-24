import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import type { ApyWindow } from '@/utils/earn/apyWindow';

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
  isMissingPosition?: false;
  apyWindow: ApyWindow;
  onToggleApyWindow?: () => void;
}

export interface EarnCardEmptyAndLoadingProps extends CommonEarnCardProps {
  data: null;
  isLoading: true;
  isMissingPosition?: false;
  apyWindow?: never;
  onToggleApyWindow?: never;
}

export interface EarnCardMissingPositionProps extends CommonEarnCardProps {
  data: null;
  isLoading: false;
  isMissingPosition: true;
  apyWindow?: never;
  onToggleApyWindow?: never;
}

export type EarnCardProps =
  | EarnCardNotEmptyProps
  | EarnCardEmptyAndLoadingProps
  | EarnCardMissingPositionProps;
