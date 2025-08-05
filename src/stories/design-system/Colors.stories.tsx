import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import { useMemo, useEffect } from 'react';
import { baseColors } from 'src/theme/baseColors';
import { brandColors } from 'src/theme/brandColors';
import { paletteLight } from 'src/theme/paletteLight';
import { paletteDark } from 'src/theme/paletteDark';
import { useColorScheme } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// TypeScript interfaces
interface ColorSwatchProps {
  name: string;
  color: string;
  description?: string;
}

interface PaletteViewerProps {
  title: string;
  palette: Record<string, any>;
  whitelist?: string[];
  excludeKeys?: string[];
  showCategories?: boolean;
}

const getRGBAValues = (
  backgroundColor: string,
): { r: number; g: number; b: number; a: number } => {
  const hex = backgroundColor.replace('#', '');
  let r, g, b, a;

  if (hex.length === 3) {
    // short #RGB
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
    a = 1;
  } else if (hex.length === 6 || hex.length === 8) {
    // #RRGGBB or #RRGGBBAA
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
  } else {
    console.error('Invalid hex color format');
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  return { r, g, b, a };
};

const getRGBAFromHex = (backgroundColor: string): string => {
  const { r, g, b, a } = getRGBAValues(backgroundColor);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// Utility function for text color on background
const getContrastColor = (backgroundColor: string): string => {
  const { r, g, b, a } = getRGBAValues(backgroundColor);
  const rBlended = r * a + 255 * (1 - a);
  const gBlended = g * a + 255 * (1 - a);
  const bBlended = b * a + 255 * (1 - a);

  const brightness = (rBlended * 299 + gBlended * 587 + bBlended * 114) / 1000;

  return brightness > 128 ? '#000000' : '#FFFFFF';
};

// Enhanced ColorSwatch with color information
const ColorSwatch = ({ name, color, description }: ColorSwatchProps) => {
  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {name}
          </Typography>
          <Typography variant="caption">{color}</Typography>
          {description && (
            <Typography variant="caption" display="block">
              {description}
            </Typography>
          )}
        </Box>
      }
    >
      <Paper
        sx={(theme) => ({
          borderRadius: 1,
          boxShadow: theme.shadows[2],
          overflow: 'hidden',
          width: 160,
        })}
      >
        <Box
          sx={{
            width: '100%',
            height: 80,
            backgroundColor: color,
            mb: 1,
          }}
        />
        <Box sx={{ px: 2, pt: 1, pb: 2 }}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </Typography>
          <Stack direction="column" spacing={0.5} mt={2}>
            <Typography variant="caption" color="text.secondary">
              {color}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getRGBAFromHex(color)}
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Tooltip>
  );
};

const hasNumericScale = (obj: any): obj is Record<string, string> => {
  if (!obj || typeof obj !== 'object') return false;

  const keys = Object.keys(obj);
  const numericKeys = keys.filter((key) => !isNaN(Number(key)));

  if (numericKeys.length === 0) return false;

  return true;
};

// Enhanced color scale visualization
const ColorScaleViewer = ({
  name,
  colors,
}: {
  name: string;
  colors: Record<string, string>;
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        {name.charAt(0).toUpperCase() + name.slice(1)} Scale
      </Typography>
      <Box
        sx={{
          display: 'flex',
          height: 60,
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: 1,
        }}
      >
        {Object.entries(colors)
          .filter(([key]) => !isNaN(Number(key)))
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([key, color]) => (
            <Box
              key={key}
              sx={{
                flex: 1,
                bgcolor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: getContrastColor(color),
              }}
            >
              {key}
            </Box>
          ))}
      </Box>
    </Box>
  );
};

const renderColorSection = (
  title: string,
  colors: Array<{ name: string; color: string }>,
) => {
  if (colors.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        {title}
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {colors.map(({ name, color }) => (
          <ColorSwatch key={name} name={name} color={color} />
        ))}
      </Stack>
    </Box>
  );
};

const renderColorObject = (name: string, colorObj: any) => {
  return (
    <Box key={name} sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {Object.entries(colorObj).map(([variant, color]) => (
          <ColorSwatch
            key={variant}
            name={`${name.charAt(0).toUpperCase() + name.slice(1)} ${variant}`}
            color={color as string}
          />
        ))}
      </Stack>
    </Box>
  );
};

const processPaletteEntries = (
  entries: [string, any][],
  excludeKeys: string[] = [],
) => {
  const stringColors: Array<{ name: string; color: string }> = [];
  const objectColors: Array<{ name: string; colorObj: any }> = [];

  entries.forEach(([key, colorObj]) => {
    if (excludeKeys.includes(key)) return;

    if (typeof colorObj === 'string') {
      stringColors.push({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        color: colorObj,
      });
    } else if (typeof colorObj === 'object' && colorObj !== null) {
      objectColors.push({
        name: key,
        colorObj,
      });
    }
  });

  return { stringColors, objectColors };
};

