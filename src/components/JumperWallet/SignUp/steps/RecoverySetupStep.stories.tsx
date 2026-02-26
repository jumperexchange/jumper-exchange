import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { RecoverySetupStep } from './RecoverySetupStep';
import {
  withMockJumperWalletStore,
  withMockModalContainer,
} from '../../__stories__/decorators';
import type { ShareStorageType } from '@/internal-wallet/crypto/types';
import type {
  AdapterFields,
  AdaptersWithFields,
} from '@/internal-wallet/recovery/adapters/ShareStorageAdapter.types';

const meta = {
  title: 'JumperWallet/SignUp/RecoverySetupStep',
  component: RecoverySetupStep,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    withMockModalContainer,
    withMockJumperWalletStore({
      shamirConfig: { totalShares: 4, threshold: 2 },
    }),
  ],
  args: {
    onToggleAdapter: action('toggle-adapter'),
    onAdapterFieldChange: action('adapter-field-change'),
  },
} satisfies Meta<typeof RecoverySetupStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    enabledAdapters: {
      localStorage: true,
      email: false,
      googleDrive: false,
      recoveryCode: true,
    },
    adapterFields: {},
  },
};

export const WithEmailEnabled: Story = {
  args: {
    enabledAdapters: {
      localStorage: true,
      email: true,
      googleDrive: false,
      recoveryCode: true,
    },
    adapterFields: { email: 'user@example.com' },
  },
};

export const AllEnabled: Story = {
  args: {
    enabledAdapters: {
      localStorage: true,
      email: true,
      googleDrive: true,
      recoveryCode: true,
    },
    adapterFields: { email: 'user@example.com' },
  },
};

export const Interactive: Story = {
  args: {
    enabledAdapters: {
      localStorage: true,
      email: false,
      googleDrive: false,
      recoveryCode: true,
    },
    adapterFields: {},
  },
  render: () => {
    const [enabledAdapters, setEnabledAdapters] = useState<
      Record<ShareStorageType, boolean>
    >({
      localStorage: true,
      email: false,
      googleDrive: false,
      recoveryCode: true,
    });
    const [adapterFields, setAdapterFields] = useState<Partial<AdapterFields>>(
      {},
    );

    const setAdapterField = <K extends AdaptersWithFields>(
      type: K,
      value: AdapterFields[K],
    ) => setAdapterFields((prev) => ({ ...prev, [type]: value }));

    return (
      <RecoverySetupStep
        enabledAdapters={enabledAdapters}
        adapterFields={adapterFields}
        onToggleAdapter={(type, enabled) =>
          setEnabledAdapters((prev) => ({ ...prev, [type]: enabled }))
        }
        onAdapterFieldChange={setAdapterField}
      />
    );
  },
};
