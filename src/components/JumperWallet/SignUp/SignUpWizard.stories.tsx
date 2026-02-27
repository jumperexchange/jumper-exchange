import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SignUpWizard } from './SignUpWizard';
import {
  withMockJumperWalletStore,
  withMockModalContainer,
} from '../__stories__/decorators';

const meta = {
  title: 'JumperWallet/SignUp/SignUpWizard',
  component: SignUpWizard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    withMockModalContainer,
    withMockJumperWalletStore({
      flow: 'signup',
      signupStep: 0,
      shamirConfig: { totalShares: 4, threshold: 2 },
    }),
  ],
} satisfies Meta<typeof SignUpWizard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step0_CreatePassword: Story = {};

export const Step1_BiometricSetup: Story = {
  decorators: [
    withMockJumperWalletStore({
      flow: 'signup',
      signupStep: 1,
      shamirConfig: { totalShares: 4, threshold: 2 },
    }),
  ],
};

export const Step2_RecoverySetup: Story = {
  decorators: [
    withMockJumperWalletStore({
      flow: 'signup',
      signupStep: 2,
      shamirConfig: { totalShares: 4, threshold: 2 },
    }),
  ],
};

export const Step3_Distribution: Story = {
  decorators: [
    withMockJumperWalletStore({
      flow: 'signup',
      signupStep: 3,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      shamirConfig: { totalShares: 4, threshold: 2 },
    }),
  ],
};
