import { Select } from './Select';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SelectOption, SelectVariant } from './Select.types';
import { Avatar, AvatarSkeleton } from '../../AvatarStack/AvatarStack.styles';
import { AvatarSize } from '../../AvatarStack/AvatarStack.types';
import { action } from 'storybook/actions';

const meta = {
  title: 'Components/Form/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(SelectVariant),
    },
  },
  args: {
    onChange: action('on-change'),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const AvatarRenderer = ({ src }: { src: string }) => {
  return (
    <Avatar
      size={AvatarSize.MD}
      src={src}
      alt={'Avatar for chain'}
      disableBorder={true}
      variant="circular"
    >
      <AvatarSkeleton size={AvatarSize.MD} variant="circular" />
    </Avatar>
  );
};

const basicOptions: SelectOption[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'chain', label: 'Chain' },
  { value: 'protocol', label: 'Protocol' },
  { value: 'type', label: 'Type' },
  { value: 'asset', label: 'Asset' },
  { value: 'apy', label: 'APY' },
  { value: 'tvl', label: 'TVL' },
];

const chainOptions: SelectOption[] = [
  {
    value: 'chain1',
    label: 'Chain 1',
    icon: (
      <AvatarRenderer src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" />
    ),
  },
  {
    value: 'chain2',
    label: 'Chain 2',
    icon: (
      <AvatarRenderer src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png" />
    ),
  },
  {
    value: 'chain3',
    label: 'Chain 3',
    icon: (
      <AvatarRenderer src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png" />
    ),
  },
];

const typeOptions: SelectOption[] = [
  { value: 'type1', label: 'Liquidity' },
  { value: 'type2', label: 'Farming' },
  { value: 'type3', label: 'Yield' },
  { value: 'type4', label: 'Staking' },
  { value: 'type5', label: 'Lending' },
  { value: 'type6', label: 'Structured' },
  { value: 'type7', label: 'Synthetic' },
];

export const MultiSelect: Story = {
  args: {
    options: typeOptions,
    label: 'Type',
    fullWidth: false,
    value: [],
    variant: SelectVariant.Multi,
  },
};

export const MultiSelectWithFilter: Story = {
  args: {
    options: chainOptions,
    label: 'Chain',
    fullWidth: false,
    value: [],
    filterBy: 'chain',
    variant: SelectVariant.Multi,
  },
};

export const MultiSelectWithIcons: Story = {
  args: {
    options: chainOptions,
    label: 'Chain',
    fullWidth: false,
    value: [],
    variant: SelectVariant.Multi,
  },
};

export const MultiSelectWithSelectedValue: Story = {
  args: {
    options: chainOptions,
    label: 'Chain',
    fullWidth: false,
    value: [chainOptions[0].value],
    variant: SelectVariant.Multi,
  },
};

export const SingleSelect: Story = {
  args: {
    options: basicOptions,
    fullWidth: false,
    value: '',
    variant: SelectVariant.Single,
  },
};
