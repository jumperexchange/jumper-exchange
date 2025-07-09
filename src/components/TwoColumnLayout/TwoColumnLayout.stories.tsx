import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TwoColumnLayout } from './TwoColumnLayout';
import Box from '@mui/material/Box';

const meta = {
  title: 'Layout/TwoColumnLayout',
  component: TwoColumnLayout,
  tags: ['autodocs'],
} satisfies Meta<typeof TwoColumnLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const PlaceholderBox = ({
  minHeight = '100%',
}: {
  minHeight?: string | number;
}) => (
  <Box
    sx={{
      backgroundColor: '#e0e0e0',
      borderRadius: 3,
      p: 3,
      minHeight,
      height: '100%',
      width: '100%',
    }}
  />
);

export const Default: Story = {
  args: {
    mainContent: <PlaceholderBox minHeight={600} />,
    sideContent: <PlaceholderBox minHeight={320} />,
  },
};
