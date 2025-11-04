import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MultiLayerDrawer } from './MultiLayerDrawer';
import {
  CategoryConfig,
  CategoryContentType,
  CategoryOption,
} from './MultiLayerDrawer.types';
import { usePendingFilters } from './hooks/usePendingFilters';
import { useState } from 'react';
import Stack from '@mui/material/Stack';

const meta: Meta<typeof MultiLayerDrawer> = {
  title: 'Composite/MultiLayerDrawer',
  component: MultiLayerDrawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MultiLayerDrawer>;

// Simple mock options without external dependencies
const chainOptions: CategoryOption[] = [
  { value: '1', label: 'Ethereum' },
  { value: '42161', label: 'Arbitrum' },
  { value: '137', label: 'Polygon' },
  { value: '10', label: 'Optimism' },
  { value: '56', label: 'BSC' },
];

const protocolOptions: CategoryOption[] = [
  { value: 'aave', label: 'Aave' },
  { value: 'compound', label: 'Compound' },
  { value: 'lido', label: 'Lido' },
  { value: 'uniswap', label: 'Uniswap' },
];

const tagOptions: CategoryOption[] = [
  { value: 'stable', label: 'Stable Coin' },
  { value: 'liquid-staking', label: 'Liquid Staking' },
  { value: 'lending', label: 'Lending' },
  { value: 'farming', label: 'Yield Farming' },
];

const sortOptions: CategoryOption[] = [
  { value: 'apy', label: 'APY (Highest)' },
  { value: 'tvl', label: 'TVL (Highest)' },
  { value: 'popular', label: 'Most Popular' },
];

// Story 1: Basic Flat Structure
const FlatStructureTemplate = () => {
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [apyRange, setApyRange] = useState<number[]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('apy');

  const chainBadge =
    selectedChains.length > 0 ? selectedChains.length.toString() : undefined;
  const protocolBadge =
    selectedProtocols.length > 0
      ? selectedProtocols.length.toString()
      : undefined;
  const tagBadge =
    selectedTags.length > 0 ? selectedTags.length.toString() : undefined;
  const apyBadge = apyRange[0] !== 0 || apyRange[1] !== 100 ? '1' : undefined;

  const categories: CategoryConfig[] = [
    {
      id: 'chain',
      label: 'Chain',
      badgeLabel: chainBadge,
      contentType: CategoryContentType.MultiSelect,
      value: selectedChains,
      onChange: setSelectedChains,
      options: chainOptions,
      searchable: true,
      searchPlaceholder: 'Search chains...',
      testId: 'chain-view',
    },
    {
      id: 'protocol',
      label: 'Protocol',
      badgeLabel: protocolBadge,
      contentType: CategoryContentType.MultiSelect,
      value: selectedProtocols,
      onChange: setSelectedProtocols,
      options: protocolOptions,
      searchable: true,
      searchPlaceholder: 'Search protocols...',
      testId: 'protocol-view',
    },
    {
      id: 'tag',
      label: 'Tag',
      badgeLabel: tagBadge,
      contentType: CategoryContentType.MultiSelect,
      value: selectedTags,
      onChange: setSelectedTags,
      options: tagOptions,
      searchable: false,
      testId: 'tag-view',
    },
    {
      id: 'apy',
      label: 'APY',
      badgeLabel: apyBadge,
      contentType: CategoryContentType.Slider,
      value: apyRange,
      onChange: setApyRange,
      min: 0,
      max: 100,
      testId: 'apy-view',
    },
    {
      id: 'sortBy',
      label: 'Sort By',
      contentType: CategoryContentType.SingleSelect,
      value: sortBy,
      onChange: setSortBy,
      options: sortOptions,
      testId: 'sort-view',
    },
  ];

  return (
    <Stack gap={2} sx={{ width: 400, padding: 3 }}>
      <MultiLayerDrawer
        categories={categories}
        title="Filter & Sort"
        applyButtonLabel="Apply Filters"
        clearButtonLabel="Clear All"
        onApply={() => console.log('Applied views')}
        onClear={() => {
          setSelectedChains([]);
          setSelectedProtocols([]);
          setSelectedTags([]);
          setApyRange([0, 100]);
          setSortBy('apy');
        }}
        testId="flat-structure-drawer"
      />
    </Stack>
  );
};

export const FlatStructure: Story = {
  render: () => <FlatStructureTemplate />,
};

// Story 2: With Pending Filters (Mobile UX Pattern)
const WithPendingFiltersTemplate = () => {
  const {
    pendingValues,
    setPendingValue,
    applyFilters,
    clearAll,
    hasFiltersApplied,
  } = usePendingFilters({
    initialValues: {
      chains: [] as string[],
      protocols: [] as string[],
      apy: [0, 100] as number[],
      sortBy: 'apy' as string,
    },
    onApply: (values) => {
      console.log('Applying views:', values);
      alert(`Views applied! Check console for values.`);
    },
    onClear: () => {
      console.log('Clearing all views');
    },
    isFilterApplied: (values) => {
      return (
        values.chains.length > 0 ||
        values.protocols.length > 0 ||
        values.apy[0] !== 0 ||
        values.apy[1] !== 100
      );
    },
  });

  const chainBadge =
    pendingValues.chains.length > 0
      ? pendingValues.chains.length.toString()
      : undefined;
  const protocolBadge =
    pendingValues.protocols.length > 0
      ? pendingValues.protocols.length.toString()
      : undefined;
  const apyBadge =
    pendingValues.apy[0] !== 0 || pendingValues.apy[1] !== 100
      ? '1'
      : undefined;

  const categories: CategoryConfig[] = [
    {
      id: 'chain',
      label: 'Chain',
      badgeLabel: chainBadge,
      contentType: CategoryContentType.MultiSelect,
      value: pendingValues.chains,
      onChange: (value: string[]) => setPendingValue('chains', value),
      options: chainOptions,
      searchable: true,
      testId: 'chain-view-pending',
    },
    {
      id: 'protocol',
      label: 'Protocol',
      badgeLabel: protocolBadge,
      contentType: CategoryContentType.MultiSelect,
      value: pendingValues.protocols,
      onChange: (value: string[]) => setPendingValue('protocols', value),
      options: protocolOptions,
      searchable: true,
      testId: 'protocol-view-pending',
    },
    {
      id: 'apy',
      label: 'APY Range',
      badgeLabel: apyBadge,
      contentType: CategoryContentType.Slider,
      value: pendingValues.apy,
      onChange: (value: number[]) => setPendingValue('apy', value),
      min: 0,
      max: 100,
      testId: 'apy-view-pending',
    },
    {
      id: 'sortBy',
      label: 'Sort By',
      contentType: CategoryContentType.SingleSelect,
      value: pendingValues.sortBy,
      onChange: (value: string) => setPendingValue('sortBy', value),
      options: sortOptions,
      testId: 'sort-view-pending',
    },
  ];

  return (
    <Stack gap={2} sx={{ width: 400, padding: 3 }}>
      <MultiLayerDrawer
        categories={categories}
        title="Filter & Sort"
        applyButtonLabel="Apply Filters"
        clearButtonLabel="Clear All"
        onApply={applyFilters}
        onClear={clearAll}
        disableClear={!hasFiltersApplied}
        disableApply={!hasFiltersApplied}
        testId="pending-filters-drawer"
      />
    </Stack>
  );
};

export const WithPendingFilters: Story = {
  render: () => <WithPendingFiltersTemplate />,
};

// Story 3: Nested Categories (Multi-Layer)
const NestedStructureTemplate = () => {
  const [ethChains, setEthChains] = useState<string[]>([]);
  const [l2Chains, setL2Chains] = useState<string[]>([]);
  const [protocols, setProtocols] = useState<string[]>([]);

  const categories: CategoryConfig[] = [
    {
      id: 'blockchain',
      label: 'Blockchain Networks',
      badgeLabel:
        ethChains.length + l2Chains.length > 0
          ? (ethChains.length + l2Chains.length).toString()
          : undefined,
      subcategories: [
        {
          id: 'ethereum',
          label: 'Ethereum Mainnet',
          badgeLabel:
            ethChains.length > 0 ? ethChains.length.toString() : undefined,
          contentType: CategoryContentType.MultiSelect,
          value: ethChains,
          onChange: setEthChains,
          options: [{ value: '1', label: 'Ethereum' }],
          testId: 'ethereum-view',
        },
        {
          id: 'layer2',
          label: 'Layer 2 Solutions',
          badgeLabel:
            l2Chains.length > 0 ? l2Chains.length.toString() : undefined,
          subcategories: [
            {
              id: 'optimistic',
              label: 'Optimistic Rollups',
              contentType: CategoryContentType.MultiSelect,
              value: l2Chains,
              onChange: setL2Chains,
              options: [
                { value: '42161', label: 'Arbitrum' },
                { value: '10', label: 'Optimism' },
              ],
              testId: 'optimistic-view',
            },
            {
              id: 'zk',
              label: 'ZK Rollups',
              contentType: CategoryContentType.MultiSelect,
              value: [],
              onChange: (value) => console.log('ZK:', value),
              options: [
                { value: 'zksync', label: 'zkSync Era' },
                { value: 'starknet', label: 'Starknet' },
              ],
              testId: 'zk-view',
            },
          ],
        },
      ],
    },
    {
      id: 'protocol',
      label: 'DeFi Protocols',
      badgeLabel:
        protocols.length > 0 ? protocols.length.toString() : undefined,
      contentType: CategoryContentType.MultiSelect,
      value: protocols,
      onChange: setProtocols,
      options: protocolOptions,
      searchable: true,
      testId: 'protocol-view-nested',
    },
  ];

  return (
    <Stack gap={2} sx={{ width: 400, padding: 3 }}>
      <MultiLayerDrawer
        categories={categories}
        title="Advanced Filters"
        applyButtonLabel="Apply"
        clearButtonLabel="Reset"
        onApply={() => console.log('Applied nested filters')}
        onClear={() => {
          setEthChains([]);
          setL2Chains([]);
          setProtocols([]);
        }}
        testId="nested-structure-drawer"
      />
    </Stack>
  );
};

export const NestedStructure: Story = {
  render: () => <NestedStructureTemplate />,
};

// Story 4: Custom Content
const CustomContentTemplate = () => {
  const [customValue, setCustomValue] = useState({
    setting1: true,
    setting2: false,
  });

  const categories: CategoryConfig[] = [
    {
      id: 'chains',
      label: 'Select Chains',
      contentType: CategoryContentType.MultiSelect,
      value: [],
      onChange: (value) => console.log('chains:', value),
      options: chainOptions.slice(0, 3),
      testId: 'chains-custom',
    },
    {
      id: 'custom',
      label: 'Custom Settings',
      contentType: CategoryContentType.Custom,
      value: customValue,
      onChange: setCustomValue,
      render: ({ value, onChange }) => (
        <Stack gap={2} sx={{ padding: 2 }}>
          <div
            style={{
              padding: 16,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 8,
            }}
          >
            <h3 style={{ margin: '0 0 16px 0' }}>Custom Content Area</h3>
            <p>You can render any custom React content here!</p>
            <Stack gap={1} sx={{ marginTop: 2 }}>
              <label>
                <input
                  type="checkbox"
                  checked={value.setting1}
                  onChange={(e) =>
                    onChange({ ...value, setting1: e.target.checked })
                  }
                />
                {' Setting 1'}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={value.setting2}
                  onChange={(e) =>
                    onChange({ ...value, setting2: e.target.checked })
                  }
                />
                {' Setting 2'}
              </label>
            </Stack>
          </div>
        </Stack>
      ),
      testId: 'custom-content',
    },
  ];

  return (
    <Stack gap={2} sx={{ width: 400, padding: 3 }}>
      <MultiLayerDrawer
        categories={categories}
        title="Custom Content Example"
        applyButtonLabel="Save"
        clearButtonLabel="Reset"
        onApply={() => console.log('Custom value:', customValue)}
        onClear={() => setCustomValue({ setting1: true, setting2: false })}
        testId="custom-content-drawer"
      />
    </Stack>
  );
};

export const CustomContent: Story = {
  render: () => <CustomContentTemplate />,
};

// Story 5: Without Footer
const NoFooterTemplate = () => {
  const categories: CategoryConfig[] = [
    {
      id: 'info',
      label: 'Information',
      contentType: CategoryContentType.Custom,
      render: () => (
        <Stack gap={2} sx={{ padding: 2 }}>
          <p>This drawer has no footer buttons.</p>
          <p>
            Useful for read-only views or when actions are embedded in the
            content.
          </p>
        </Stack>
      ),
      testId: 'info',
    },
  ];

  return (
    <Stack gap={2} sx={{ width: 400, padding: 3 }}>
      <MultiLayerDrawer
        categories={categories}
        title="No Footer Example"
        showFooter={false}
        testId="no-footer-drawer"
      />
    </Stack>
  );
};

export const WithoutFooter: Story = {
  render: () => <NoFooterTemplate />,
};

// Story 6: Empty State
export const EmptyState: Story = {
  args: {
    categories: [],
    title: 'No Filters Available',
    applyButtonLabel: 'Apply',
    clearButtonLabel: 'Clear',
    testId: 'empty-drawer',
  },
};
