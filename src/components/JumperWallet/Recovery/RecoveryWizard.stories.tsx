import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RecoveryWizard } from './RecoveryWizard';
import {
  withMockJumperWalletStore,
  withMockModalContainer,
} from '../__stories__/decorators';

const meta = {
  title: 'JumperWallet/Recovery/RecoveryWizard',
  component: RecoveryWizard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    withMockModalContainer,
    withMockJumperWalletStore({
      flow: 'recovery',
      shamirConfig: { totalShares: 4, threshold: 2 },
    }),
  ],
} satisfies Meta<typeof RecoveryWizard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectSources: Story = {};
