import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { action } from 'storybook/actions';
import { BiometricButton } from './BiometricButton';

const meta = {
  title: 'JumperWallet/Login/BiometricButton',
  component: BiometricButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    onClick: action('biometric-click'),
  },
} satisfies Meta<typeof BiometricButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: { loading: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
