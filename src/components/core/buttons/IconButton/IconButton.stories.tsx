import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from './IconButton';
import { Variant as IconButtonVariant, Size as IconButtonSize } from '../types';

const meta = {
  title: 'Core/Buttons/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(IconButtonVariant),
    },
    size: {
      control: { type: 'select' },
      options: Object.values(IconButtonSize),
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: IconButtonVariant.Default,
    size: IconButtonSize.MD,
    'aria-label': 'Add item',
    children: <AddIcon />,
  },
};

export const AllVariants: Story = {
  args: {
    variant: IconButtonVariant.Default,
    size: IconButtonSize.MD,
    'aria-label': 'Action',
    children: <AddIcon />,
  },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <IconButton variant={IconButtonVariant.Default} aria-label="Default">
        <AddIcon />
      </IconButton>
      <IconButton variant={IconButtonVariant.Primary} aria-label="Primary">
        <AddIcon />
      </IconButton>
      <IconButton variant={IconButtonVariant.Secondary} aria-label="Secondary">
        <SettingsIcon />
      </IconButton>
      <IconButton
        variant={IconButtonVariant.AlphaLight}
        aria-label="Alpha Light"
      >
        <SearchIcon />
      </IconButton>
      <IconButton variant={IconButtonVariant.AlphaDark} aria-label="Alpha Dark">
        <CloseIcon />
      </IconButton>
      <IconButton
        variant={IconButtonVariant.LightBorder}
        aria-label="Light Border"
      >
        <AddIcon />
      </IconButton>
      <IconButton variant={IconButtonVariant.Disabled} aria-label="Disabled">
        <AddIcon />
      </IconButton>
      <IconButton
        variant={IconButtonVariant.Borderless}
        aria-label="Borderless"
      >
        <AddIcon />
      </IconButton>
      <IconButton variant={IconButtonVariant.Success} aria-label="Success">
        <AddIcon />
      </IconButton>
    </div>
  ),
};

export const AllSizes: Story = {
  args: {
    variant: IconButtonVariant.Primary,
    size: IconButtonSize.MD,
    'aria-label': 'Action',
    children: <AddIcon />,
  },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <IconButton
        variant={IconButtonVariant.Primary}
        size={IconButtonSize.XS}
        aria-label="XS"
      >
        <AddIcon />
      </IconButton>
      <IconButton
        variant={IconButtonVariant.Primary}
        size={IconButtonSize.SM}
        aria-label="SM"
      >
        <AddIcon />
      </IconButton>
      <IconButton
        variant={IconButtonVariant.Primary}
        size={IconButtonSize.MD}
        aria-label="MD"
      >
        <AddIcon />
      </IconButton>
      <IconButton
        variant={IconButtonVariant.Primary}
        size={IconButtonSize.LG}
        aria-label="LG"
      >
        <AddIcon />
      </IconButton>
      <IconButton
        variant={IconButtonVariant.Primary}
        size={IconButtonSize.XL}
        aria-label="XL"
      >
        <AddIcon />
      </IconButton>
    </div>
  ),
};
