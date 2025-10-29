import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AssetProgress } from './AssetProgress';
import { AssetProgressVariant } from './AssetProgress.types';

const meta = {
  title: 'Composite/AssetProgress',
  component: AssetProgress,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(AssetProgressVariant),
    },
  },
} satisfies Meta<typeof AssetProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    progress: 32,
    variant: AssetProgressVariant.Text,
    text: '+3',
    amount: 100,
  },
};

export const TextSmallAmount: Story = {
  args: {
    progress: 32,
    variant: AssetProgressVariant.Text,
    text: '+3',
    amount: 0.00000000123,
  },
};

export const Token: Story = {
  args: {
    progress: 32,
    variant: AssetProgressVariant.Token,
    token: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'ETH',
      symbol: 'ETH',
      decimals: 6,
      logo: '',
      chain: { chainId: 1, chainKey: 'Ethereum' },
    },
    amount: 100,
  },
};

export const Protocol: Story = {
  args: {
    progress: 32,
    variant: AssetProgressVariant.Protocol,
    protocol: {
      name: 'Morpho',
      logo: 'https://strapi.jumper.exchange/uploads/morpho_eef0686ee3_2e4b8e06a6.png',
      product: 'Morpho',
      version: '1.0.0',
    },
    amount: 100,
  },
};