// Memoized palette processing hook
const useMemoizedPalette = (
  palette: any,
  whitelist: string[],
  excludeKeys: string[] = [],
) => {
  return useMemo(() => {
    const filteredEntries = Object.entries(palette).filter(
      ([key]) => whitelist.includes(key) && !excludeKeys.includes(key),
    );
    return processPaletteEntries(filteredEntries, excludeKeys);
  }, [palette, whitelist, excludeKeys]);
};

// Development utilities
const usePaletteDebug = (palette: any, componentName: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`${componentName} Palette Debug`);
      console.log('Palette keys:', Object.keys(palette));
      console.log('Palette size:', JSON.stringify(palette).length);
      console.log('Sample entries:', Object.entries(palette).slice(0, 3));
      console.groupEnd();
    }
  }, [palette, componentName]);
};

// Error boundary component
const SafePaletteViewer = ({
  palette,
  title,
  ...props
}: PaletteViewerProps) => {
  if (!palette || Object.keys(palette).length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          No palette data available for {title}. Check theme configuration.
        </Alert>
      </Box>
    );
  }

  return <PaletteViewer palette={palette} title={title} {...props} />;
};

// Main palette viewer component
const PaletteViewer = ({
  title,
  palette,
  whitelist = [],
  excludeKeys = ['semanticPalette', 'mode'],
  showCategories = true,
}: PaletteViewerProps) => {
  const { stringColors, objectColors } = useMemoizedPalette(
    palette,
    whitelist,
    excludeKeys,
  );

  usePaletteDebug(palette, title);

  return (
    <Box sx={{ p: 3, maxWidth: 1200 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      {objectColors.map(({ name, colorObj }) => {
        if (hasNumericScale(colorObj)) {
          return <ColorScaleViewer key={name} name={name} colors={colorObj} />;
        } else if (typeof colorObj === 'object' && 'main' in colorObj) {
          return renderColorObject(name, colorObj);
        }
        return null;
      })}

      {renderColorSection('Single Colors', stringColors)}
    </Box>
  );
};

const BaseColorsPalette = () => {
  return (
    <SafePaletteViewer
      title="Base Colors"
      palette={baseColors}
      whitelist={Object.keys(baseColors)}
    />
  );
};

const BrandColorsPalette = () => {
  const { mode } = useColorScheme();
  const currentMode = mode === 'system' ? 'light' : mode || 'light';

  return (
    <SafePaletteViewer
      title={`Brand Colors (${currentMode})`}
      palette={brandColors[currentMode]}
      whitelist={Object.keys(brandColors[currentMode])}
    />
  );
};

const CurrentThemePaletteComponent = () => {
  const { mode } = useColorScheme();
  const theme = useTheme();

  // Get the correct palette based on current mode
  const currentMode = mode === 'system' ? 'light' : mode || 'light';
  const currentPalette =
    theme.colorSchemes?.[currentMode]?.palette || theme.palette;

  // Whitelist of properties to show
  const whitelistedProps = Object.keys(paletteLight).concat([
    'surface3',
    'surface2',
    'surface1',
    'accent2',
    'accent1Alt',
    'accent1',
    'tertiary',
    'secondary',
    'primary',
    'bg',
    'bgSecondary',
    'bgTertiary',
    'bgQuaternary',
    'grey',
    'text',
    'background',
  ]);

  return (
    <SafePaletteViewer
      title={`Theme Palette Colors (${mode})`}
      palette={currentPalette}
      whitelist={whitelistedProps}
    />
  );
};

const SemanticPaletteComponent = () => {
  const { mode } = useColorScheme();
  const currentPalette = mode === 'light' ? paletteLight : paletteDark;
  const isNotBaseColor = (key: string) => !(key in baseColors);

  const filteredPalette = useMemo(() => {
    const filtered = Object.entries(currentPalette).filter(([key]) =>
      isNotBaseColor(key),
    );
    return Object.fromEntries(filtered);
  }, [currentPalette]);

  return (
    <SafePaletteViewer
      title={`Semantic Palette Colors (${mode})`}
      palette={filteredPalette}
      whitelist={Object.keys(filteredPalette)}
    />
  );
};

const meta = {
  title: 'Design System/Colors',
  component: BaseColorsPalette,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Comprehensive color system documentation with accessibility checking and interactive features.`,
      },
    },
  },
} satisfies Meta<typeof BaseColorsPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const BaseColors: Story = {
  render: () => <BaseColorsPalette />,
  parameters: {
    docs: {
      description: {
        story:
          'This story showcases the base colors used in the Jumper Exchange application with accessibility checking.',
      },
    },
  },
};

export const BrandColors: Story = {
  render: () => <BrandColorsPalette />,
  parameters: {
    docs: {
      description: {
        story:
          'This story showcases only the brand colors used in the Jumper Exchange application.',
      },
    },
  },
};

export const SemanticPalette: Story = {
  render: () => <SemanticPaletteComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'This story showcases semantic palette colors for the current theme mode, excluding baseColors.',
      },
    },
  },
};

export const CurrentThemePalette: Story = {
  render: () => <CurrentThemePaletteComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive theme palette viewer with real-time mode switching and accessibility checking.',
      },
    },
  },
};
