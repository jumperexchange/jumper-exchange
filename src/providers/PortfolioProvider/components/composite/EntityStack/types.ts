import type {
  AvatarSize,
  AvatarStackDirection,
} from '@/components/core/AvatarStack/AvatarStack.types';
import type { DisplayableEntity } from '../EntityAvatar/types';

export type { DisplayableEntity };

export interface EntityStackProps {
  entities: DisplayableEntity[];
  size?: AvatarSize;
  spacing?: number;
  direction?: AvatarStackDirection;
  limit?: number;
  disableBorder?: boolean;
}
