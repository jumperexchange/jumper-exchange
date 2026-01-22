import type { FC } from 'react';
import { useMemo } from 'react';
import { BaseChainStack } from './BaseChainStack';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
import type { TokenWithChainsChainStackProps } from '../EntityChainStack.types';
import { EntityChainStackChainsPlacement } from '../EntityChainStack.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { useChains } from '@/hooks/useChains';
import { getChainName } from 'src/utils/chains/getChainName';
import { toTokenStackTokens } from '../../TokenStack/utils';

export const TokenWithChainsStack: FC<TokenWithChainsChainStackProps> = (
  props,
) => {
  const { getChainById } = useChains();
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
        getChainName(props.token.chain, getChainById),
      );
    }
    props.token.relatedTokens?.forEach((token) => {
      if (!chainMap.has(token.chain.chainId.toString())) {
        chainMap.set(
          token.chain.chainId.toString(),
          getChainName(token.chain, getChainById),
        );
      }
    });
    return {
      chainIds: Array.from(chainMap.keys()),
      chainKeys: Array.from(chainMap.values()),
    };
  }, [props.token, getChainById]);

  const mainStack = (
    <TokenStack
      tokens={props.token ? toTokenStackTokens([props.token]) : []}
      size={props.tokenSize ?? AvatarSize.XL}
      spacing={props.spacing?.main}
      direction={props.layout?.direction}
    />
  );

  return (
    <BaseChainStack
      assetAddresses={props.token?.address ? [props.token.address] : []}
      mainStack={mainStack}
      chainIds={chainIds}
      chainKeys={chainKeys}
      chainsSize={
        chainIds.length > 1 && props.chainsInlineSize
          ? props.chainsInlineSize
          : props.chainsSize
      }
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
