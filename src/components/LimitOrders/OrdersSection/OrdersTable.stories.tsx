import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrdersTable } from './OrdersTable';
import { sampleOrders } from './fixtures';
import { ORDERS_PAGE_SIZE } from './constants';

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
    orders: sampleOrders.slice(0, ORDERS_PAGE_SIZE),
    total: sampleOrders.length,
    pageSize: ORDERS_PAGE_SIZE,
    pageCount: Math.ceil(sampleOrders.length / ORDERS_PAGE_SIZE),
    page: 0,
    setPage: () => {},
  },
};

export const ActiveOnly: Story = {
  args: {
    orders: activeOrders.slice(0, ORDERS_PAGE_SIZE),
    total: activeOrders.length,
    pageSize: ORDERS_PAGE_SIZE,
    pageCount: Math.ceil(activeOrders.length / ORDERS_PAGE_SIZE),
    page: 0,
    setPage: () => {},
  },
};

export const Empty: Story = {
  args: {
    orders: [],
    total: 0,
    pageSize: ORDERS_PAGE_SIZE,
    pageCount: 0,
    page: 0,
    setPage: () => {},
  },
};

export const Loading: Story = {
  args: {
    orders: [],
    total: 0,
    pageSize: ORDERS_PAGE_SIZE,
    pageCount: 0,
    page: 0,
    setPage: () => {},
    isLoading: true,
  },
};
