import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { JumperWalletModal } from './JumperWalletModal';
import { withMockJumperWalletStore } from './__stories__/decorators';

const meta = {
  title: 'JumperWallet/JumperWalletModal',
  component: JumperWalletModal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof JumperWalletModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginFlow: Story = {
  decorators: [
    withMockJumperWalletStore({
      flow: 'login',
      status: 'locked',
      hasStoredWallet: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
    }),
  ],
};

export const SignUpFlow: Story = {
  decorators: [
    withMockJumperWalletStore({
      flow: 'signup',
      signupStep: 0,
      shamirConfig: { totalShares: 4, threshold: 2 },
    }),
  ],
};

export const PasswordPromptFlow: Story = {
  decorators: [
    withMockJumperWalletStore({
      flow: 'password-prompt',
      status: 'locked',
      hasStoredWallet: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
    }),
  ],
};

export const RecoveryFlow: Story = {
  decorators: [
    withMockJumperWalletStore({
      flow: 'recovery',
      shamirConfig: { totalShares: 4, threshold: 2 },
    }),
  ],
};
