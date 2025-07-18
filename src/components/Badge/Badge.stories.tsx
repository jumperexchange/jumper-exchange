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
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
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

export const Success: Story = {
  args: {
    label: 'Success Badge',
    variant: BadgeVariant.Success,
    size: BadgeSize.MD,
  },
};

export const Error: Story = {
  args: {
    label: 'Error Badge',
    variant: BadgeVariant.Error,
    size: BadgeSize.MD,
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning Badge',
    variant: BadgeVariant.Warning,
    size: BadgeSize.MD,
  },
};

export const Alpha: Story = {
  args: {
    label: 'Alpha Badge',
    variant: BadgeVariant.Alpha,
    size: BadgeSize.MD,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Badge',
    variant: BadgeVariant.Disabled,
    size: BadgeSize.MD,
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary Badge',
    variant: BadgeVariant.Primary,
    size: BadgeSize.MD,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Badge',
    variant: BadgeVariant.Secondary,
    size: BadgeSize.MD,
  },
};

export const Tertiary: Story = {
  args: {
    label: 'Tertiary Badge',
    variant: BadgeVariant.Tertiary,
    size: BadgeSize.MD,
  },
};

export const Small: Story = {
  args: {
    label: 'Small Badge',
    variant: BadgeVariant.Alpha,
    size: BadgeSize.SM,
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium Badge',
    variant: BadgeVariant.Alpha,
    size: BadgeSize.MD,
  },
};

export const Large: Story = {
  args: {
    label: 'Large Badge',
    variant: BadgeVariant.Alpha,
    size: BadgeSize.LG,
  },
};

export const ExtraLarge: Story = {
  args: {
    label: 'Extra Large Badge',
    variant: BadgeVariant.Alpha,
    size: BadgeSize.XL,
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
