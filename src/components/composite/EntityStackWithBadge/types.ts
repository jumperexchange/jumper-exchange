import type {
  AvatarSize,
  AvatarStackDirection,
} from '@/components/core/AvatarStack/AvatarStack.types';
import type { TypographyProps } from '@mui/material/Typography';
import type { DisplayableEntity } from '../EntityAvatar/types';

export type { DisplayableEntity };

export enum EntityStackBadgePlacement {
  Overlay = 'overlay',
  Inline = 'inline',
}

export interface EntityStackSpacing {
  /** Spacing for main avatar stack */
  main?: number;
  /** Spacing for badge avatar stack */
  badge?: number;
  /** Gap between avatar stack and content */
  containerGap?: number;
  /** Gap between title and hint in content */
  infoContainerGap?: number;
}

export interface EntityStackContent {
  /** Main title text */
  title?: string;
  /** Hint text (if not provided, derived from badge entity names) */
  hint?: string;
  /** Typography variant for title */
  titleVariant?: TypographyProps['variant'];
  /** Typography variant for hint/description */
  hintVariant?: TypographyProps['variant'];
}

export interface EntityStackWithBadgeProps {
  /** Main entities to display in the stack */
  entities: DisplayableEntity[];
  /** Badge entities to display (e.g., chains) */
  badgeEntities?: DisplayableEntity[];
  /** Badge placement - overlay (bottom-right) or inline */
  placement?: EntityStackBadgePlacement;
  /** Show loading skeleton */
  isLoading?: boolean;
  /** Show content (title/hint) next to avatars */
  isContentVisible?: boolean;
  /** Data test ID for the container */
  dataTestId?: string;
  // Main stack props
  size?: AvatarSize;
  limit?: number;
  direction?: AvatarStackDirection;
  disableBorder?: boolean;
  // Badge stack props
  badgeSize?: AvatarSize;
  badgeLimit?: number;
  badgeDirection?: AvatarStackDirection;
  addressOverride?: string;
  // Spacing configuration
  spacing?: EntityStackSpacing;
  // Content configuration
  content?: EntityStackContent;
}
