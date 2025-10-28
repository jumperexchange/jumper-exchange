import { FC } from 'react';
import { ProtocolChainStack } from './variants/ProtocolChainStack';
import { TokenChainStack } from './variants/TokenChainStack';
import {
  EntityChainStackProps,
  EntityChainStackVariant,
} from './EntityChainStack.types';
import { TokenWithChainsStack } from './variants/TokenWithChainsStack';

export const EntityChainStack: FC<EntityChainStackProps> = (props) => {
  if (props.variant === EntityChainStackVariant.Protocol) {
    return <ProtocolChainStack {...props} />;
  }
  if (props.variant === EntityChainStackVariant.TokensWithChains) {
    return <TokenWithChainsStack {...props} />;
  }
  return <TokenChainStack {...props} />;
};
