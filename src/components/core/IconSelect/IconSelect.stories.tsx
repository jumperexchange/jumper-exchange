import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconSelect } from './IconSelect';
import { IconOption } from './IconSelect.types';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import PaletteIcon from '@mui/icons-material/Palette';
import BrushIcon from '@mui/icons-material/Brush';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import InvertColorsIcon from '@mui/icons-material/InvertColors';

const meta = {
  title: 'Components/Core/IconSelect',
  component: IconSelect,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'default'],
    },
    selectionMode: {
      control: { type: 'select' },
      options: ['toggle', 'radio'],
    },
    variant: {
      control: { type: 'select' },
      options: ['contained', 'outlined', 'text'],
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical', 'grid'],
    },
  },
} satisfies Meta<typeof IconSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const alignmentOptions: IconOption[] = [
  {
    value: 'left',
    icon: <FormatAlignLeftIcon />,
    tooltip: 'Align Left',
    label: 'Left',
  },
  {
    value: 'center',
    icon: <FormatAlignCenterIcon />,
    tooltip: 'Align Center',
    label: 'Center',
  },
  {
    value: 'right',
    icon: <FormatAlignRightIcon />,
    tooltip: 'Align Right',
    label: 'Right',
  },
  {
    value: 'justify',
    icon: <FormatAlignJustifyIcon />,
    tooltip: 'Justify',
    label: 'Justify',
  },
];

const formattingOptions: IconOption[] = [
  {
    value: 'bold',
    icon: <FormatBoldIcon />,
    tooltip: 'Bold',
  },
  {
    value: 'italic',
    icon: <FormatItalicIcon />,
    tooltip: 'Italic',
  },
  {
    value: 'underlined',
    icon: <FormatUnderlinedIcon />,
    tooltip: 'Underlined',
  },
  {
    value: 'strikethrough',
    icon: <StrikethroughSIcon />,
    tooltip: 'Strikethrough',
  },
];

const viewOptions: IconOption[] = [
  {
    value: 'module',
    icon: <ViewModuleIcon />,
    tooltip: 'Module View',
    label: 'Module',
  },
  {
    value: 'list',
    icon: <ViewListIcon />,
    tooltip: 'List View',
    label: 'List',
  },
  {
    value: 'quilt',
    icon: <ViewQuiltIcon />,
    tooltip: 'Quilt View',
    label: 'Quilt',
  },
  {
    value: 'column',
    icon: <ViewColumnIcon />,
    tooltip: 'Column View',
    label: 'Column',
  },
];

const themeOptions: IconOption[] = [
  {
    value: 'light',
    icon: <LightModeIcon />,
    tooltip: 'Light Mode',
  },
  {
    value: 'dark',
    icon: <DarkModeIcon />,
    tooltip: 'Dark Mode',
  },
  {
    value: 'auto',
    icon: <SettingsBrightnessIcon />,
    tooltip: 'Auto Mode',
  },
];

const colorOptions: IconOption[] = [
  {
    value: 'red',
    icon: <PaletteIcon />,
    color: '#f44336',
    tooltip: 'Red',
  },
  {
    value: 'blue',
    icon: <BrushIcon />,
    color: '#2196f3',
    tooltip: 'Blue',
  },
  {
    value: 'green',
    icon: <ColorLensIcon />,
    color: '#4caf50',
    tooltip: 'Green',
  },
  {
    value: 'purple',
    icon: <InvertColorsIcon />,
    color: '#9c27b0',
    tooltip: 'Purple',
  },
];

export const SingleSelection: Story = {
  args: {
    options: alignmentOptions,
    value: 'left',
    multiple: false,
    size: 'medium',
    variant: 'outlined',
    showTooltip: true,
    showLabel: false,
    selectionMode: 'toggle',
  },
};

export const MultipleSelection: Story = {
  args: {
    options: formattingOptions,
    value: ['bold', 'italic'],
    multiple: true,
    size: 'medium',
    variant: 'outlined',
    showTooltip: true,
    selectionMode: 'toggle',
  },
};

export const WithLabels: Story = {
  args: {
    options: viewOptions,
    value: 'module',
    multiple: false,
    size: 'medium',
    variant: 'outlined',
    showLabel: true,
    showTooltip: false,
    selectionMode: 'toggle',
  },
};

export const RadioMode: Story = {
  args: {
    options: themeOptions,
    value: 'light',
    multiple: false,
    size: 'medium',
    variant: 'outlined',
    selectionMode: 'radio',
    showTooltip: true,
  },
};

export const ColoredIcons: Story = {
  args: {
    options: colorOptions,
    value: 'red',
    multiple: false,
    size: 'medium',
    variant: 'outlined',
    selectionMode: 'toggle',
    showTooltip: true,
  },
};

export const VerticalOrientation: Story = {
  args: {
    options: alignmentOptions,
    value: 'left',
    orientation: 'vertical',
    size: 'medium',
    variant: 'outlined',
    selectionMode: 'toggle',
  },
};

