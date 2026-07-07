import type { TypographyProps } from '@mui/material/Typography';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import { Tooltip } from 'src/components/core/Tooltip/Tooltip';
import {
  TitleWithHintContainer,
  TitleWithHintTitle,
} from './TitleWithHint.styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { HintItem } from './HintItem';

export interface TitleWithHintItem {
  key: string;
  label: ReactNode;
  hoverContent?: ReactNode;
}

interface TitleWithHintsProps extends PropsWithChildren {
  title: string;
  titleVariant: TypographyProps['variant'];
  titleTooltip?: string;
  titleDataTestId?: string;
  /** Independent hint items, each with its own optional hover reveal */
  hintItems: TitleWithHintItem[];
  /** Layout direction for `hintItems` */
  hintItemsDirection?: 'row' | 'column';
  hintVariant?: TypographyProps['variant'];
  hintDataTestId?: string;
  gap?: number;
  sx?: SxProps<Theme>;
}

/**
 * Like TitleWithHint, but the hint is a list of independently hoverable items
 * instead of one combined hint + hintOnHover block.
 */
export const TitleWithHints: FC<TitleWithHintsProps> = ({
  title,
  titleTooltip,
  hintItems,
  hintItemsDirection = 'row',
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
          hintItems.length > 0 && (
            <Stack
              direction={hintItemsDirection}
              sx={{
                gap: 0.5,
                minWidth: 0,
                flexWrap: hintItemsDirection === 'row' ? 'wrap' : undefined,
              }}
            >
              {hintItems.map((item) => (
                <HintItem
                  key={item.key}
                  label={item.label}
                  hoverContent={item.hoverContent}
                  hintVariant={hintVariant}
                  dataTestId={hintDataTestId}
                />
              ))}
            </Stack>
          )}
    </TitleWithHintContainer>
  );
};
