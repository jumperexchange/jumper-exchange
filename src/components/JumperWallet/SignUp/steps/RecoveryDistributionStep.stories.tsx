import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { action } from 'storybook/actions';
import { RecoveryDistributionStep } from './RecoveryDistributionStep';
import { withMockModalContainer as withModalContainer } from '../../__stories__/decorators';
import type { ShamirShare } from '@/internal-wallet/crypto/types';
import type { ShareDistributionEntry } from '@/internal-wallet/hooks/useWalletSetup';

const MOCK_SHARE: ShamirShare = {
  data: 'dGhpcyBpcyBhIG1vY2sgc2hhbWlyIHNoYXJlIGZvciBzdG9yeWJvb2sgcHJldmlldw==',
  threshold: 2,
  totalShares: 4,
  v: 1,
  addr: '0x1234567890abcdef1234567890abcdef12345678',
};

const MOCK_SHARES: ShamirShare[] = [
  { ...MOCK_SHARE },
  { ...MOCK_SHARE },
  { ...MOCK_SHARE },
  { ...MOCK_SHARE },
];

const meta = {
  title: 'JumperWallet/SignUp/RecoveryDistributionStep',
  component: RecoveryDistributionStep,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [withModalContainer],
  args: {
    shares: MOCK_SHARES,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    adapterFields: { email: 'user@example.com' },
    onStatusChange: action('status-change'),
  },
} satisfies Meta<typeof RecoveryDistributionStep>;

export default meta;
type Story = StoryObj<typeof meta>;

const allPending: ShareDistributionEntry[] = [
  { type: 'localStorage', status: 'idle' },
  { type: 'email', status: 'idle' },
  { type: 'recoveryCode', status: 'idle' },
];

export const AllPending: Story = {
  args: {
    distribution: allPending,
    // Pass null address to prevent the useEffect from triggering distribution
    address: null,
  },
};

export const AllStoring: Story = {
  args: {
    distribution: [
      { type: 'localStorage', status: 'working' },
      { type: 'email', status: 'working' },
      { type: 'recoveryCode', status: 'working' },
    ],
    address: null,
  },
};

export const AllStored: Story = {
  args: {
    distribution: [
      { type: 'localStorage', status: 'done' },
      { type: 'email', status: 'done' },
      { type: 'recoveryCode', status: 'done' },
    ],
    address: null,
  },
};

export const MixedStatuses: Story = {
  args: {
    distribution: [
      { type: 'localStorage', status: 'done' },
      { type: 'email', status: 'failed', error: 'Network error' },
      { type: 'googleDrive', status: 'working' },
      { type: 'recoveryCode', status: 'done' },
    ],
    address: null,
  },
};

export const WithRecoveryCode: Story = {
  args: {
    distribution: [
      { type: 'localStorage', status: 'done' },
      { type: 'recoveryCode', status: 'done' },
    ],
    address: null,
  },
};
