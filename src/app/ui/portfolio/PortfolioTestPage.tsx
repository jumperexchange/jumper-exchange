/**
 * @deprecated use the PortfolioFilterBar component instead
 */
'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
} from '@mui/material';
import { PortfolioProvider } from '@/providers/PortfolioProvider/PortfolioProvider';
import {
  usePortfolioState,
  usePortfolioSummary,
  usePortfolioTokens,
  usePortfolioPositions,
} from '@/providers/PortfolioProvider/PortfolioContext';
import { DeFiPositionsFilteringProvider } from '@/providers/PortfolioProvider/filtering/DeFiPositionsFilteringContext';
import { TokensFilteringProvider } from '@/providers/PortfolioProvider/filtering/TokensFilteringContext';
import { useTokensFiltering } from '@/providers/PortfolioProvider/filtering/TokensFilteringContext';
import { TokensFilterControls } from '@/providers/PortfolioProvider/filtering/TokensFilterControls';
import { useDeFiPositionsFiltering } from '@/providers/PortfolioProvider/filtering/DeFiPositionsFilteringContext';
import { DeFiPositionsFilterControls } from '@/providers/PortfolioProvider/filtering/DeFiPositionsFilterControls';
import { TokenListCard } from '@/components/composite/TokenListCard/TokenListCard';
import { TokenListCardTokenSize } from '@/components/composite/TokenListCard/TokenListCard.types';
import { DeFiPositionCard } from './new-components/DeFiPositionCard/DeFiPositionCard';
import { useFormatDisplayWalletTokens } from '@/hooks/portfolio/useFormatDisplayWalletTokens';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import { useRouter } from 'next/navigation';
import { PortfolioAssetsSection } from './new-components/PortfolioAssetsSection';
import { PortfolioHeaderSection } from './new-components/PortfolioHeaderSection';

const formatUSD = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatTimestamp = (timestamp: number | null) => {
  if (!timestamp) {
    return 'Never';
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp));
};

