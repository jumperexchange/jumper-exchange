import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { CreatePasswordStep } from './CreatePasswordStep';
import { withMockModalContainer } from '../../__stories__/decorators';

const meta = {
  title: 'JumperWallet/SignUp/CreatePasswordStep',
  component: CreatePasswordStep,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [withMockModalContainer],
  args: {
    onPasswordChange: action('password-change'),
    onConfirmPasswordChange: action('confirm-password-change'),
  },
} satisfies Meta<typeof CreatePasswordStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    password: '',
    confirmPassword: '',
    error: null,
  },
};

export const WithWeakPassword: Story = {
  args: {
    password: 'short',
    confirmPassword: '',
    error: null,
  },
};

export const WithStrongPassword: Story = {
  args: {
    password: 'MyStr0ng!Pass#2024',
    confirmPassword: 'MyStr0ng!Pass#2024',
    error: null,
  },
};

export const WithMismatch: Story = {
  args: {
    password: 'MyStr0ng!Pass#2024',
    confirmPassword: 'different-password',
    error: null,
  },
};

export const WithError: Story = {
  args: {
    password: 'MyStr0ng!Pass#2024',
    confirmPassword: 'MyStr0ng!Pass#2024',
    error: 'Failed to create wallet. Please try again.',
  },
};

export const Interactive: Story = {
  args: {
    password: '',
    confirmPassword: '',
    error: null,
  },
  render: () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
      <CreatePasswordStep
        password={password}
        confirmPassword={confirmPassword}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        error={null}
      />
    );
  },
};
