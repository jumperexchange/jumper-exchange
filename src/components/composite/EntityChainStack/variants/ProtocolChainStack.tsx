import { FC, useMemo } from 'react';
import { BaseChainStack } from './BaseChainStack';
import { AvatarStack } from 'src/components/core/AvatarStack/AvatarStack';
import { ProtocolChainStackProps } from '../EntityChainStack.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';

export const ProtocolChainStack: FC<ProtocolChainStackProps> = (props) => {
  const { chainIds, chainKeys } = useMemo(() => {
    const chainMap = new Map();
    props.chains?.forEach((chain) => {
      chainMap.set(chain.chainId.toString(), chain.chainKey);
    });
    return {
      chainIds: Array.from(chainMap.keys()),
      chainKeys: Array.from(chainMap.values()),
    };
  }, [props.chains]);

  const mainStack = (
    <AvatarStack
      size={props.protocolSize ?? AvatarSize.XL}
      spacing={props.spacing?.main}
      direction={props.layout?.direction}
      disableBorder
      avatars={
        props.protocol
          ? [
              {
                id: props.protocol.name,
                src: props.protocol.logo,
                alt: props.protocol.name,
              },
            ]
          : []
      }
    />
  );

  return (
    <BaseChainStack
      mainStack={mainStack}
      chainIds={chainIds}
      chainKeys={chainKeys}
      chainsSize={props.chainsSize}
      isLoading={props.isLoading}
      spacing={props.spacing}
      layout={props.layout}
      isContentVisible={props.isContentVisible}
      content={{
        ...props.content,
        title: props.content?.title || props.protocol?.product,
      }}
      skeletonSize={props.protocolSize}
    />
  );
};
