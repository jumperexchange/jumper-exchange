import { WalletButtons } from '../Navbar/WalletButtons';
import { Widget } from '../Widgets/Widget';
import { BlogWidgetHeader } from './BlogWidget.style';
import config from '@/config/env-config';
export interface BlogWidgetProps {
  fromChain?: number;
  fromToken?: string;
  toChain?: number;
  toToken?: string;
  fromAmount?: string;
  allowChains?: string;
}

export const BlogWidget = ({
  fromChain,
  fromToken,
  toChain,
  toToken,
  fromAmount,
  allowChains,
}: BlogWidgetProps) => {
  const allowChainsArray = (allowChains || '')
    .split(',')
    .map((el) => parseInt(el))
    .filter((num) => !isNaN(num));

  return (
    <>
      <BlogWidgetHeader>
        <WalletButtons />
      </BlogWidgetHeader>
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
