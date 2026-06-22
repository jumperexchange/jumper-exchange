import { maxBy } from 'lodash';
import Avatar from '@mui/material/Avatar';
import { useGetColorsFromImage } from '@/hooks/images/useGetColorsFromImage';

interface PartnerThemeIconProps {
  src: string;
  alt: string;
}

export const PartnerThemeIcon = ({ src, alt }: PartnerThemeIconProps) => {
  const colors = useGetColorsFromImage(src);
  const dominantColor = maxBy(
    colors.filter((c) => c.area > 0.1),
    'area',
  );
  const isLightIcon = (dominantColor?.lightness ?? 0) > 0.5;

  return (
    <Avatar
      src={src}
      alt={alt}
      sx={(muiTheme) => ({
        height: 24,
        width: 24,
        filter: 'grayscale(1)',
        ...(isLightIcon
          ? muiTheme.applyStyles('light', { filter: 'grayscale(1) invert(1)' })
          : muiTheme.applyStyles('dark', { filter: 'grayscale(1) invert(1)' })),
      })}
    />
  );
};
