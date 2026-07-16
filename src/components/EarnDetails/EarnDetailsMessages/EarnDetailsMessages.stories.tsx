import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { VaultMessageSeverity } from '@/types/jumper-backend';
import { EarnDetailsMessages } from './EarnDetailsMessages';

const meta = {
  component: EarnDetailsMessages,
} satisfies Meta<typeof EarnDetailsMessages>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    messages: [],
  },
};

export const SingleInfo: Story = {
  args: {
    messages: [
      {
        content: 'Deposits are temporarily paused for scheduled maintenance.',
        severity: VaultMessageSeverity.Info,
        publishedAt: '2026-06-01T10:00:00Z',
      },
    ],
  },
};

export const SingleWarning: Story = {
  args: {
    messages: [
      {
        content:
          'Withdrawal queue is congested. Processing may take up to 48 hours.',
        severity: VaultMessageSeverity.Warning,
        publishedAt: '2026-06-01T10:00:00Z',
      },
    ],
  },
};

export const SingleCritical: Story = {
  args: {
    messages: [
      {
        content:
          'A vulnerability has been identified. Withdrawals are suspended pending audit.',
        severity: VaultMessageSeverity.Critical,
        publishedAt: '2026-06-01T10:00:00Z',
      },
    ],
  },
};

export const Mixed: Story = {
  args: {
    messages: [
      {
        content:
          'A vulnerability has been identified. Withdrawals are suspended pending audit.',
        severity: VaultMessageSeverity.Critical,
        publishedAt: '2026-06-01T10:00:00Z',
      },
      {
        content:
          'Withdrawal queue is congested. Processing may take up to 48 hours.',
        severity: VaultMessageSeverity.Warning,
        publishedAt: '2026-06-01T09:00:00Z',
      },
      {
        content: 'Deposits are temporarily paused for scheduled maintenance.',
        severity: VaultMessageSeverity.Info,
        publishedAt: '2026-06-01T08:00:00Z',
      },
    ],
  },
};

export const UndefinedMessages: Story = {
  args: {
    messages: undefined,
  },
};
