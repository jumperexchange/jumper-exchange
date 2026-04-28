import type {
  Balance,
  ExtendedToken,
  PortfolioBalance,
  WalletToken,
} from '@/types/tokens';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Summary } from '@/components/composite/JumperWidget/components/Summary';
import type { ComposeResponseData } from '@/app/lib/lifi-composer-client';
import Box from '@mui/material/Box';
import { AvatarItem } from '@/components/core/AvatarStack/AvatarItem';
import Typography from '@mui/material/Typography';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { ComposerNetworkCost } from '../../JumperWidget/components/NetworkCost/ComposerNetworkCost';

interface RouteOverviewProps {
  composerQuote?: ComposeResponseData;
  nativeTokenBalance?: Balance<ExtendedToken>;
  /** Tokens the user selected to convert (not merely tokens needing a new approval). */
  selectedInputBalances: PortfolioBalance<WalletToken>[];
}

export const RouteOverview: FC<RouteOverviewProps> = ({
  composerQuote,
  nativeTokenBalance,
  selectedInputBalances,
}) => {
  const { t } = useTranslation();
  const fromBalances = selectedInputBalances;

  if (!composerQuote || fromBalances.length === 0 || !nativeTokenBalance) {
    return null;
  }

  return (
    <>
      <Summary
        label={t('form.labels.convert')}
        from={fromBalances}
        amountUSD={composerQuote.priceImpact.inputValueUsd}
        to={nativeTokenBalance}
        fieldSx={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <AvatarItem
            avatar={{
              src: 'https://cdn.jsdelivr.net/gh/lifinance/types@c55266da1b67513f3aa7ba9c1e066be1fae3a01a/src/assets/icons/protocols/wrapper.svg',
              alt: t('portfolio.dustConversion.routeOverview.composerAlt'),
              id: 'step',
            }}
            size={AvatarSize.XL}
          />
          <Typography variant="bodySmallStrong">
            {t('portfolio.dustConversion.routeOverview.composerViaLifi')}
          </Typography>
        </Box>
      </Summary>
    </>
  );
};
