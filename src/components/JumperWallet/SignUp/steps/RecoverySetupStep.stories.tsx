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
    onThresholdChange: action('threshold-change'),
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
    threshold: 2,
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
    threshold: 2,
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
    threshold: 2,
  },
};

/** Advanced Setup panel open — threshold stepper and per-adapter toggles visible. */
export const AdvancedSetupOpen: Story = {
  args: {
    enabledAdapters: {
      localStorage: true,
      email: true,
      googleDrive: false,
      recoveryCode: true,
    },
    adapterFields: { email: 'user@example.com' },
    threshold: 2,
  },
  play: async ({ canvasElement }) => {
    // Open panel via the Advanced Setup button
    const advancedBtn = Array.from(
      canvasElement.querySelectorAll('button'),
    ).find((el) => el.textContent?.includes('Advanced'));
    advancedBtn?.click();
  },
};

/** High threshold — threshold is set close to the total number of enabled shares. */
export const HighThreshold: Story = {
  args: {
    enabledAdapters: {
      localStorage: true,
      email: true,
      googleDrive: true,
      recoveryCode: true,
    },
    adapterFields: { email: 'user@example.com' },
    threshold: 3,
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
    threshold: 2,
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
    const [threshold, setThreshold] = useState(2);

    const setAdapterField = <K extends AdaptersWithFields>(
      type: K,
      value: AdapterFields[K],
    ) => setAdapterFields((prev) => ({ ...prev, [type]: value }));

    return (
      <RecoverySetupStep
        enabledAdapters={enabledAdapters}
        adapterFields={adapterFields}
        threshold={threshold}
        onToggleAdapter={(type, enabled) =>
          setEnabledAdapters((prev) => ({ ...prev, [type]: enabled }))
        }
        onAdapterFieldChange={setAdapterField}
        onThresholdChange={setThreshold}
      />
    );
  },
};
