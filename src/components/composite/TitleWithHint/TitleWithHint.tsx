import { TypographyProps } from '@mui/material/Typography';
import { FC, PropsWithChildren } from 'react';
import {
  TitleWithHintContainer,
  TitleWithHintTitle,
  TitleWithHintHint,
} from './TitleWithHint.styles';
import { SxProps, Theme } from '@mui/material/styles';
import { Tooltip } from 'src/components/core/Tooltip/Tooltip';

interface TitleWithHintProps extends PropsWithChildren {
  title: string;
  titleVariant: TypographyProps['variant'];
  titleTooltip?: string;
  titleDataTestId?: string;
  hint?: string;
  hintVariant?: TypographyProps['variant'];
  hintDataTestId?: string;
  gap?: number;
  sx?: SxProps<Theme>;
}

export const TitleWithHint: FC<TitleWithHintProps> = ({
  title,
  titleTooltip,
  hint,
  titleVariant,
  hintVariant,
  titleDataTestId,
  hintDataTestId,
  gap,
  children,
  sx,
}) => {
  return (
    <TitleWithHintContainer gap={gap} sx={sx}>
      <TitleWithHintTitle variant={titleVariant} data-testid={titleDataTestId}>
        {titleTooltip ? (
          <Tooltip title={titleTooltip}>
            <span>{title}</span>
          </Tooltip>
        ) : (
          title
        )}
      </TitleWithHintTitle>
      {children
        ? children
        : hintVariant &&
          hint && (
            <TitleWithHintHint
              variant={hintVariant}
              data-testid={hintDataTestId}
            >
              {hint}
            </TitleWithHintHint>
          )}
    </TitleWithHintContainer>
  );
};
