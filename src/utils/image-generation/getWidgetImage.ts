import type { ExtendedChain, Token } from '@lifi/sdk';

interface WidgetImageProps {
  endpoint: string;
  width: number;
  height: number;
  alt: string;
}

const WIDGET_AMOUNT = 3;

export const getWidgetImageProps = (
  sourceToken: Token,
  sourceChain: ExtendedChain,
  destinationToken: Token,
  destinationChain: ExtendedChain,
  theme: any,
  widgetImageProps: WidgetImageProps,
) => {
  return {
    imgUrl: `/api/${widgetImageProps.endpoint}?fromToken=${sourceToken.address}&fromChainId=${sourceChain.id}&toToken=${destinationToken.address}&toChainId=${destinationChain.id}&amount=${WIDGET_AMOUNT}&theme=${theme.palette.mode}&isSwap=false`,
    width: widgetImageProps.width,
    height: widgetImageProps.height,
    alt: widgetImageProps.alt,
  };
};
