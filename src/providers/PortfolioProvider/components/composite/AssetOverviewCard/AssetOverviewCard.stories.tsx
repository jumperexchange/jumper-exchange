import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AssetOverviewCard } from './AssetOverviewCard';
import {
  mockSummaryData,
  mockEmptySummaryData,
  mockTokensOnlySummaryData,
  mockPositionsOnlySummaryData,
} from './fixtures';

const meta: Meta<typeof AssetOverviewCard> = {
  title: 'components/composite/AssetOverviewCard',
  component: AssetOverviewCard,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof AssetOverviewCard>;

export const Default: Story = {
  args: {
    summaryData: mockSummaryData,
  },
};

export const Loading: Story = {
  args: {
    summaryData: mockEmptySummaryData,
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    summaryData: mockEmptySummaryData,
    showNoContent: true,
  },
};

export const TokensOnly: Story = {
  args: {
    summaryData: mockTokensOnlySummaryData,
  },
};

export const PositionsOnly: Story = {
  args: {
    summaryData: mockPositionsOnlySummaryData,
  },
};
