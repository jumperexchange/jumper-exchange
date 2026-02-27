import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PasswordPrompt } from './PasswordPrompt';
import { withMockJumperWalletStore } from '../__stories__/decorators';

const meta = {
  title: 'JumperWallet/Login/PasswordPrompt',
  component: PasswordPrompt,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    withMockJumperWalletStore({
      status: 'locked',
      flow: 'password-prompt',
      hasStoredWallet: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
    }),
  ],
} satisfies Meta<typeof PasswordPrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