export const GridLayout: Story = {
  args: {
    options: [...alignmentOptions, ...formattingOptions],
    value: [],
    multiple: true,
    orientation: 'grid',
    columns: 4,
    size: 'medium',
    variant: 'outlined',
    selectionMode: 'radio',
    showTooltip: true,
  },
};

export const SmallSize: Story = {
  args: {
    options: themeOptions,
    value: 'light',
    size: 'small',
    variant: 'outlined',
    selectionMode: 'toggle',
  },
};

export const LargeSize: Story = {
  args: {
    options: themeOptions,
    value: 'light',
    size: 'large',
    variant: 'outlined',
    selectionMode: 'toggle',
  },
};

export const ContainedVariant: Story = {
  args: {
    options: alignmentOptions,
    value: 'center',
    variant: 'contained',
    size: 'medium',
    selectionMode: 'toggle',
  },
};

export const TextVariant: Story = {
  args: {
    options: alignmentOptions,
    value: 'center',
    variant: 'text',
    size: 'medium',
    selectionMode: 'toggle',
  },
};

export const Disabled: Story = {
  args: {
    options: alignmentOptions,
    value: 'left',
    disabled: true,
    size: 'medium',
    variant: 'outlined',
    selectionMode: 'toggle',
  },
};

export const SecondaryColor: Story = {
  args: {
    options: formattingOptions,
    value: ['bold'],
    multiple: true,
    color: 'secondary',
    size: 'medium',
    variant: 'outlined',
    selectionMode: 'toggle',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: [
      ...alignmentOptions.slice(0, 2),
      { ...alignmentOptions[2], disabled: true },
      alignmentOptions[3],
    ],
    value: 'left',
    size: 'medium',
    variant: 'outlined',
    selectionMode: 'toggle',
  },
};

export const InteractiveAlignment: Story = {
  args: {
    options: alignmentOptions,
    value: 'left',
    selectionMode: 'radio',
    variant: 'outlined',
    showTooltip: true,
  },
  render: (args) => {
    const [alignment, setAlignment] = useState(args.value as string);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <IconSelect
          {...args}
          value={alignment}
          onChange={(value) => setAlignment(value as string)}
        />
        <div
          style={{
            padding: '20px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            textAlign: alignment as any,
          }}
        >
          <h3>Sample Text</h3>
          <p>This text is aligned according to your selection above.</p>
          <p>Current alignment: {alignment}</p>
        </div>
      </div>
    );
  },
};

export const TextFormatting: Story = {
  args: {
    options: formattingOptions,
    value: ['bold'],
    multiple: true,
    selectionMode: 'toggle',
    variant: 'outlined',
    showTooltip: true,
  },
  render: (args) => {
    const [formats, setFormats] = useState<string[]>(
      (args.value as string[]) || ['bold'],
    );

    const getTextStyle = () => {
      const styles: React.CSSProperties = {};
      if (formats.includes('bold')) styles.fontWeight = 'bold';
      if (formats.includes('italic')) styles.fontStyle = 'italic';
      if (formats.includes('underlined')) styles.textDecoration = 'underline';
      if (formats.includes('strikethrough'))
        styles.textDecoration = 'line-through';
      return styles;
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <IconSelect
          {...args}
          value={formats}
          onChange={(value) => setFormats(value as string[])}
        />
        <div
          style={{
            padding: '20px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          <p style={getTextStyle()}>
            This text demonstrates the selected formatting options.
          </p>
          <p>Active formats: {formats.join(', ') || 'None'}</p>
        </div>
      </div>
    );
  },
};

export const ComplexExample: Story = {
  args: {
    options: viewOptions,
    value: 'module',
    selectionMode: 'radio',
    variant: 'outlined',
  },
  render: () => {
    const [viewMode, setViewMode] = useState('module');
    const [theme, setTheme] = useState('light');
    const [formatting, setFormatting] = useState<string[]>([]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <h3>View Mode (Single Selection)</h3>
          <IconSelect
            options={viewOptions}
            value={viewMode}
            onChange={(value) => setViewMode(value as string)}
            selectionMode="radio"
            variant="outlined"
            showLabel={true}
            showTooltip={false}
          />
        </div>

        <div>
          <h3>Theme Selection (Radio Mode)</h3>
          <IconSelect
            options={themeOptions}
            value={theme}
            onChange={(value) => setTheme(value as string)}
            selectionMode="radio"
            variant="contained"
            color="secondary"
          />
        </div>

        <div>
          <h3>Text Formatting (Multiple Selection)</h3>
          <IconSelect
            options={formattingOptions}
            value={formatting}
            onChange={(value) => setFormatting(value as string[])}
            multiple={true}
            selectionMode="toggle"
            variant="outlined"
            size="large"
          />
        </div>

        <div
          style={{
            padding: '20px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            color: theme === 'dark' ? '#fff' : '#333',
          }}
        >
          <h4>Current Settings:</h4>
          <ul>
            <li>View: {viewMode}</li>
            <li>Theme: {theme}</li>
            <li>Formatting: {formatting.join(', ') || 'None'}</li>
          </ul>
        </div>
      </div>
    );
  },
};
