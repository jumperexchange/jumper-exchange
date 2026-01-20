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
  Button,
} from '@mui/material';
import { useState } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { usePositionUpdate } from '@/providers/PortfolioProvider/hooks/usePositionUpdate';
import type { Hex } from 'viem';
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
    summary.totalAmountUSD > 0
      ? (summary.tokensAmountUSD / summary.totalAmountUSD) * 100
      : 0;
  const positionsPercentage =
    summary.totalAmountUSD > 0
      ? (summary.positionsAmountUSD / summary.totalAmountUSD) * 100
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
              {formatUSD(summary.totalAmountUSD)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={4}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Tokens
              </Typography>
              <Typography variant="h6">
                {formatUSD(summary.tokensAmountUSD)}
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
                {formatUSD(summary.positionsAmountUSD)}
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
                          {formatUSD(token.amountUSD)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ minWidth: 45, textAlign: 'right' }}
                        >
                          {token.percentageOfTotalAmountUSD.toFixed(1)}%
                        </Typography>
                      </Stack>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={token.percentageOfTotalAmountUSD}
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
                            {formatUSD(position.amountUSD)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ minWidth: 45, textAlign: 'right' }}
                          >
                            {position.percentageOfTotalAmountUSD.toFixed(1)}%
                          </Typography>
                        </Stack>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={position.percentageOfTotalAmountUSD}
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
    <Stack spacing={1} sx={{ maxHeight: 400, overflow: 'auto' }}>
      {tokens.slice(0, 20).map((token, index) => (
        <Box
          key={`${token.chain?.chainId}-${token.address}-${index}`}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
            borderRadius: 1,
            bgcolor: 'action.hover',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {token.logo && (
              <Box
                component="img"
                src={token.logo}
                alt={token.symbol}
                sx={{ width: 32, height: 32, borderRadius: '50%' }}
              />
            )}
            <Box>
              <Typography variant="body1">{token.symbol}</Typography>
              <Typography variant="caption" color="text.secondary">
                {token.chain?.chainKey}
                {token.relatedTokens && token.relatedTokens.length > 0 && (
                  <> (+{token.relatedTokens.length} chains)</>
                )}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2">
              {formatUSD(token.amountUSD ?? 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {token.amount?.toFixed(4)} {token.symbol}
            </Typography>
          </Box>
        </Box>
      ))}
      {tokens.length > 20 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', py: 1 }}
        >
          ... and {tokens.length - 20} more tokens
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
  const { account } = useAccount();
  const { updatePositionFromContract, isUpdating } = usePositionUpdate();
  const {
    data: groups,
    isLoading,
    isAllDataEmpty,
  } = useDeFiPositionsFiltering();

  const [updatingPositionKey, setUpdatingPositionKey] = useState<string | null>(
    null,
  );

  const handleUpdatePosition = async (position: {
    lpToken?: { address: string; chain?: { chainId: number } };
  }) => {
    if (
      !account?.address ||
      !position.lpToken?.address ||
      !position.lpToken?.chain?.chainId
    ) {
      return;
    }

    const positionKey = `${position.lpToken.chain.chainId}-${position.lpToken.address}`;
    setUpdatingPositionKey(positionKey);

    try {
      await updatePositionFromContract({
        walletAddress: account.address as Hex,
        chainId: position.lpToken.chain.chainId,
        lpTokenAddress: position.lpToken.address as Hex,
      });
    } finally {
      setUpdatingPositionKey(null);
    }
  };

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
      {groups.map((group) => (
        <Box
          key={group.key}
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: 'action.hover',
          }}
        >
          {/* Group Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {group.protocol?.logo && (
                <Box
                  component="img"
                  src={group.protocol.logo}
                  alt={group.protocol.name}
                  sx={{ width: 28, height: 28, borderRadius: '50%' }}
                />
              )}
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {group.protocol?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {group.chain?.chainKey} · {group.positions.length} position
                  {group.positions.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Stack>
            <Typography variant="h6">{formatUSD(group.totalNetUsd)}</Typography>
          </Stack>

          <Divider sx={{ my: 1 }} />

          {/* Positions within group */}
          <Stack spacing={1}>
            {group.positions.map((position, index) => {
              const positionKey = position.lpToken
                ? `${position.lpToken.chain?.chainId}-${position.lpToken.address}`
                : null;
              const isThisUpdating =
                positionKey && updatingPositionKey === positionKey;
              const hasLpToken = Boolean(
                position.lpToken?.address && position.lpToken?.chain?.chainId,
              );

              return (
                <Box
                  key={`${position.type}-${index}`}
                  sx={{
                    pl: 2,
                    py: 0.5,
                    borderLeft: 2,
                    borderColor: 'divider',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={position.type}
                        size="small"
                        variant="outlined"
                      />
                      <Stack direction="row" spacing={0.5}>
                        {position.supplyTokens?.slice(0, 3).map((token, i) => (
                          <Chip
                            key={`supply-${i}`}
                            label={token.symbol}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Stack>
                      {position.lpToken && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          LP: {position.lpToken.symbol}
                        </Typography>
                      )}
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {hasLpToken && account?.address && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleUpdatePosition(position)}
                          disabled={isUpdating}
                          sx={{ minWidth: 'auto', px: 1, py: 0.25 }}
                        >
                          {isThisUpdating ? (
                            <CircularProgress size={14} />
                          ) : (
                            'Update'
                          )}
                        </Button>
                      )}
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">
                          {formatUSD(position.netUsd ?? 0)}
                        </Typography>
                        {position.debtUsd > 0 && (
                          <Typography variant="caption" color="error.main">
                            Debt: {formatUSD(position.debtUsd)}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Box>
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
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Portfolio Test Page
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        This page displays data from the new PortfolioProvider architecture.
      </Typography>

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
  );
};

export const PortfolioTestPage = () => {
  return (
    <PortfolioProvider>
      <PortfolioTestContent />
    </PortfolioProvider>
  );
};
