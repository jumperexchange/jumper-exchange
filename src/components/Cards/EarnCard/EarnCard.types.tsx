import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import type { ApyWindow } from '@/utils/earn/apyWindow';

export type EarnCardVariant = 'compact' | 'list-item' | 'overview';

interface CommonEarnCardProps {
  variant?: EarnCardVariant;
  fullWidth?: boolean;
  primaryAction?: React.ReactNode;
  headerBadge?: React.ReactNode;
  href?: string;
  apyWindow?: ApyWindow;
  setApyWindow?: (apyWindow: ApyWindow) => void;
}

export interface EarnCardNotEmptyProps extends CommonEarnCardProps {
  data: EarnOpportunityWithLatestAnalytics;
  isLoading?: boolean;
  isMissingPosition?: false;
}

export interface EarnCardEmptyAndLoadingProps extends CommonEarnCardProps {
  data: null;
  isLoading: true;
  isMissingPosition?: false;
}

export interface EarnCardMissingPositionProps extends CommonEarnCardProps {
  data: null;
  isLoading: false;
  isMissingPosition: true;
}

export type EarnCardProps =
  | EarnCardNotEmptyProps
  | EarnCardEmptyAndLoadingProps
  | EarnCardMissingPositionProps;
