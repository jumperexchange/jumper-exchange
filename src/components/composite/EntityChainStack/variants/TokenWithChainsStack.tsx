import { FC, useMemo } from 'react';
import { BaseChainStack } from './BaseChainStack';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
import {
  EntityChainStackChainsPlacement,
  TokenWithChainsChainStackProps,
} from '../EntityChainStack.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';

export const TokenWithChainsStack: FC<TokenWithChainsChainStackProps> = (
  props,
) => {
  const { chainIds, chainKeys } = useMemo(() => {
    if (!props.token) {
      return {
        chainIds: [],
        chainKeys: [],
      };
    }
    const chainMap = new Map();
    if (!chainMap.has(props.token.chain.chainId.toString())) {
      chainMap.set(
        props.token.chain.chainId.toString(),
        props.token.chain.chainKey,
      );
    }
    props.token.relatedTokens?.forEach((token) => {
      if (!chainMap.has(token.chain.chainId.toString())) {
        chainMap.set(token.chain.chainId.toString(), token.chain.chainKey);
      }
    });
    return {
      chainIds: Array.from(chainMap.keys()),
      chainKeys: Array.from(chainMap.values()),
    };
  }, [props.token]);

  const mainStack = (
    <TokenStack
      tokens={props.token ? [props.token] : []}
      size={props.tokenSize ?? AvatarSize.XL}
      spacing={props.spacing?.main}
      direction={props.layout?.direction}
    />
  );

  return (
    <BaseChainStack
      mainStack={mainStack}
      chainIds={chainIds}
      chainKeys={chainKeys}
      chainsSize={props.chainsSize}
      isLoading={props.isLoading || !props.token}
      spacing={props.spacing}
      layout={props.layout}
      isContentVisible={props.isContentVisible}
      content={props.content}
      skeletonSize={props.tokenSize}
      chainsLimit={props.chainsLimit}
      chainsPlacement={
        chainIds.length > 1
          ? EntityChainStackChainsPlacement.Inline
          : EntityChainStackChainsPlacement.Overlay
      }
    />
  );
};
