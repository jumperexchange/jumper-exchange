import { FC, useMemo } from 'react';
import { BaseChainStack } from './BaseChainStack';
import { ProtocolStack } from 'src/components/composite/ProtocolStack/ProtocolStack';
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
    <ProtocolStack
      protocols={props.protocol ? [props.protocol] : []}
      size={props.protocolSize ?? AvatarSize.XL}
      spacing={props.spacing?.main}
      direction={props.layout?.direction}
      limit={props.protocolLimit}
    />
  );

  return (
    <BaseChainStack
      dataTestId={`protocol-${props.protocol?.name}`}
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
        title:
          props.content?.title ||
          props.protocol?.product ||
          props.protocol?.name,
      }}
      skeletonSize={props.protocolSize}
    />
  );
};
