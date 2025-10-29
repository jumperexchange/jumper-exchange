import {
  PercentCircularProgress,
  PercentContainer,
  PercentContent,
  PercentText,
} from './Percent.styles';
import { FC } from 'react';
import { PercentProps, PercentSize } from './Percent.types';
import { TypographyProps } from '@mui/material/Typography';

const getSizeValueInPx = (size: PercentSize) => {
  switch (size) {
    case PercentSize.SM:
      return 24;
    case PercentSize.MD:
      return 40;
    case PercentSize.LG:
      return 48;
    case PercentSize.XL:
      return 56;
    case PercentSize.XXL:
      return 64;
    default:
      return 24;
  }
};

const getTextVariant = (size: PercentSize): TypographyProps['variant'] => {
  switch (size) {
    case PercentSize.XXL:
      return 'bodyLargeStrong';
    case PercentSize.SM:
      return 'bodyXXSmallStrong';
    default:
      return 'bodySmallStrong';
  }
};

export const Percent: FC<PercentProps> = ({ percent, size, children }) => {
  const sizeValueInPx = getSizeValueInPx(size);
  const isTextContent =
    typeof children === 'string' || typeof children === 'number';

  return (
    <PercentContainer sx={{ width: sizeValueInPx, height: sizeValueInPx }}>
      <PercentCircularProgress
        enableTrackSlot
        disableShrink
        value={percent}
        variant="determinate"
        size={sizeValueInPx}
        thickness={2.75}
      />
      <PercentContent>
        {isTextContent ? (
          <PercentText variant={getTextVariant(size)}>{children}</PercentText>
        ) : (
          children
        )}
      </PercentContent>
    </PercentContainer>
  );
};
