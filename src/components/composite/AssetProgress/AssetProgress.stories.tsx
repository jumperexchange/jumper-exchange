import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AssetProgress } from './AssetProgress';
import { AssetProgressVariant } from './types';
import { mockToken, mockProtocol, mockProgressData } from './fixtures';

const meta: Meta<typeof AssetProgress> = {
  title: 'components/composite/AssetProgress',
  component: AssetProgress,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AssetProgress>;

export const TokenHighProgress: Story = {
  args: {
    variant: AssetProgressVariant.Entity,
    entity: mockToken,
    ...mockProgressData.highProgress,
  },
};

export const TokenMediumProgress: Story = {
  args: {
    variant: AssetProgressVariant.Entity,
    entity: mockToken,
    ...mockProgressData.mediumProgress,
  },
};

export const TokenLowProgress: Story = {
  args: {
    variant: AssetProgressVariant.Entity,
    entity: mockToken,
    ...mockProgressData.lowProgress,
  },
};

export const ProtocolProgress: Story = {
  args: {
    variant: AssetProgressVariant.Entity,
    entity: mockProtocol,
    ...mockProgressData.highProgress,
  },
};

export const TextOverflow: Story = {
  args: {
    variant: AssetProgressVariant.Text,
    text: '+5',
    ...mockProgressData.lowProgress,
  },
};

export const TinyAmount: Story = {
  args: {
    variant: AssetProgressVariant.Entity,
    entity: mockToken,
    ...mockProgressData.tinyAmount,
  },
};

export const MultipleProgress: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <AssetProgress
        variant={AssetProgressVariant.Entity}
        entity={mockToken}
        {...mockProgressData.highProgress}
      />
      <AssetProgress
        variant={AssetProgressVariant.Entity}
        entity={mockProtocol}
        {...mockProgressData.mediumProgress}
      />
      <AssetProgress
        variant={AssetProgressVariant.Text}
        text="+3"
        {...mockProgressData.lowProgress}
      />
    </div>
  ),
};
