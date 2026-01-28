'use client';

import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  FormControl,
  FormGroup,
  FormLabel,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Stack,
} from '@mui/material';
import {
  usePortfolioBalances,
  usePortfolioPositions,
  usePortfolioSummary,
  usePortfolioState,
} from '@/providers/PortfolioProvider/PortfolioContext';
import { useBalancesFiltering } from '@/providers/PortfolioProvider/filtering/BalancesFilteringContext';
import { usePositionsFiltering } from '@/providers/PortfolioProvider/filtering/PositionsFilteringContext';

const safeStringify = (obj: unknown, indent = 2): string => {
  return JSON.stringify(
    obj,
    (_key, value) => (typeof value === 'bigint' ? value.toString() : value),
    indent,
  );
};

export const PortfolioTestPage = () => {
  const balancesState = usePortfolioBalances();
  const positionsState = usePortfolioPositions();
  const summaryState = usePortfolioSummary();
  const orchestrationState = usePortfolioState();
  const balancesFiltering = useBalancesFiltering();
  const positionsFiltering = usePositionsFiltering();

  const balancesSourceState = orchestrationState.sources.balances;
  const positionsSourceState = orchestrationState.sources.positions;

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Portfolio Test Page
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Summary
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            Total Balances: ${summaryState.totalBalancesUsd.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            Total Positions: ${summaryState.totalPositionsUsd.toFixed(2)}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Total Portfolio: ${summaryState.totalPortfolioUsd.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          Balances by Address (with percentages)
        </Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: 300,
            fontSize: 12,
          }}
        >
          {safeStringify(
            Object.entries(summaryState.balancesByAddress).map(
              ([address, data]) => ({
                address,
                totalUsd: data.totalUsd.toFixed(2),
                percentage: data.percentage.toFixed(2) + '%',
                balances: data.balances.map((b) => ({
                  symbol: b.token.symbol,
                  amountUSD: b.amountUSD.toFixed(2),
                  percentage: b.percentage.toFixed(2) + '%',
                })),
              }),
            ),
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          Positions by Protocol (with percentages)
        </Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: 300,
            fontSize: 12,
          }}
        >
          {safeStringify(
            Object.entries(summaryState.positionsByProtocol).map(
              ([protocol, data]) => ({
                protocol,
                totalUsd: data.totalUsd.toFixed(2),
                percentage: data.percentage.toFixed(2) + '%',
                positions: data.positions.map((p) => ({
                  name: p.name,
                  netUsd: p.netUsd.toFixed(2),
                  percentage: p.percentage.toFixed(2) + '%',
                })),
              }),
            ),
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Balances Filters
        </Typography>

        <Stack spacing={3}>
          <FormControl fullWidth>
            <FormLabel>Sort By</FormLabel>
            <Select
              value={balancesFiltering.sortBy}
              onChange={(e) =>
                balancesFiltering.setSortBy(
                  e.target.value as typeof balancesFiltering.sortBy,
                )
              }
            >
              <MenuItem value="value">Value</MenuItem>
              <MenuItem value="chain">Chain</MenuItem>
              <MenuItem value="asset">Asset</MenuItem>
            </Select>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend">Wallets</FormLabel>
            <FormGroup>
              {balancesFiltering.allWallets.map((wallet) => (
                <FormControlLabel
                  key={wallet}
                  control={
                    <Checkbox
                      checked={balancesFiltering.filter.wallets?.includes(
                        wallet,
                      )}
                      onChange={(e) => {
                        const currentWallets =
                          balancesFiltering.filter.wallets || [];
                        const newWallets = e.target.checked
                          ? [...currentWallets, wallet]
                          : currentWallets.filter((w) => w !== wallet);
                        balancesFiltering.updateFilter({
                          wallets: newWallets.length > 0 ? newWallets : null,
                        });
                      }}
                    />
                  }
                  label={wallet.slice(0, 10) + '...'}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend">Chains</FormLabel>
            <FormGroup>
              {balancesFiltering.allChains.map((chainId) => (
                <FormControlLabel
                  key={chainId}
                  control={
                    <Checkbox
                      checked={balancesFiltering.filter.chains?.includes(
                        chainId,
                      )}
                      onChange={(e) => {
                        const currentChains =
                          balancesFiltering.filter.chains || [];
                        const newChains = e.target.checked
                          ? [...currentChains, chainId]
                          : currentChains.filter((c) => c !== chainId);
                        balancesFiltering.updateFilter({
                          chains: newChains.length > 0 ? newChains : null,
                        });
                      }}
                    />
                  }
                  label={`Chain ${chainId}`}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend">Assets</FormLabel>
            <FormGroup sx={{ maxHeight: 200, overflow: 'auto' }}>
              {balancesFiltering.allAssets.map((asset) => (
                <FormControlLabel
                  key={asset}
                  control={
                    <Checkbox
                      checked={balancesFiltering.filter.assets?.includes(asset)}
                      onChange={(e) => {
                        const currentAssets =
                          balancesFiltering.filter.assets || [];
                        const newAssets = e.target.checked
                          ? [...currentAssets, asset]
                          : currentAssets.filter((a) => a !== asset);
                        balancesFiltering.updateFilter({
                          assets: newAssets.length > 0 ? newAssets : null,
                        });
                      }}
                    />
                  }
                  label={asset}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>
              Value Range: $
              {balancesFiltering.filter.minValue?.toFixed(2) ??
                balancesFiltering.allValueRange.min.toFixed(2)}{' '}
              - $
              {balancesFiltering.filter.maxValue?.toFixed(2) ??
                balancesFiltering.allValueRange.max.toFixed(2)}
            </FormLabel>
            <Slider
              value={[
                balancesFiltering.filter.minValue ??
                  balancesFiltering.allValueRange.min,
                balancesFiltering.filter.maxValue ??
                  balancesFiltering.allValueRange.max,
              ]}
              onChange={(_, newValue) => {
                const [min, max] = newValue as number[];
                balancesFiltering.updateFilter({
                  minValue:
                    min !== balancesFiltering.allValueRange.min ? min : null,
                  maxValue:
                    max !== balancesFiltering.allValueRange.max ? max : null,
                });
              }}
              min={balancesFiltering.allValueRange.min}
              max={balancesFiltering.allValueRange.max}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${value.toFixed(2)}`}
            />
          </FormControl>

          <Button
            variant="outlined"
            onClick={balancesFiltering.clearFilters}
            disabled={
              !balancesFiltering.filter.wallets &&
              !balancesFiltering.filter.chains &&
              !balancesFiltering.filter.assets &&
              !balancesFiltering.filter.minValue &&
              !balancesFiltering.filter.maxValue
            }
          >
            Clear Filters
          </Button>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Filtered: {Object.values(balancesFiltering.data).flat().length}{' '}
              balances ({Object.keys(balancesFiltering.data).length} symbols)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Loading: {String(balancesFiltering.isLoading)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Empty: {String(balancesFiltering.isEmpty)}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Balances (Filtered)
        </Typography>

        {balancesSourceState.isLoading && <CircularProgress size={24} />}

        {orchestrationState.error && (
          <Typography color="error">
            Error: {orchestrationState.error.message}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            isEmpty: {String(balancesSourceState.isEmpty)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            updatedAt:{' '}
            {balancesSourceState.updatedAt
              ? new Date(balancesSourceState.updatedAt).toISOString()
              : 'null'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            isRefreshing: {String(balancesSourceState.isRefreshing)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            isStale: {String(balancesSourceState.isStale)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          Filtered Balances (Grouped by Symbol)
        </Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: 400,
            fontSize: 12,
          }}
        >
          {safeStringify(
            Object.entries(balancesFiltering.data).map(
              ([symbol, balances]) => ({
                symbol,
                count: balances.length,
                totalUSD: balances
                  .reduce((sum, b) => sum + b.amountUSD, 0)
                  .toFixed(2),
                balances: balances.map((b) => ({
                  chainId: b.token.chainId,
                  amountUSD: b.amountUSD.toFixed(2),
                  address: b.token.address,
                })),
              }),
            ),
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Positions Filters
        </Typography>

        <Stack spacing={3}>
          <FormControl fullWidth>
            <FormLabel>Sort By</FormLabel>
            <Select
              value={positionsFiltering.sortBy}
              onChange={(e) =>
                positionsFiltering.setSortBy(
                  e.target.value as typeof positionsFiltering.sortBy,
                )
              }
            >
              <MenuItem value="value">Value</MenuItem>
              <MenuItem value="chain">Chain</MenuItem>
              <MenuItem value="asset">Asset</MenuItem>
            </Select>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend">Chains</FormLabel>
            <FormGroup>
              {positionsFiltering.allChains.map((chainId) => (
                <FormControlLabel
                  key={chainId}
                  control={
                    <Checkbox
                      checked={positionsFiltering.filter.chains?.includes(
                        chainId,
                      )}
                      onChange={(e) => {
                        const currentChains =
                          positionsFiltering.filter.chains || [];
                        const newChains = e.target.checked
                          ? [...currentChains, chainId]
                          : currentChains.filter((c) => c !== chainId);
                        positionsFiltering.updateFilter({
                          chains: newChains.length > 0 ? newChains : null,
                        });
                      }}
                    />
                  }
                  label={`Chain ${chainId}`}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend">Protocols</FormLabel>
            <FormGroup sx={{ maxHeight: 200, overflow: 'auto' }}>
              {positionsFiltering.allProtocols.map((protocol) => (
                <FormControlLabel
                  key={protocol}
                  control={
                    <Checkbox
                      checked={positionsFiltering.filter.protocols?.includes(
                        protocol,
                      )}
                      onChange={(e) => {
                        const currentProtocols =
                          positionsFiltering.filter.protocols || [];
                        const newProtocols = e.target.checked
                          ? [...currentProtocols, protocol]
                          : currentProtocols.filter((p) => p !== protocol);
                        positionsFiltering.updateFilter({
                          protocols:
                            newProtocols.length > 0 ? newProtocols : null,
                        });
                      }}
                    />
                  }
                  label={protocol}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend">Types</FormLabel>
            <FormGroup>
              {positionsFiltering.allTypes.map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      checked={positionsFiltering.filter.types?.includes(type)}
                      onChange={(e) => {
                        const currentTypes =
                          positionsFiltering.filter.types || [];
                        const newTypes = e.target.checked
                          ? [...currentTypes, type]
                          : currentTypes.filter((t) => t !== type);
                        positionsFiltering.updateFilter({
                          types: newTypes.length > 0 ? newTypes : null,
                        });
                      }}
                    />
                  }
                  label={type}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend">Assets</FormLabel>
            <FormGroup sx={{ maxHeight: 200, overflow: 'auto' }}>
              {positionsFiltering.allAssets.map((asset) => (
                <FormControlLabel
                  key={asset}
                  control={
                    <Checkbox
                      checked={positionsFiltering.filter.assets?.includes(
                        asset,
                      )}
                      onChange={(e) => {
                        const currentAssets =
                          positionsFiltering.filter.assets || [];
                        const newAssets = e.target.checked
                          ? [...currentAssets, asset]
                          : currentAssets.filter((a) => a !== asset);
                        positionsFiltering.updateFilter({
                          assets: newAssets.length > 0 ? newAssets : null,
                        });
                      }}
                    />
                  }
                  label={asset}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>
              Value Range: $
              {positionsFiltering.filter.minValue?.toFixed(2) ??
                positionsFiltering.allValueRange.min.toFixed(2)}{' '}
              - $
              {positionsFiltering.filter.maxValue?.toFixed(2) ??
                positionsFiltering.allValueRange.max.toFixed(2)}
            </FormLabel>
            <Slider
              value={[
                positionsFiltering.filter.minValue ??
                  positionsFiltering.allValueRange.min,
                positionsFiltering.filter.maxValue ??
                  positionsFiltering.allValueRange.max,
              ]}
              onChange={(_, newValue) => {
                const [min, max] = newValue as number[];
                positionsFiltering.updateFilter({
                  minValue:
                    min !== positionsFiltering.allValueRange.min ? min : null,
                  maxValue:
                    max !== positionsFiltering.allValueRange.max ? max : null,
                });
              }}
              min={positionsFiltering.allValueRange.min}
              max={positionsFiltering.allValueRange.max}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${value.toFixed(2)}`}
            />
          </FormControl>

          <Button
            variant="outlined"
            onClick={positionsFiltering.clearFilters}
            disabled={
              !positionsFiltering.filter.chains &&
              !positionsFiltering.filter.protocols &&
              !positionsFiltering.filter.types &&
              !positionsFiltering.filter.assets &&
              !positionsFiltering.filter.minValue &&
              !positionsFiltering.filter.maxValue
            }
          >
            Clear Filters
          </Button>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Filtered: {Object.values(positionsFiltering.data).flat().length}{' '}
              positions ({Object.keys(positionsFiltering.data).length} groups)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Loading: {String(positionsFiltering.isLoading)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Empty: {String(positionsFiltering.isEmpty)}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Positions (Filtered)
        </Typography>

        {positionsSourceState.isLoading && <CircularProgress size={24} />}

        {orchestrationState.error && (
          <Typography color="error">
            Error: {orchestrationState.error.message}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            isEmpty: {String(positionsSourceState.isEmpty)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            updatedAt:{' '}
            {positionsSourceState.updatedAt
              ? new Date(positionsSourceState.updatedAt).toISOString()
              : 'null'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            isRefreshing: {String(positionsSourceState.isRefreshing)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            isStale: {String(positionsSourceState.isStale)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total positions: {positionsState.positions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            LP Tokens: {positionsState.lpTokens.length}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          Positions by Protocol
        </Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: 300,
            fontSize: 12,
          }}
        >
          {safeStringify(
            Object.entries(positionsState.positionsByProtocol).map(
              ([protocol, positions]) => ({
                protocol,
                count: positions.length,
                totalNetUsd: positions.reduce((sum, p) => sum + p.netUsd, 0),
              }),
            ),
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          Positions by Protocol and Chain
        </Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: 300,
            fontSize: 12,
          }}
        >
          {safeStringify(
            Object.entries(positionsState.positionsByProtocolAndChain).map(
              ([key, positions]) => ({
                key,
                count: positions.length,
                totalNetUsd: positions.reduce((sum, p) => sum + p.netUsd, 0),
              }),
            ),
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          Filtered Positions (Grouped by Protocol and Chain)
        </Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: 400,
            fontSize: 12,
          }}
        >
          {safeStringify(
            Object.entries(positionsFiltering.data).map(([key, positions]) => ({
              key,
              count: positions.length,
              totalNetUsd: positions
                .reduce((sum, p) => sum + p.netUsd, 0)
                .toFixed(2),
              positions: positions.map((p) => ({
                protocol: p.protocol.name,
                name: p.name,
                type: p.type,
                netUsd: p.netUsd.toFixed(2),
                assetUsd: p.assetUsd.toFixed(2),
                debtUsd: p.debtUsd.toFixed(2),
              })),
            })),
          )}
        </Box>
      </Paper>
    </Box>
  );
};
