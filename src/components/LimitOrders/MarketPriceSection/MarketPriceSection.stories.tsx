import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MarketPriceSection } from './MarketPriceSection';

const meta = {
  title: 'LimitOrders/MarketPriceSection',
  component: MarketPriceSection,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MarketPriceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
