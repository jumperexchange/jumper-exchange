'use client';

import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { HorizontalTabs } from '@/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from '@/components/HorizontalTabs/HorizontalTabs.style';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { MultiSelectView } from '@/components/composite/MultiLayer/views/MultiSelectView';
import { SingleSelectView } from '@/components/composite/MultiLayer/views/SingleSelectView';
import {
  createMultiSelectCategory,
  createSingleSelectCategory,
} from '@/components/composite/MultiLayer/utils';
import type {
  CategoryOption,
  RendererSlotProps,
} from '@/components/composite/MultiLayer/MultiLayer.types';
import { SelectBadge } from '@/components/core/form/Select/components/SelectBadge';
import {
  StyledMultiSelectFiltersClearButton,
  StyledMultiSelectFiltersContainer,
} from '@/components/core/form/Select/Select.styles';
import {
  countBadge,
  mergeChainTokenSelection,
  selectExclusiveFilter,
} from '../utils';
import { Typography } from '@mui/material';

type FilterTab = 'chains' | 'assets';

export interface TransactionAssetsFilterPanelProps {
  chains: string[];
  assets: string[];
  chainOptions: CategoryOption<string>[];
  tokenOptionsByChain: Map<string, CategoryOption<string>[]>;
  onChainsChange: (chains: string[]) => void;
  onAssetsChange: (assets: string[]) => void;
  slotProps?: RendererSlotProps;
}

export const TransactionAssetsFilterPanel = ({
  chains,
  assets,
  chainOptions,
  tokenOptionsByChain,
  onChainsChange,
  onAssetsChange,
  slotProps,
}: TransactionAssetsFilterPanelProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<FilterTab>(
    assets.length > 0 ? 'assets' : 'chains',
  );
  const [selectedChainId, setSelectedChainId] = useState<string | null>(null);

  const selectedChainOption = selectedChainId
    ? chainOptions.find((o) => o.value === selectedChainId)
    : undefined;
  const selectedChainLabel = selectedChainOption?.label ?? '';
  const selectedChainPrefix = `${selectedChainId}:`;
  const selectedChainAssets = assets.filter((a) =>
    a.startsWith(selectedChainPrefix),
  );

  const assetChainOptions = chainOptions
    .filter((option) => tokenOptionsByChain.has(option.value))
    .map((option) => {
      const badge = countBadge(
        assets.filter((a) => a.startsWith(`${option.value}:`)).length,
      );
      return {
        ...option,
        endAdornment: badge ? (
          <SelectBadge label={badge} sx={{ mr: 0 }} />
        ) : undefined,
      };
    });

  const tabsRow = (
    <Stack direction="column" sx={{ width: '100%', gap: 1 }}>
      <HorizontalTabs
        size={HorizontalTabSize.SM}
        value={activeTab}
        onChange={(_, tab) => setActiveTab(tab as FilterTab)}
        id="portfolio-filter-transaction-assets-tabs"
        tabs={[
          {
            value: 'chains',
            label: t('portfolio.filter.byChain'),
            'data-testid': 'portfolio-filter-transaction-assets-tab-chains',
            ...(chains.length > 0 && {
              endAdornment: (
                <Badge
                  size={BadgeSize.XS}
                  variant={BadgeVariant.Secondary}
                  label={String(chains.length)}
                />
              ),
            }),
          },
          {
            value: 'assets',
            label: t('portfolio.filter.byAsset'),
            'data-testid': 'portfolio-filter-transaction-assets-tab-assets',
            ...(assets.length > 0 && {
              endAdornment: (
                <Badge
                  size={BadgeSize.XS}
                  variant={BadgeVariant.Secondary}
                  label={String(assets.length)}
                />
              ),
            }),
          },
        ]}
        sx={{
          minHeight: 'fit-content',
          '.MuiTab-root.MuiButtonBase-root, .MuiTabs-indicator': {
            width: '50%',
            maxWidth: '50%',
          },
        }}
      />
      <Typography variant="bodyXSmall" color="textSecondary">
        {t('portfolio.filter.byChainOrAssetDisclaimer')}
      </Typography>
    </Stack>
  );

  return (
    <Stack direction="column" sx={{ width: '100%', gap: 2 }}>
      {activeTab === 'chains' ? (
        <MultiSelectView
          category={createMultiSelectCategory({
            id: 'tx-filter-chains',
            label: t('portfolio.filter.chains'),
            value: chains,
            onChange: (v) => {
              const next = selectExclusiveFilter(v, assets);
              onChainsChange(next.selected);
              onAssetsChange(next.sibling);
            },
            options: chainOptions,
            searchable: true,
            searchPlaceholder: t('portfolio.filter.search', {
              filterBy: t('portfolio.filter.chains').toLowerCase(),
            }),
            testId: 'portfolio-filter-transaction-chain-select',
          })}
          slotProps={{ ...slotProps, tabs: tabsRow }}
        />
      ) : selectedChainId === null ? (
        <SingleSelectView
          category={createSingleSelectCategory({
            id: 'tx-filter-asset-chain',
            label: t('portfolio.filter.chains'),
            searchable: true,
            searchPlaceholder: t('portfolio.filter.search', {
              filterBy: t('portfolio.filter.chains').toLowerCase(),
            }),
            options: assetChainOptions,
            onChange: (chainId) => {
              if (chainId) {
                setSelectedChainId(chainId);
              }
            },
            testId: 'portfolio-filter-transaction-asset-chain-select',
          })}
          slotProps={{
            ...slotProps,
            tabs: tabsRow,
            header: (
              <StyledMultiSelectFiltersContainer sx={{ padding: 0, margin: 0 }}>
                <Typography variant="bodyMediumStrong" sx={{ flex: 1 }}>
                  {t('earn.filter.selected', { count: assets.length })}
                </Typography>
                <StyledMultiSelectFiltersClearButton
                  disabled={assets.length === 0}
                  data-testid="portfolio-filter-transaction-asset-chain-clear-button"
                  onClick={() => onAssetsChange([])}
                  size={slotProps?.clearButtonSize ?? 'medium'}
                >
                  {t('earn.filter.clear')}
                </StyledMultiSelectFiltersClearButton>
              </StyledMultiSelectFiltersContainer>
            ),
          }}
        />
      ) : (
        <MultiSelectView
          category={createMultiSelectCategory({
            id: `tx-filter-assets-${selectedChainId}`,
            label: selectedChainLabel,
            value: selectedChainAssets,
            onChange: (newChainAssets) => {
              const merged = mergeChainTokenSelection(
                assets,
                selectedChainPrefix,
                newChainAssets,
              );
              const next = selectExclusiveFilter(merged, chains);
              onAssetsChange(next.selected);
              onChainsChange(next.sibling);
            },
            options: tokenOptionsByChain.get(selectedChainId) ?? [],
            searchable: true,
            searchPlaceholder: t('portfolio.filter.search', {
              filterBy: selectedChainLabel,
            }),
            testId: 'portfolio-filter-transaction-asset-select',
          })}
          slotProps={{
            ...slotProps,
            onBack: () => setSelectedChainId(null),
            tabs: tabsRow,
            header: (
              <Badge
                size={BadgeSize.XS}
                variant={BadgeVariant.Alpha}
                label={selectedChainLabel}
              />
            ),
          }}
        />
      )}
    </Stack>
  );
};
