import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrdersTable } from './OrdersTable';
import { sampleOrders } from './fixtures';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta = {
  title: 'LimitOrders/OrdersTable',
  component: OrdersTable,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof OrdersTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const activeOrders = sampleOrders.filter((o) => o.status === 'active');

export const Default: Story = {
  args: {
    orders: sampleOrders,
    hasMore: true,
    canGoPrev: false,
    onNext: () => {},
    onPrev: () => {},
  },
};

export const ActiveOnly: Story = {
  args: {
    orders: activeOrders,
    hasMore: false,
    canGoPrev: false,
    onNext: () => {},
    onPrev: () => {},
  },
};

export const Empty: Story = {
  args: {
    orders: [],
    hasMore: false,
    canGoPrev: false,
    onNext: () => {},
    onPrev: () => {},
  },
};

export const Loading: Story = {
  args: {
    orders: [],
    hasMore: false,
    canGoPrev: false,
    onNext: () => {},
    onPrev: () => {},
    isLoading: true,
  },
};
