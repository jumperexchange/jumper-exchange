import type { FC } from 'react';
import { useMemo } from 'react';
import { BaseChainStack } from './BaseChainStack';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
import type { TokenChainStackProps } from '../EntityChainStack.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { useChains } from '@/hooks/useChains';
import { getChainName } from 'src/utils/chains/getChainName';
import { toTokenStackTokens } from '../../TokenStack/utils';

export const TokenChainStack: FC<TokenChainStackProps> = (props) => {
  const { getChainById } = useChains();
  const { chainIds, chainKeys } = useMemo(() => {
    const chainMap = new Map();
    props.tokens?.forEach((token) => {
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
  }, [props.tokens, getChainById]);

  const mainStack = (
    <TokenStack
      tokens={props.tokens ? toTokenStackTokens(props.tokens) : []}
      size={props.tokensSize ?? AvatarSize.XL}
      spacing={props.spacing?.main}
      direction={props.layout?.direction}
      limit={props.tokensLimit}
    />
  );

  return (
    <BaseChainStack
      assetAddresses={props.tokens
        ?.map((token) => token.address)
        .filter(Boolean)}
      dataTestId={`tokens-${props.tokens?.map((token) => token.name).join('-')}`}
      mainStack={mainStack}
      chainIds={chainIds}
      chainKeys={chainKeys}
      chainsSize={props.chainsSize}
      isLoading={props.isLoading}
      spacing={props.spacing}
      layout={props.layout}
      isContentVisible={props.isContentVisible}
      content={props.content}
      skeletonSize={props.tokensSize}
    />
  );
};
