import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ExtendedChain } from '@lifi/sdk';
import { EntityStackWithBadge } from './EntityStackWithBadge';
import { EntityStackBadgePlacement } from './types';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import {
  mockExtendedTokens,
  mockExtendedChains,
  mockProtocols,
} from './fixtures';

const meta: Meta<typeof EntityStackWithBadge> = {
  title: 'components/composite/EntityStackWithBadge',
  component: EntityStackWithBadge,
  tags: ['autodocs'],
  argTypes: {
    entities: { table: { disable: true } },
    badgeEntities: { table: { disable: true } },
    placement: {
      control: { type: 'select' },
      options: Object.values(EntityStackBadgePlacement),
    },
    size: {
      control: { type: 'select' },
      options: Object.values(AvatarSize),
    },
    badgeSize: {
      control: { type: 'select' },
      options: Object.values(AvatarSize),
    },
    isContentVisible: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;

const tokenEntities = [
  mockExtendedTokens.eth,
  mockExtendedTokens.usdc,
  mockExtendedTokens.wbtc,
];

const chainEntities = [
  mockExtendedChains.ethereum as ExtendedChain,
  mockExtendedChains.arbitrum as ExtendedChain,
];

const protocolEntities = [mockProtocols.aave, mockProtocols.uniswap];

export const TokensDefault: StoryObj<typeof EntityStackWithBadge> = {
  render: () => (
    <EntityStackWithBadge
      entities={tokenEntities.slice(0, 2)}
      badgeEntities={[chainEntities[0]]}
      content={{
        title: 'ETH-USDC',
      }}
    />
  ),
};

export const TokensMultipleChains: StoryObj<typeof EntityStackWithBadge> = {
  render: () => (
    <EntityStackWithBadge
      entities={tokenEntities}
      badgeEntities={chainEntities}
      content={{
        title: 'ETH-USDC-WBTC',
      }}
    />
  ),
};

export const TokensFeatureCardVariant: StoryObj<typeof EntityStackWithBadge> = {
  render: () => (
    <EntityStackWithBadge
      entities={tokenEntities.slice(0, 2)}
      badgeEntities={[chainEntities[0]]}
      size={AvatarSize.XXL}
      badgeSize={AvatarSize.SM}
      content={{
        title: 'ETH-USDC',
        titleVariant: 'bodyLargeStrong',
        hintVariant: 'bodyXSmall',
      }}
      spacing={{
        infoContainerGap: 4,
      }}
    />
  ),
};

export const TokensInlinePlacement: StoryObj<typeof EntityStackWithBadge> = {
  render: () => (
    <EntityStackWithBadge
      entities={tokenEntities.slice(0, 2)}
      badgeEntities={chainEntities}
      placement={EntityStackBadgePlacement.Inline}
      content={{
        title: 'Multi-chain Token',
      }}
    />
  ),
};

export const ProtocolDefault: StoryObj<typeof EntityStackWithBadge> = {
  render: () => (
    <EntityStackWithBadge
      entities={protocolEntities.slice(0, 1)}
      badgeEntities={chainEntities}
      content={{
        title: 'Aave',
      }}
    />
  ),
};

export const SingleTokenWithChain: StoryObj<typeof EntityStackWithBadge> = {
  render: () => (
    <EntityStackWithBadge
      entities={[mockExtendedTokens.usdc]}
      badgeEntities={[chainEntities[0]]}
      content={{
        title: 'USDC',
      }}
    />
  ),
};

export const WithoutContent: StoryObj<typeof EntityStackWithBadge> = {
  render: () => (
    <EntityStackWithBadge
      entities={tokenEntities}
      badgeEntities={chainEntities}
      isContentVisible={false}
    />
  ),
};

export const LargeSize: StoryObj<typeof EntityStackWithBadge> = {
  render: () => (
    <EntityStackWithBadge
      entities={tokenEntities}
      badgeEntities={chainEntities}
      size={AvatarSize.XXL}
      badgeSize={AvatarSize.SM}
      content={{
        title: 'Large Tokens',
        titleVariant: 'bodyLargeStrong',
        hintVariant: 'bodyXSmall',
      }}
    />
  ),
};

export const NoBadge: StoryObj<typeof EntityStackWithBadge> = {
  render: () => (
    <EntityStackWithBadge
      entities={tokenEntities}
      limit={3}
      content={{
        title: 'Token Stack',
        hint: 'No chain badges',
      }}
    />
  ),
};

export const CustomHint: StoryObj<typeof EntityStackWithBadge> = {
  render: () => (
    <EntityStackWithBadge
      entities={[mockExtendedTokens.eth]}
      badgeEntities={[chainEntities[0]]}
      content={{
        title: 'Ethereum',
        hint: 'Mainnet',
      }}
    />
  ),
};
