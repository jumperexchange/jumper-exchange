import { FC, useMemo } from 'react';
import { BaseChainStack } from './BaseChainStack';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
import {
  EntityChainStackChainsPlacement,
  TokensWithChainsChainStackProps,
} from '../EntityChainStack.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';

export const TokenWithChainsStack: FC<TokensWithChainsChainStackProps> = (
  props,
) => {
  const { chainIds, chainKeys, token } = useMemo(() => {
    if (!props.token) {
      return {
        chainIds: [],
        chainKeys: [],
        token: undefined,
      };
    }
    const chainMap = new Map();
    if (!chainMap.has(props.token.chainId.toString())) {
      chainMap.set(props.token.chainId.toString(), props.token.chainName ?? '');
    }
    props.token.chains?.forEach((chain) => {
      if (!chainMap.has(chain.chainId.toString())) {
        chainMap.set(chain.chainId.toString(), chain.chainName ?? '');
      }
    });
    return {
      chainIds: Array.from(chainMap.keys()),
      chainKeys: Array.from(chainMap.values()),
      token: {
        address: props.token.address,
        chain: {
          chainId: props.token.chainId,
          chainKey: props.token.chainName ?? '',
        },
      },
    };
  }, [props.token]);

  const mainStack = (
    <TokenStack
      tokens={token ? [token] : []}
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
      isLoading={props.isLoading || !token}
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
