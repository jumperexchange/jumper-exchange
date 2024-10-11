import { WidgetImage } from './WidgetImage';

export const WidgetImageClient = () => {
  return (
    <WidgetImage
      width={416}
      height={496}
      fromToken={'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'}
      fromChainId={137}
      toToken={'0xdAC17F958D2ee523a2206206994597C13D831ec7'}
      toChainId={1}
      amount={3}
    />
  );
};
