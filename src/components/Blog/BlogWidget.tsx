import { Box } from '@mui/material';
import { WallettButtons } from '../Navbar/WalletButton';
import { Widget } from '../Widgets';

interface BlogWidgetProps {
  fromChain?: number;
  fromToken?: string;
  toChain?: number;
  toToken?: string;
  fromAmount?: string;
}

export const BlogWidget = ({
  fromChain,
  fromToken,
  toChain,
  toToken,
  fromAmount,
}: BlogWidgetProps) => {
  return (
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 3 }}
      >
        <WallettButtons />
      </Box>
      <Widget
        starterVariant="default"
        fromChain={fromChain}
        fromToken={fromToken}
        toChain={toChain}
        fromAmount={fromAmount}
        toToken={toToken}
        widgetIntegrator={process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR_BLOG}
      />
    </>
  );
};
