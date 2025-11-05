import { FC, useMemo } from 'react';
import { AvatarStack } from 'src/components/core/AvatarStack/AvatarStack';
import {
  AvatarSize,
  AvatarStackDirection,
} from 'src/components/core/AvatarStack/AvatarStack.types';
import { Protocol } from 'src/types/jumper-backend';

interface ProtocolStackProps {
  protocols: Protocol[];
  size?: AvatarSize;
  spacing?: number;
  direction?: AvatarStackDirection;
  limit?: number;
}

export const ProtocolStack: FC<ProtocolStackProps> = ({
  protocols,
  size,
  spacing = -1.5,
  direction = 'row',
  limit,
}) => {
  const enhancedProtocols = useMemo(() => {
    return protocols.map((protocol) => ({
      id: protocol.name,
      src: protocol.logo,
      alt: protocol.name,
    }));
  }, [protocols]);

  return (
    <AvatarStack
      avatars={enhancedProtocols}
      size={size}
      spacing={spacing}
      direction={direction}
      disableBorder
      limit={limit}
    />
  );
};
