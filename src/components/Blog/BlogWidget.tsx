import { WallettButtons } from '../Navbar/WalletButton';
import { Widget } from '../Widgets/Widget';
import { BlogWidgetHeader } from './BlogWidget.style';
import { ThemeModesSupported } from '@/types/settings';

export interface BlogWidgetProps {
  fromChain?: number;
  fromToken?: string;
  toChain?: number;
  toToken?: string;
  fromAmount?: string;
  allowChains?: string;
  activeTheme?: ThemeModesSupported;
}

export const BlogWidget = ({
  fromChain,
  fromToken,
  toChain,
  toToken,
  fromAmount,
  allowChains,
  activeTheme,
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
        activeTheme={activeTheme}
      />
    </>
  );
};
