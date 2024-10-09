import type { ThemeMode } from '@/types/theme';
import { WalletButtons } from '../Navbar/WalletButton';
import { Widget } from '../Widgets/Widget';
import { BlogWidgetHeader } from './BlogWidget.style';

export interface BlogWidgetProps {
  fromChain?: number;
  fromToken?: string;
  toChain?: number;
  toToken?: string;
  fromAmount?: string;
  allowChains?: string;
  activeThemeMode?: ThemeMode;
}

export const BlogWidget = ({
  fromChain,
  fromToken,
  toChain,
  toToken,
  fromAmount,
  allowChains,
  activeThemeMode,
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
        widgetIntegrator={process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR_BLOG}
        activeThemeMode={activeThemeMode}
      />
    </>
  );
};
