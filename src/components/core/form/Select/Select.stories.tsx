import { Select } from './Select';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SelectVariant } from './Select.types';
import { Avatar, AvatarSkeleton } from '../../AvatarStack/AvatarStack.styles';
import { AvatarSize } from '../../AvatarStack/AvatarStack.types';

const meta = {
  title: 'Components/Form/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderAvatar = (src: string) => {
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

const basicOptions: any[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
  { value: 'option6', label: 'Option 6' },
];

const chainOptions: any[] = [
  {
    value: 'chain1',
    label: 'Chain 1',
    icon: renderAvatar(
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    ),
  },
  {
    value: 'chain2',
    label: 'Chain 2',
    icon: renderAvatar(
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    ),
  },
  {
    value: 'chain3',
    label: 'Chain 3',
    icon: renderAvatar(
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
    ),
  },
];

export const MultiSelect: Story = {
  args: {
    options: basicOptions,
    label: 'Choose Options',
    fullWidth: false,
    onChange: () => {},
    value: [],
    variant: SelectVariant.Multi,
  },
};

export const MultiSelectWithFilter: Story = {
  args: {
    options: basicOptions,
    label: 'Choose Options',
    fullWidth: false,
    onChange: () => {},
    value: [],
    filterBy: 'Option',
    variant: SelectVariant.Multi,
  },
};

export const MultiSelectWithIcons: Story = {
  args: {
    options: chainOptions,
    label: 'Chains',
    fullWidth: false,
    onChange: () => {},
    value: [],
    variant: SelectVariant.Multi,
  },
};

export const SingleSelect: Story = {
  args: {
    options: basicOptions,
    label: 'Choose Options',
    fullWidth: false,
    onChange: () => {},
    value: '',
    variant: SelectVariant.Single,
  },
};
