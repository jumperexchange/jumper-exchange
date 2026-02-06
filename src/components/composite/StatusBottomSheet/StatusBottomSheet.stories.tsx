import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatusBottomSheet } from './StatusBottomSheet';
import { useEffect, useState } from 'react';
import { TokenAmountInput } from '../TokenAmountInput/TokenAmountInput';

const BOTTOM_SHEET_CONTAINER_ID = 'status-bottom-sheet';

const meta = {
  title: 'Composite/StatusBottomSheet',
  component: StatusBottomSheet,
  decorators: [
    (Story) => (
      <div
        style={{
          height: '100%',
          position: 'relative',
          padding: 24,
          boxSizing: 'border-box',
        }}
      >
        <div id={BOTTOM_SHEET_CONTAINER_ID} />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusBottomSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

const commonArgs = {
  title: 'Transaction successful',
  description: 'Your transaction has been successful.',
  callToAction: 'View on Etherscan',
  callToActionType: 'button',
  status: 'success',
  containerId: BOTTOM_SHEET_CONTAINER_ID,
  isOpen: true,
} as const;

export const Default: Story = {
  args: {
    ...commonArgs,
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      setOpen(true);
    }, []);

    return <StatusBottomSheet {...args} isOpen={open} />;
  },
};

export const Success: Story = {
  args: {
    ...commonArgs,
    status: 'success',
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      setOpen(true);
    }, []);

    return <StatusBottomSheet {...args} isOpen={open} />;
  },
};

export const Error: Story = {
  args: {
    ...commonArgs,
    status: 'error',
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      setOpen(true);
    }, []);

    return <StatusBottomSheet {...args} isOpen={open} />;
  },
};

export const Info: Story = {
  args: {
    ...commonArgs,
    status: 'info',
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      setOpen(true);
    }, []);

    return <StatusBottomSheet {...args} isOpen={open} />;
  },
};

export const WithChildren: Story = {
  args: {
    title: 'Withdraw request sent',
    containerId: BOTTOM_SHEET_CONTAINER_ID,
    status: 'success',
    callToAction: 'Done',
    callToActionType: 'button',
    isOpen: true,
    secondaryCallToAction: 'See details',
    onSecondaryClick: () => {
      console.log('Cancel');
    },
    children: (
      <TokenAmountInput
        label="Requested"
        tokenBalance={{
          amount: 10000000n,
          token: {
            symbol: 'USDC',
            decimals: 6,
            type: 'extended',
            priceUSD: '1',
            chainId: 1,
            address: '0x0000000000000000000000000000000000000000',
            name: 'USDC',
          },
        }}
        sx={(theme) => ({
          backgroundColor: (theme.vars || theme).palette.surface1.main,
          boxShadow: theme.shadows[2],
          '& .MuiInputLabel-root': {
            ...theme.typography.title2XSmall,
          },
        })}
      />
    ),
    sx: (theme) => ({
      gap: theme.spacing(2),
    }),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      setOpen(true);
    }, []);

    return <StatusBottomSheet {...args} isOpen={open} />;
  },
};
