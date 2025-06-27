import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BaseAlert } from './BaseAlert';

import EvStationRoundedIcon from '@mui/icons-material/EvStationRounded';
import Switch from '@mui/material/Switch';
import { Button } from 'src/components/Button';

const meta = {
  component: BaseAlert,
} satisfies Meta<typeof BaseAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicAlert: Story = {
  args: {
    title: 'API Key',
    description:
      'This key is generated only once. Store it in a safe place. You should not use it in frontend. The key should only be used in backend or via scripts.',
  },
};

export const AlertWithTitleOnly: Story = {
  args: {
    title: '3.5% slippage',
    variant: 'warning',
  },
};

export const AlertWithDescriptionOnly: Story = {
  args: {
    description: 'You don’t have enough funds to execute the swap.',
  },
};

export const AlertWithHeaderIcon: Story = {
  args: {
    title: 'Get gas',
    headerAppend: <EvStationRoundedIcon sx={{ height: 24, width: 24 }} />,
  },
};

export const AlertWithHeaderSwitchAndIcon: Story = {
  args: {
    title: 'Get gas',
    headerAppend: <EvStationRoundedIcon sx={{ height: 24, width: 24 }} />,
    headerPrepend: <Switch />, // Need to add our custom switch component
  },
};

export const AlertWithActionButton: Story = {
  args: {
    description:
      'You’re using custom settings limiting the number of available routes.',
    variant: 'info',
    children: (
      <Button
        fullWidth
        size="small"
        variant="transparent"
        styles={(theme) => ({
          ...theme.typography.bodySmallStrong,
          borderRadius: `${theme.shape.borderRadius}px !important`,
          backgroundColor: `${(theme.vars || theme).palette.alphaLight100.main} !important`,
          ...theme.applyStyles('light', {
            backgroundColor: `${(theme.vars || theme).palette.alphaLight700.main} !important`,
          }),
        })}
      >
        Confirm
      </Button>
    ),
  },
};
