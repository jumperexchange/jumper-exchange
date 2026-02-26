import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { RecoverySetPasswordStep } from './RecoverySetPasswordStep';
import { withMockModalContainer } from '../__stories__/decorators';

const meta = {
  title: 'JumperWallet/Recovery/RecoverySetPasswordStep',
  component: RecoverySetPasswordStep,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [withMockModalContainer],
  args: {
    onNewPasswordChange: action('new-password-change'),
    onConfirmPasswordChange: action('confirm-password-change'),
  },
} satisfies Meta<typeof RecoverySetPasswordStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    newPassword: '',
    confirmPassword: '',
  },
};

export const WithRecoveredAddress: Story = {
  args: {
    newPassword: '',
    confirmPassword: '',
    recoveredAddress: '0xAbCd...1234',
  },
};

export const WithWeakPassword: Story = {
  args: {
    newPassword: 'short',
    confirmPassword: '',
    recoveredAddress: '0xAbCd...1234',
  },
};

export const WithStrongPassword: Story = {
  args: {
    newPassword: 'MyStr0ng!Pass#2024',
    confirmPassword: 'MyStr0ng!Pass#2024',
    recoveredAddress: '0xAbCd...1234',
  },
};

export const WithMismatch: Story = {
  args: {
    newPassword: 'MyStr0ng!Pass#2024',
    confirmPassword: 'different-password',
    recoveredAddress: '0xAbCd...1234',
  },
};

export const Interactive: Story = {
  args: {
    newPassword: '',
    confirmPassword: '',
    recoveredAddress: '0xAbCd...1234',
  },
  render: () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
      <RecoverySetPasswordStep
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        recoveredAddress="0xAbCd...1234"
      />
    );
  },
};
