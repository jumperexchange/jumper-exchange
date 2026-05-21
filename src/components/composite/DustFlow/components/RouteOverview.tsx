import type {
  Balance,
  ExtendedToken,
  PortfolioBalance,
  WalletToken,
} from '@/types/tokens';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Summary } from '@/components/composite/JumperWidget/components/Summary';
import type { ComposeResponseData } from '@/app/lib/lifi-composer-client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AvatarItem } from '@/components/core/AvatarStack/AvatarItem';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { ExpandableSection } from '@/components/core/sections/ExpandableSection/ExpandableSection';
import { useGetAddressExplorerUrl } from '@/hooks/useBlockchainExplorerURL';
import type { Hex } from 'viem';
import type { RouteStepOverviewProps } from './RouteStepOverview';
import { RouteStepOverview } from './RouteStepOverview';

interface RouteOverviewProps {
  composerQuote?: ComposeResponseData;
  nativeTokenBalance?: Balance<ExtendedToken>;
  /** Tokens the user selected to convert (not merely tokens needing a new approval). */
  selectedInputBalances: PortfolioBalance<WalletToken>[];
  currentActionIndex?: number;
  isExecuting?: boolean;
  actionHashes?: (Hex | undefined)[];
  chainId?: number;
}

const COMPOSER_ICON_SRC =
  'https://raw.githubusercontent.com/lifinance/types/refs/heads/main/src/assets/icons/protocols/wrapper.svg';

export const RouteOverview: FC<RouteOverviewProps> = ({
  composerQuote,
  nativeTokenBalance,
  selectedInputBalances,
  currentActionIndex,
  isExecuting,
  actionHashes,
  chainId,
}) => {
  const { t } = useTranslation();
  const getExplorerUrl = useGetAddressExplorerUrl('tx');

  const steps = useMemo(() => {
    if (!composerQuote || !nativeTokenBalance) {
      return [];
    }

    const approvalLabels =
      composerQuote.approvals?.map((approval) => {
        const match = selectedInputBalances.find(
          (b) => b.token.address.toLowerCase() === approval.token.toLowerCase(),
        );
        const symbol = match?.token.symbol ?? approval.token.slice(0, 6);
        return t('portfolio.dustConversion.routeOverview.approveToken', {
          symbol,
        });
      }) ?? [];

    const labels = [
      ...approvalLabels,
      t('portfolio.dustConversion.routeOverview.swapTo', {
        symbol: nativeTokenBalance.token.symbol,
      }),
    ];

    return labels.map((label, index) => {
      const isCompleted =
        Boolean(actionHashes?.[index]) ||
        (currentActionIndex !== undefined && index < currentActionIndex);
      const status = isCompleted
        ? 'completed'
        : isExecuting && index === currentActionIndex
          ? 'executing'
          : 'pending';

      const txHash = actionHashes?.[index];
      const explorerUrl =
        txHash && chainId ? getExplorerUrl(chainId, txHash) : undefined;

      return { label, status, explorerUrl };
    });
  }, [
    composerQuote,
    nativeTokenBalance,
    selectedInputBalances,
    currentActionIndex,
    isExecuting,
    actionHashes,
    chainId,
    getExplorerUrl,
    t,
  ]);

  if (
    !composerQuote ||
    selectedInputBalances.length === 0 ||
    !nativeTokenBalance
  ) {
    return null;
  }

  const header = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <AvatarItem
        avatar={{
          src: COMPOSER_ICON_SRC,
          alt: t('portfolio.dustConversion.routeOverview.composerAlt'),
          id: 'step',
        }}
        size={AvatarSize.XL}
      />
      <Box>
        <Typography variant="bodySmallStrong">
          {t('portfolio.dustConversion.routeOverview.composerViaLifi')}
        </Typography>
        <Typography variant="bodyXXSmall" color="textSecondary">
          {isExecuting
            ? t('portfolio.dustConversion.routeOverview.executingStep', {
                current: (currentActionIndex ?? 0) + 1,
                total: steps.length,
              })
            : t('portfolio.dustConversion.routeOverview.stepsCount', {
                count: steps.length,
              })}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Summary
      label={t('form.labels.convert')}
      from={selectedInputBalances}
      amountUSD={composerQuote.priceImpact.inputValueUsd}
      to={nativeTokenBalance}
      fieldSx={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
    >
      <ExpandableSection
        header={header}
        items={steps}
        isDetailsItemClickable={false}
        detailsItemSx={{
          padding: 0,
          '&.MuiStack-root:hover': { background: 'transparent' },
        }}
        sx={{
          '& .MuiAccordion-heading > .MuiButtonBase-root': { padding: 0 },
          '& .MuiCollapse-root': { paddingTop: 1 },
        }}
        renderItem={(step) => (
          <RouteStepOverview {...(step as RouteStepOverviewProps)} />
        )}
      />
    </Summary>
  );
};
