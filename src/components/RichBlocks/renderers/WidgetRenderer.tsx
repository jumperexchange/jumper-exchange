import { FC } from 'react';
import { WidgetHeader } from '../RichBlocks.style';
import { Widget } from 'src/components/Widgets/Widget';
import { WalletButtons } from 'src/components/Navbar/components/Buttons/WalletButtons';
import config from 'src/config/env-config';

interface WidgetRendererProps {
  text: string;
}

export interface WidgetRouteSettings {
  fromChain?: number;
  fromToken?: string;
  toChain?: number;
  toToken?: string;
  fromAmount?: string;
  allowChains?: string;
}

export const WidgetRenderer: FC<WidgetRendererProps> = ({ text }) => {
  const props: WidgetRouteSettings = {};
  const propRegex =
    /(?:fromAmount|fromChain|fromToken|toChain|toToken|allowChains)="([^"]*)"/g;

  const setProp = <K extends keyof WidgetRouteSettings>(
    prop: K,
    value: WidgetRouteSettings[K],
  ) => {
    props[prop] = value;
  };

  try {
    let match;
    while ((match = propRegex.exec(text)) !== null) {
      const [, value] = match;
      const prop = match[0].split('=')[0];
      if (prop) {
        setProp(prop as keyof WidgetRouteSettings, value);
      }
    }
  } catch (error) {
    console.error('Error integrating widget into blog article', error);
    return null;
  }

  const { fromChain, fromToken, toChain, toToken, fromAmount, allowChains } =
    props;

  const allowChainsArray = (allowChains || '')
    .split(',')
    .map((el) => parseInt(el))
    .filter((num) => !isNaN(num));

  return (
    <>
      <WidgetHeader>
        <WalletButtons />
      </WidgetHeader>
      <Widget
        starterVariant="default"
        fromChain={fromChain}
        fromToken={fromToken}
        toChain={toChain}
        fromAmount={fromAmount}
        toToken={toToken}
        allowChains={allowChainsArray}
        widgetIntegrator={config.NEXT_PUBLIC_WIDGET_INTEGRATOR_BLOG}
      />
    </>
  );
};
