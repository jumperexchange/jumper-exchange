import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { action } from 'storybook/actions';

import { FormInput } from './FormInput';
import { EntityChainStack } from '@/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '@/components/composite/EntityChainStack/EntityChainStack.types';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';

const meta = {
  component: FormInput,
  args: {
    onChange: action('on-change'),
    onFocus: action('on-focus'),
    onBlur: action('on-blur'),
  },
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    id: 'proposal-id',
    name: 'proposal-id',
    placeholder: 'Enter proposal ID...',
  },
};

export const Filled: Story = {
  args: {
    id: 'proposal-id',
    name: 'proposal-id',
    placeholder: 'Enter proposal ID...',
    value: '0x3403-4234-4324-1492',
  },
};

export const Disabled: Story = {
  args: {
    id: 'proposal-id',
    name: 'proposal-id',
    placeholder: 'Enter proposal ID...',
    disabled: true,
  },
};

export const Active: Story = {
  args: {
    id: 'proposal-id',
    name: 'proposal-id',
    placeholder: 'Enter proposal ID...',
  },
  parameters: {
    pseudo: { hover: true },
  },
};

export const TokenUSDAmount: Story = {
  args: {
    id: 'token-usd-amount',
    name: 'token-usd-amount',
    placeholder: '$0.00',
    startAdornment: (
      <EntityChainStack
        variant={EntityChainStackVariant.Tokens}
        tokens={[
          {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
            address: '0x0000000000000000000000000000000000000000',
            logo: '',
            chain: {
              chainId: 1,
              chainKey: 'ETH',
            },
          },
        ]}
        tokensSize={AvatarSize.MD}
        chainsSize={AvatarSize['3XS']}
        isContentVisible={false}
      />
    ),
  },
};
