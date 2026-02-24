import type { DisplayableEntity } from '../EntityAvatar/types';
import type { AvatarStackProps } from '@/components/core/AvatarStack/AvatarStack';

export interface EntityStackProps extends Omit<AvatarStackProps, 'avatars'> {
  entities: DisplayableEntity[];
}
