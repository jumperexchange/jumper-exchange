import { FC } from 'react';
import { ProtocolChainStack } from './variants/ProtocolChainStack';
import { TokenChainStack } from './variants/TokenChainStack';
import {
  EntityChainStackProps,
  EntityChainStackVariant,
} from './EntityChainStack.types';

export const EntityChainStack: FC<EntityChainStackProps> = (props) => {
  if (props.variant === EntityChainStackVariant.Protocol) {
    return <ProtocolChainStack {...props} />;
  }
  return <TokenChainStack {...props} />;
};
