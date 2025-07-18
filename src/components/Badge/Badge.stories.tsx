import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from './Badge';
import { BadgeSize, BadgeVariant } from './Badge.styles';

const meta = {
  component: Badge,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(BadgeVariant),
    },
    size: {
      control: { type: 'select' },
      options: Object.values(BadgeSize),
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Default Badge',
    variant: BadgeVariant.Default,
    size: BadgeSize.MD,
  },
};

export const Clickable: Story = {
  args: {
    label: 'Click Me',
    variant: BadgeVariant.Primary,
    size: BadgeSize.MD,
    onClick: () => alert('Badge clicked!'),
  },
};

export const WithStartIcon: Story = {
  args: {
    label: 'Start Icon',
    variant: BadgeVariant.Alpha,
    size: BadgeSize.MD,
    startIcon: <PanoramaFishEyeIcon />,
  },
};

export const WithEndIcon: Story = {
  args: {
    label: 'End Icon',
    variant: BadgeVariant.Alpha,
    size: BadgeSize.MD,
    endIcon: <PanoramaFishEyeIcon />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Both Icons',
    variant: BadgeVariant.Alpha,
    size: BadgeSize.MD,
    startIcon: <PanoramaFishEyeIcon />,
    endIcon: <PanoramaFishEyeIcon />,
  },
};