const SummaryCard = () => {
  const summary = usePortfolioSummary();
  const state = usePortfolioState();

  const tokensPercentage =
    summary.totalValueUSD > 0
      ? (summary.tokensValueUSD / summary.totalValueUSD) * 100
      : 0;
  const positionsPercentage =
    summary.totalValueUSD > 0
      ? (summary.positionsValueUSD / summary.totalValueUSD) * 100
      : 0;

  if (state.isLoading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={24} />
            <Typography>Loading summary...</Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Portfolio Summary
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Value
            </Typography>
            <Typography variant="h4">
              {formatUSD(summary.totalValueUSD)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={4}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Tokens
              </Typography>
              <Typography variant="h6">
                {formatUSD(summary.tokensValueUSD)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {tokensPercentage.toFixed(1)}%
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                DeFi Positions
              </Typography>
              <Typography variant="h6">
                {formatUSD(summary.positionsValueUSD)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {positionsPercentage.toFixed(1)}%
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Chip
              label={`${summary.tokensBySymbol.length} Token Groups`}
              size="small"
            />
            <Chip
              label={`${summary.positionsByProtocol.length} Protocols`}
              size="small"
            />
          </Stack>

          {summary.tokensBySymbol.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Top Tokens by Symbol
              </Typography>
              <Stack spacing={1}>
                {summary.tokensBySymbol.slice(0, 5).map((token, index) => (
                  <Box key={`${token.symbol}-${index}`}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        {token.logo && (
                          <Box
                            component="img"
                            src={token.logo}
                            alt={token.symbol}
                            sx={{ width: 20, height: 20, borderRadius: '50%' }}
                          />
                        )}
                        <Typography variant="body2">{token.symbol}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body2">
                          {formatUSD(token.totalValueUSD)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ minWidth: 45, textAlign: 'right' }}
                        >
                          {token.percentageOfTotalValueUSD.toFixed(1)}%
                        </Typography>
                      </Stack>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={token.percentageOfTotalValueUSD}
                      sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {summary.positionsByProtocol.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Top Protocols
              </Typography>
              <Stack spacing={1}>
                {summary.positionsByProtocol
                  .slice(0, 5)
                  .map((position, index) => (
                    <Box key={`${position.protocol?.name}-${index}`}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          {position.protocol?.logo && (
                            <Box
                              component="img"
                              src={position.protocol.logo}
                              alt={position.protocol.name}
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                              }}
                            />
                          )}
                          <Typography variant="body2">
                            {position.protocol?.name}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2">
                            {formatUSD(position.totalValueUSD)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ minWidth: 45, textAlign: 'right' }}
                          >
                            {position.percentageOfTotalValueUSD.toFixed(1)}%
                          </Typography>
                        </Stack>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={position.percentageOfTotalValueUSD}
                        sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                      />
                    </Box>
                  ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const TokensList = () => {
  const { data: tokens, isLoading, isEmpty } = useTokensFiltering();
  const router = useRouter();
  const setFrom = useWidgetCacheStore((state) => state.setFrom);

  const formattedTokens = useFormatDisplayWalletTokens(tokens);

  const handleSelectToken = (token: any) => {
    setFrom(token.address, token.chain.chainId);
    router.push('/');
  };

  if (isLoading) {
    return (
      <Stack alignItems="center" spacing={2}>
        <CircularProgress size={24} />
        <Typography>Loading tokens...</Typography>
      </Stack>
    );
  }

  if (isEmpty) {
    return (
      <Typography color="text.secondary">
        No tokens found. Connect a wallet to see your tokens.
      </Typography>
    );
  }

  if (tokens.length === 0) {
    return (
      <Typography color="text.secondary">
        No tokens match the current filters.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5} sx={{ maxHeight: 500, overflow: 'auto' }}>
      {tokens.slice(0, 20).map((token, index) => (
        <TokenListCard
          key={`${token.address}-${token.chain.chainId}-${index}`}
          size={TokenListCardTokenSize.MD}
          token={token}
          onSelect={handleSelectToken}
        />
      ))}
      {tokens.length > 20 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', py: 1 }}
        >
          ... and {formattedTokens.length - 20} more tokens
        </Typography>
      )}
    </Stack>
  );
};

const TokensSection = () => {
  const { allChains } = useTokensFiltering();
  const { updatedAt } = usePortfolioTokens();

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="h6">Tokens</Typography>
          <Typography variant="caption" color="text.secondary">
            Updated: {formatTimestamp(updatedAt)}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Chains: {allChains.map((c) => c.chainKey).join(', ') || 'None'}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <TokensFilterControls />
        <Divider sx={{ my: 2 }} />
        <TokensList />
      </CardContent>
    </Card>
  );
};

const PositionsList = () => {
  const {
    data: groups,
    isLoading,
    isAllDataEmpty,
  } = useDeFiPositionsFiltering();

  if (isLoading) {
    return (
      <Stack alignItems="center" spacing={2}>
        <CircularProgress size={24} />
        <Typography>Loading positions...</Typography>
      </Stack>
    );
  }

  if (isAllDataEmpty) {
    return (
      <Typography color="text.secondary">No DeFi positions found.</Typography>
    );
  }

  if (groups.length === 0) {
    return (
      <Typography color="text.secondary">
        No positions match the current filters.
      </Typography>
    );
  }

  return (
    <Stack spacing={2} sx={{ maxHeight: 500, overflow: 'auto' }}>
      {groups.map((group, index) => (
        <DeFiPositionCard
          key={`${group.protocol?.name}-${group.chain?.chainId}-${index}`}
          defiPositions={group.positions}
          isLoading={isLoading}
        />
      ))}
    </Stack>
  );
};

const PositionsSection = () => {
  const { allProtocols } = useDeFiPositionsFiltering();
  const { updatedAt } = usePortfolioPositions();

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="h6">DeFi Positions</Typography>
          <Typography variant="caption" color="text.secondary">
            Updated: {formatTimestamp(updatedAt)}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Protocols: {allProtocols.map((p) => p.name).join(', ') || 'None'}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <DeFiPositionsFilterControls />
        <Divider sx={{ my: 2 }} />
        <PositionsList />
      </CardContent>
    </Card>
  );
};

const PortfolioTestContent = () => {
  const state = usePortfolioState();

  return (
    <>
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Portfolio Test Page
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          This page displays data from the new PortfolioProvider architecture.
        </Typography>
      </Box>

      <PortfolioHeaderSection />

      <PortfolioAssetsSection />

      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        {state.hasError && (
          <Card sx={{ mb: 3, bgcolor: 'error.dark' }}>
            <CardContent>
              <Typography color="error.contrastText">
                Error loading portfolio data. Please try again.
              </Typography>
            </CardContent>
          </Card>
        )}

        <Divider sx={{ my: 3 }} />

        <SummaryCard />

        <TokensFilteringProvider>
          <TokensSection />
        </TokensFilteringProvider>
        <DeFiPositionsFilteringProvider>
          <PositionsSection />
        </DeFiPositionsFilteringProvider>
      </Box>
    </>
  );
};

export const PortfolioTestPage = () => {
  return (
    <PortfolioProvider>
      <PortfolioTestContent />
    </PortfolioProvider>
  );
};
