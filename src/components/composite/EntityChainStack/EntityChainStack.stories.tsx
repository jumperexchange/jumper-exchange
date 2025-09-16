import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EntityChainStack } from './EntityChainStack';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { EntityChainStackVariant } from './EntityChainStack.types';

const meta = {
  title: 'Composite/EntityChainStack',
  component: EntityChainStack,
  tags: ['autodocs'],
  argTypes: {
    tokensSize: {
      control: 'select',
      options: Object.values(AvatarSize),
    },
    protocolSize: {
      control: 'select',
      options: Object.values(AvatarSize),
    },
    chainsSize: {
      control: 'select',
      options: Object.values(AvatarSize),
    },
  },
} satisfies Meta<typeof EntityChainStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TokensDefault: Story = {
  args: {
    variant: EntityChainStackVariant.Tokens,
    tokens: [
      {
        address: '0x0000000000000000000000000000000000000000',
        name: 'ETH',
        symbol: 'ETH',
        decimals: 6,
        logo: '',
        chain: { chainId: 1, chainKey: 'Ethereum' },
      },
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        logo: '',
        chain: { chainId: 1, chainKey: 'Ethereum' },
      },
    ],
    content: {
      title: 'ETH-USDC',
    },
  },
};

export const TokensMultipleChains: Story = {
  args: {
    variant: EntityChainStackVariant.Tokens,
    tokens: [
      {
        address: '0x0000000000000000000000000000000000000000',
        name: 'ETH',
        symbol: 'ETH',
        decimals: 6,
        logo: '',
        chain: { chainId: 1, chainKey: 'Ethereum' },
      },
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        logo: '',
        chain: { chainId: 1, chainKey: 'Ethereum' },
      },
      {
        address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        name: 'USDT',
        symbol: 'USDT',
        decimals: 6,
        logo: '',
        chain: { chainId: 10, chainKey: 'BNB Chain' },
      },
      {
        address: '0x0000000000000000000000000000000000000000',
        name: 'Sonic',
        symbol: 'Sonic',
        decimals: 6,
        logo: '',
        chain: { chainId: 146, chainKey: 'Sonic' },
      },
    ],
    content: {
      title: 'ETH-USDC-USDT',
    },
  },
};

export const TokensFeatureCardVariant: Story = {
  args: {
    variant: EntityChainStackVariant.Tokens,
    tokens: [
      {
        address: '0x0000000000000000000000000000000000000000',
        name: 'ETH',
        symbol: 'ETH',
        decimals: 6,
        logo: '',
        chain: { chainId: 1, chainKey: 'Ethereum' },
      },
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        logo: '',
        chain: { chainId: 1, chainKey: 'Ethereum' },
      },
    ],
    tokensSize: AvatarSize.XXL,
    chainsSize: AvatarSize.SM,
    content: {
      title: 'ETH-USDC',
      titleVariant: 'bodyLargeStrong',
      descriptionVariant: 'bodyXSmall',
    },
    spacing: {
      infoContainerGap: 4,
    },
  },
};

export const TokensLoading: Story = {
  args: {
    variant: EntityChainStackVariant.Tokens,
    tokens: [],
    tokensSize: AvatarSize.XXL,
    isLoading: true,
  },
};

export const TokensLoadingWithoutContent: Story = {
  args: {
    variant: EntityChainStackVariant.Tokens,
    tokensSize: AvatarSize.XXL,
    isLoading: true,
    isContentVisible: false,
  },
};

export const ProtocolDefault: Story = {
  args: {
    variant: EntityChainStackVariant.Protocol,
    protocol: {
      name: 'Morpho',
      logo: 'https://strapi.jumper.exchange/uploads/morpho_eef0686ee3_2e4b8e06a6.png',
      product: 'Morpho',
      version: '1.0.0',
    },
    chains: [
      { chainId: 1, chainKey: 'Ethereum' },
      { chainId: 10, chainKey: 'BNB Chain' },
    ],
    content: {
      title: 'Protocol',
    },
  },
};

export const ProtocolLoading: Story = {
  args: {
    variant: EntityChainStackVariant.Protocol,
    isLoading: true,
    protocolSize: AvatarSize.XXL,
  },
};
