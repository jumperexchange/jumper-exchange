import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LoginModal } from './LoginModal';
import { withMockJumperWalletStore } from '../__stories__/decorators';

const meta = {
  title: 'JumperWallet/Login/LoginModal',
  component: LoginModal,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    withMockJumperWalletStore({
      status: 'locked',
      flow: 'login',
      hasStoredWallet: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
    }),
  ],
} satisfies Meta<typeof LoginModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAddress: Story = {
  decorators: [
    withMockJumperWalletStore({
      status: 'locked',
      flow: 'login',
      hasStoredWallet: true,
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    }),
  ],
};
