/**
 * @deprecated use the PortfolioFilterBar component instead
 */
'use client';

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Button,
  OutlinedInput,
  Typography,
  TextField,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useTokensFiltering } from './TokensFilteringContext';
import { SortByOptions } from '@/app/ui/portfolio/types';

export const TokensFilterControls = () => {
  const {
    filter,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    allWallets,
    allChains,
    allAssets,
    allValueRange,
  } = useTokensFiltering();

  const handleWalletsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    updateFilter({
      tokensWallets: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleChainsChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    updateFilter({
      tokensChains: typeof value === 'string' ? [] : value,
    });
  };

  const handleAssetsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    updateFilter({
      tokensAssets: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value as typeof sortBy);
  };

  const handleMinValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : null;
    updateFilter({ tokensMinValue: value });
  };

  const handleMaxValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : null;
    updateFilter({ tokensMaxValue: value });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {/* Wallets Filter */}
        {allWallets.length > 1 && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Wallets</InputLabel>
            <Select
              multiple
              value={filter.tokensWallets ?? []}
              onChange={handleWalletsChange}
              input={<OutlinedInput label="Wallets" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((address) => (
                    <Chip
                      key={address}
                      label={`${address.slice(0, 6)}...${address.slice(-4)}`}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {allWallets.map((wallet) => (
                <MenuItem key={wallet.address} value={wallet.address}>
                  {`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Chains Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Chains</InputLabel>
          <Select
            multiple
            value={filter.tokensChains ?? []}
            onChange={handleChainsChange}
            input={<OutlinedInput label="Chains" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((chainId) => {
                  const chain = allChains.find((c) => c.chainId === chainId);
                  return (
                    <Chip
                      key={chainId}
                      label={chain?.chainKey || chainId}
                      size="small"
                    />
                  );
                })}
              </Box>
            )}
          >
            {allChains.map((chain) => (
              <MenuItem key={chain.chainId} value={chain.chainId}>
                {chain.chainKey}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Assets Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Assets</InputLabel>
          <Select
            multiple
            value={filter.tokensAssets ?? []}
            onChange={handleAssetsChange}
            input={<OutlinedInput label="Assets" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((address) => {
                  const asset = allAssets.find((a) => a.address === address);
                  return (
                    <Chip
                      key={address}
                      label={asset?.symbol || address}
                      size="small"
                    />
                  );
                })}
              </Box>
            )}
          >
            {allAssets.slice(0, 50).map((asset) => (
              <MenuItem key={asset.address} value={asset.address}>
                {asset.symbol} - {asset.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Value Range Filter */}
        <TextField
          size="small"
          label="Min Value ($)"
          type="number"
          value={filter.tokensMinValue ?? ''}
          onChange={handleMinValueChange}
          sx={{ width: 120 }}
          InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        />
        <TextField
          size="small"
          label="Max Value ($)"
          type="number"
          value={filter.tokensMaxValue ?? ''}
          onChange={handleMaxValueChange}
          sx={{ width: 120 }}
          InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        />

        {/* Sort By */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={handleSortChange} label="Sort By">
            <MenuItem value={SortByOptions.VALUE}>Value</MenuItem>
            <MenuItem value={SortByOptions.CHAIN}>Chain</MenuItem>
            <MenuItem value={SortByOptions.ASSET}>Asset</MenuItem>
          </Select>
        </FormControl>

        {/* Clear Filters */}
        <Button variant="outlined" size="small" onClick={clearFilters}>
          Clear Filters
        </Button>
      </Stack>

      {/* Value Range Info */}
      {allValueRange.max > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Value range: ${allValueRange.min.toFixed(2)} - $
          {allValueRange.max.toFixed(2)}
        </Typography>
      )}
    </Box>
  );
};
