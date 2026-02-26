import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { action } from 'storybook/actions';
import { ShareStatusCard } from './ShareStatusCard';
import type { ShareStorageType } from '@/internal-wallet/crypto/types';

const meta = {
  title: 'JumperWallet/Common/ShareStatusCard',
  component: ShareStatusCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['localStorage', 'email', 'googleDrive', 'recoveryCode'],
    },
    status: {
      control: { type: 'select' },
      options: ['pending', 'storing', 'stored', 'failed'],
    },
    mode: {
      control: { type: 'select' },
      options: ['store', 'retrieve'],
    },
  },
} satisfies Meta<typeof ShareStatusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: { type: 'localStorage', label: 'Local Storage', status: 'idle' },
};

export const Storing: Story = {
  args: { type: 'email', label: 'Email Backup', status: 'working' },
};

export const Stored: Story = {
  args: { type: 'googleDrive', label: 'Google Drive', status: 'done' },
};

export const Failed: Story = {
  args: { type: 'recoveryCode', label: 'Recovery Code', status: 'failed' },
};

export const FailedWithRetry: Story = {
  args: {
    type: 'email',
    label: 'Email Backup',
    status: 'failed',
    onRetry: action('retry'),
  },
};

export const AllStatuses: Story = {
  args: { type: 'localStorage', label: '', status: 'idle' },
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 360 }}
    >
      <ShareStatusCard
        type="localStorage"
        label="Local Storage"
        status="idle"
      />
      <ShareStatusCard type="email" label="Email Backup" status="working" />
      <ShareStatusCard type="googleDrive" label="Google Drive" status="done" />
      <ShareStatusCard
        type="recoveryCode"
        label="Recovery Code"
        status="failed"
        onRetry={action('retry')}
      />
    </div>
  ),
};

export const AllAdapterTypes: Story = {
  args: { type: 'localStorage', label: '', status: 'done' },
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 360 }}
    >
      {(
        [
          { type: 'localStorage', label: 'Local Storage' },
          { type: 'email', label: 'Email Backup' },
          { type: 'googleDrive', label: 'Google Drive' },
          { type: 'recoveryCode', label: 'Recovery Code' },
        ] as { type: ShareStorageType; label: string }[]
      ).map(({ type, label }) => (
        <ShareStatusCard key={type} type={type} label={label} status="done" />
      ))}
    </div>
  ),
};
