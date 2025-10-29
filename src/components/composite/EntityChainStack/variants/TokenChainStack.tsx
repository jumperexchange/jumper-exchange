import { FC, useMemo } from 'react';
import { BaseChainStack } from './BaseChainStack';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
import { TokenChainStackProps } from '../EntityChainStack.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';

export const TokenChainStack: FC<TokenChainStackProps> = (props) => {
  const { chainIds, chainKeys } = useMemo(() => {
    const chainMap = new Map();
    props.tokens?.forEach((token) => {
      if (!chainMap.has(token.chain.chainId.toString())) {
        chainMap.set(token.chain.chainId.toString(), token.chain.chainKey);
      }
    });
    return {
      chainIds: Array.from(chainMap.keys()),
      chainKeys: Array.from(chainMap.values()),
    };
  }, [props.tokens]);

  const mainStack = (
    <TokenStack
      tokens={props.tokens ?? []}
      size={props.tokensSize ?? AvatarSize.XL}
      spacing={props.spacing?.main}
      direction={props.layout?.direction}
    />
  );

  return (
    <BaseChainStack
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
