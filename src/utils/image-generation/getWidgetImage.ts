import type { ExtendedChain, Token } from '@lifi/sdk';

interface WidgetImageProps {
  endpoint: string;
  width: number;
  height: number;
  alt: string;
}

const DEFAUL_WIDGET_AMOUNT = 1;

interface GetWidgetImageProps {
  sourceToken?: Token;
  sourceChain?: ExtendedChain;
  destinationToken?: Token;
  destinationChain?: ExtendedChain;
  chainName?: string;
  theme?: any;
  amount?: number;
  widgetImageProps: WidgetImageProps;
  isSwap?: boolean;
}

export const getWidgetImageProps = ({
  sourceToken,
  sourceChain,
  destinationToken,
  destinationChain,
  chainName,
  theme,
  amount = DEFAUL_WIDGET_AMOUNT, // Default to DEFAUL_WIDGET_AMOUNT if not provided
  widgetImageProps,
  isSwap = false, // Default to false if not provided
}: GetWidgetImageProps) => {
  const params = new URLSearchParams();

  if (sourceToken) {
    params.set('fromToken', sourceToken.address);
  }
  if (sourceChain) {
    params.set('fromChainId', sourceChain.id.toString());
  }
  if (destinationToken) {
    params.set('toToken', destinationToken.address);
  }
  if (destinationChain) {
    params.set('toChainId', destinationChain.id.toString());
  }
  if (theme) {
    params.set('theme', theme.palette.mode);
  }
  if (chainName) {
    params.set('chainName', chainName);
  }
  params.set('amount', (amount ? amount : DEFAUL_WIDGET_AMOUNT).toString());
  params.set('isSwap', (isSwap ? true : false).toString());

  return {
    imgUrl: `/api/${widgetImageProps.endpoint}?${params.toString()}`,
    width: widgetImageProps.width,
    height: widgetImageProps.height,
    alt: widgetImageProps.alt,
  };
};
