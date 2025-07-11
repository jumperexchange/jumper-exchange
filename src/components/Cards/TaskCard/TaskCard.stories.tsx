import type { Meta, StoryFn, StoryObj } from '@storybook/nextjs-vite';
import { TaskCard } from './TaskCard';
import { Badge } from 'src/components/Badge/Badge';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import React from 'react';
import Stack from '@mui/material/Stack';
import { BadgeVariant } from 'src/components/Badge/Badge.styles';

const meta: Meta<typeof TaskCard> = {
  title: 'Components/Cards/Mission task cards',
  component: TaskCard,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TaskCard>;

const Template: StoryFn<typeof TaskCard> = (args) => <TaskCard {...args} />;

export const Default: Story = {
  render: Template,
  args: {
    title: 'Default task',
    description: 'This is a sample task description.',
  },
};

export const Active: Story = {
  render: Template,
  args: {
    title: 'Active Task',
    description: 'This task is currently active.',
    isActive: true,
  },
};

export const Loading: Story = {
  render: Template,
  args: {
    isLoading: true,
  },
};

export const WithVerifiedStatus: Story = {
  render: Template,
  args: {
    title: 'Task with verified status',
    description: 'You have completed this task successfully.',
    statusBadge: (
      <Badge
        label="Verified"
        variant={BadgeVariant.Success}
        startIcon={<CheckIcon />}
      />
    ),
  },
};

export const WithVerifyingStatus: Story = {
  render: Template,
  args: {
    title: 'Verifying Task',
    description: 'Please wait while we verify your progress.',
    statusBadge: (
      <Badge
        label="Verify"
        variant={BadgeVariant.Disabled}
        startIcon={
          <RefreshIcon
            sx={{
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(360deg)' },
              },
            }}
          />
        }
      />
    ),
  },
};

export const WithTaskTypes: Story = {
  render: () => (
    <Stack spacing={2}>
      <TaskCard
        title="Bridge ETH"
        description="Use the bridge to move assets to another chain."
        type="Bridge task"
      />
      <TaskCard
        title="Swap USDC"
        description="Swap tokens on a DEX."
        type="Swap task"
      />
      <TaskCard
        title="Deposit in Vault"
        description="Deposit funds in a DeFi vault."
        type="Deposit task"
      />
      <TaskCard
        title="Sign Transaction"
        description="Complete an on-chain interaction."
        type="On-chain task"
      />
      <TaskCard
        title="Follow Twitter"
        description="Complete an off-chain social task."
        type="Off-chain task"
      />
      <TaskCard
        title="Zap into Pool"
        description="Quickly zap into a DeFi pool."
        type="Zap task"
      />
    </Stack>
  ),
};
