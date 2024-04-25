import { WallettButtons } from '../Navbar/WalletButton';
import { Widget } from '../Widgets';
import { BlogWidgetHeader } from './BlogWidget.style';

interface BlogWidgetProps {
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
        <WallettButtons />
      </BlogWidgetHeader>
      <Widget
        starterVariant="default"
        fromChain={fromChain}
        fromToken={fromToken}
        toChain={toChain}
        fromAmount={fromAmount}
        toToken={toToken}
        allowChains={allowChainsArray}
        widgetIntegrator={process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR_BLOG}
      />
    </>
  );
};
